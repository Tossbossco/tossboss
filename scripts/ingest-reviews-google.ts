#!/usr/bin/env tsx
/**
 * Ingest Google place reviews into Spark evidence format.
 *
 * Usage:
 *   npx tsx scripts/ingest-reviews-google.ts <slug>
 *   npx tsx scripts/ingest-reviews-google.ts <slug> --place-id=<placeId>
 *   npx tsx scripts/ingest-reviews-google.ts <slug> --query="Greenwood Apartments Cumming GA"
 *
 * Requirements:
 *   - GOOGLE_MAPS_API_KEY in environment
 */

import fs from "fs";
import path from "path";

type Sentiment = "negative" | "neutral" | "positive";
type Confidence = "high" | "medium" | "low";

interface SparkFile {
  slug: string;
  businessName: string;
}

interface ReviewEvidenceItem {
  source: "google";
  sourceUrl: string;
  sourceId?: string;
  platformRating?: number;
  reviewDate: string;
  capturedDate: string;
  authorHandle?: string;
  textRaw: string;
  textSnippet: string;
  tags: string[];
  sentiment: Sentiment;
  relevanceScore: number;
  severityScore: number;
  confidence: Confidence;
}

interface EvidenceFile {
  slug: string;
  capturedAt: string;
  confidence: Confidence;
  totalAnalyzed: number;
  relevantFound: number;
  sources: string[];
  items: ReviewEvidenceItem[];
}

interface ParsedArgs {
  slug: string;
  placeId?: string;
  query?: string;
}

function parseArgs(argv: string[]): ParsedArgs {
  const slug = argv[2];
  if (!slug) {
    console.error("Usage: npx tsx scripts/ingest-reviews-google.ts <slug> [--place-id=...] [--query=...]");
    process.exit(1);
  }

  let placeId: string | undefined;
  let query: string | undefined;

  for (const arg of argv.slice(3)) {
    if (arg.startsWith("--place-id=")) {
      placeId = arg.replace("--place-id=", "").trim();
    }
    if (arg.startsWith("--query=")) {
      query = arg.replace("--query=", "").trim();
    }
  }

  return { slug, placeId, query };
}

const { slug, placeId: providedPlaceId, query: providedQuery } = parseArgs(process.argv);

const apiKey = process.env.GOOGLE_MAPS_API_KEY;
if (!apiKey) {
  console.error("Error: GOOGLE_MAPS_API_KEY is not set");
  process.exit(1);
}
const googleApiKey = apiKey;

const SPARKS_DIR = path.join(process.cwd(), "lib/data/sparks");
const REVIEWS_DIR = path.join(process.cwd(), "lib/data/review-evidence");
const sparkPath = path.join(SPARKS_DIR, `${slug}.json`);
const outputPath = path.join(REVIEWS_DIR, `${slug}.reviews.json`);

if (!fs.existsSync(sparkPath)) {
  console.error(`Error: Spark ${slug} not found. Run create-spark first.`);
  process.exit(1);
}

if (!fs.existsSync(REVIEWS_DIR)) {
  fs.mkdirSync(REVIEWS_DIR, { recursive: true });
}

const spark = JSON.parse(fs.readFileSync(sparkPath, "utf-8")) as SparkFile;

const capturedDate = new Date().toISOString().split("T")[0];

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`);
  }
  return response.json();
}

async function resolvePlaceId(query: string): Promise<string> {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${encodeURIComponent(googleApiKey)}`;
  const payload = await fetchJson(url) as { status?: string; results?: Array<{ place_id?: string }> };

  if (!payload.results || payload.results.length === 0 || !payload.results[0]?.place_id) {
    throw new Error(`No place_id found for query: ${query}`);
  }

  return payload.results[0].place_id;
}

async function fetchPlaceDetails(placeId: string) {
  const fields = [
    "name",
    "url",
    "reviews",
    "rating",
    "user_ratings_total",
  ].join(",");

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=${encodeURIComponent(fields)}&key=${encodeURIComponent(googleApiKey)}`;
  const payload = await fetchJson(url) as {
    status?: string;
    result?: {
      url?: string;
      reviews?: Array<{
        author_name?: string;
        rating?: number;
        text?: string;
        time?: number;
      }>;
    };
  };

  return payload.result;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeTag(tag: string): string {
  return tag.toLowerCase().trim().replace(/\s+/g, "_");
}

const TAG_KEYWORDS: Array<{ tag: string; patterns: RegExp[] }> = [
  { tag: "missed_pickup", patterns: [/missed pickup/i, /didn'?t pick up/i, /no pickup/i] },
  { tag: "overflow", patterns: [/overflow/i, /piles? up/i, /piled up/i] },
  { tag: "odor", patterns: [/smell/i, /odor/i, /stink/i] },
  { tag: "communication", patterns: [/no notice/i, /never told/i, /communication/i, /didn'?t respond/i] },
  { tag: "issue_response", patterns: [/no response/i, /slow response/i, /days later/i, /weeks? later/i] },
  { tag: "reliability", patterns: [/inconsistent/i, /unreliable/i, /every week/i, /weekend/i] },
  { tag: "dumpster_area", patterns: [/dumpster/i, /breezeway/i, /hallway/i] },
  { tag: "resident_experience", patterns: [/resident/i, /frustrating/i, /annoying/i, /convenience/i] },
  { tag: "pests", patterns: [/pest/i, /roach/i, /rat/i] },
];

function extractTags(text: string): string[] {
  const tags = new Set<string>();
  for (const rule of TAG_KEYWORDS) {
    if (rule.patterns.some((p) => p.test(text))) {
      tags.add(rule.tag);
    }
  }
  return Array.from(tags).map(normalizeTag);
}

function inferSentiment(text: string, rating: number): Sentiment {
  const negativeHints = /(missed|never|bad|terrible|awful|overflow|smell|odor|late|unreliable)/i;
  const positiveHints = /(great|excellent|good|clean|reliable|on time|professional)/i;

  if (rating <= 2) return "negative";
  if (rating >= 4 && positiveHints.test(text) && !negativeHints.test(text)) return "positive";
  if (negativeHints.test(text)) return "negative";
  if (rating === 3) return "neutral";
  return rating >= 4 ? "positive" : "neutral";
}

function scoreRelevance(tags: string[], text: string): number {
  let score = tags.length * 18;
  if (/trash|valet|pickup|dumpster|breezeway|hallway/i.test(text)) score += 25;
  if (/resident|office|manager|complaint/i.test(text)) score += 10;
  return clamp(score, 20, 98);
}

function scoreSeverity(tags: string[], sentiment: Sentiment, text: string): number {
  let score = 35;
  if (sentiment === "negative") score += 20;
  if (tags.includes("missed_pickup")) score += 20;
  if (tags.includes("overflow") || tags.includes("odor")) score += 12;
  if (tags.includes("pests")) score += 18;
  if (/every week|for days|for weeks|always|non-existent/i.test(text)) score += 10;
  return clamp(score, 25, 98);
}

function itemConfidence(relevanceScore: number, severityScore: number): Confidence {
  if (relevanceScore >= 85 && severityScore >= 75) return "high";
  if (relevanceScore >= 65) return "medium";
  return "low";
}

function calculateEvidenceConfidence(relevantCount: number, sourceCount: number): Confidence {
  if (relevantCount >= 12 && sourceCount >= 2) return "high";
  if (relevantCount >= 6) return "medium";
  return "low";
}

async function main() {
  const query = providedQuery || `${spark.businessName}`;
  const placeId = providedPlaceId || await resolvePlaceId(query);

  const details = await fetchPlaceDetails(placeId);
  const reviews = details?.reviews || [];
  const sourceUrl = details?.url || `https://maps.google.com/?q=place_id:${placeId}`;

  if (reviews.length === 0) {
    console.error("Error: No reviews returned from Google Place Details.");
    process.exit(1);
  }

  const items: ReviewEvidenceItem[] = reviews
    .filter((review) => Boolean(review.text && review.time))
    .map((review) => {
      const text = (review.text || "").trim();
      const rating = review.rating || 0;
      const tags = extractTags(text);
      const sentiment = inferSentiment(text, rating);
      const relevanceScore = scoreRelevance(tags, text);
      const severityScore = scoreSeverity(tags, sentiment, text);

      return {
        source: "google",
        sourceUrl,
        sourceId: placeId,
        platformRating: rating,
        reviewDate: new Date((review.time || 0) * 1000).toISOString().split("T")[0],
        capturedDate,
        authorHandle: review.author_name,
        textRaw: text,
        textSnippet: text,
        tags,
        sentiment,
        relevanceScore,
        severityScore,
        confidence: itemConfidence(relevanceScore, severityScore),
      };
    });

  const relevantItems = items.filter((i) => i.relevanceScore >= 60);
  const evidence: EvidenceFile = {
    slug,
    capturedAt: capturedDate,
    confidence: calculateEvidenceConfidence(relevantItems.length, 1),
    totalAnalyzed: items.length,
    relevantFound: relevantItems.length,
    sources: ["google"],
    items,
  };

  fs.writeFileSync(outputPath, JSON.stringify(evidence, null, 2));

  console.log(`✓ Ingested Google reviews for ${slug}`);
  console.log(`✓ Place ID: ${placeId}`);
  console.log(`✓ Reviews analyzed: ${items.length}`);
  console.log(`✓ Relevant reviews: ${relevantItems.length}`);
  console.log(`✓ Evidence confidence: ${evidence.confidence}`);
  console.log(`✓ Output: ${outputPath}`);
}

main().catch((error) => {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
