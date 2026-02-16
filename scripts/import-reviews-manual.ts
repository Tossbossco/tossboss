#!/usr/bin/env tsx
/**
 * Import review evidence from manual curation
 * Usage: npx tsx scripts/import-reviews-manual.ts <slug>
 * 
 * Expects a JSON file at: lib/data/review-evidence/<slug>-input.json
 * with the shape: { items: ReviewEvidenceItem[] }
 */

import fs from "fs";
import path from "path";

interface ReviewEvidenceItem {
  source: string;
  reviewDate: string;
  textRaw: string;
  textSnippet: string;
  tags: string[];
  sentiment: string;
  relevanceScore: number;
  severityScore: number;
  confidence: string;
}

interface ImportInput {
  items: ReviewEvidenceItem[];
}

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npx tsx scripts/import-reviews-manual.ts <slug>");
  process.exit(1);
}

const SPARKS_DIR = path.join(process.cwd(), "lib/data/sparks");
const REVIEWS_DIR = path.join(process.cwd(), "lib/data/review-evidence");
const inputPath = path.join(REVIEWS_DIR, `${slug}-input.json`);
const outputPath = path.join(REVIEWS_DIR, `${slug}.reviews.json`);

// Check spark exists
if (!fs.existsSync(path.join(SPARKS_DIR, `${slug}.json`))) {
  console.error(`Error: Spark ${slug} does not exist. Run create-spark first.`);
  process.exit(1);
}

// Check input file exists
if (!fs.existsSync(inputPath)) {
  console.error(`Error: Input file not found: ${inputPath}`);
  console.error("\nCreate a file with this structure:");
  console.error(JSON.stringify({
    items: [{
      source: "google",
      reviewDate: "2025-12-01",
      textRaw: "Full review text",
      textSnippet: "Quoted excerpt",
      tags: ["missed_pickup"],
      sentiment: "negative",
      relevanceScore: 90,
      severityScore: 85,
      confidence: "high"
    }]
  }, null, 2));
  process.exit(1);
}

// Read and validate input
const input: ImportInput = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

if (!input.items || !Array.isArray(input.items)) {
  console.error("Error: Input must have 'items' array");
  process.exit(1);
}

// Add metadata and write output
const output = {
  slug,
  capturedAt: new Date().toISOString().split("T")[0],
  confidence: calculateConfidence(input.items),
  totalAnalyzed: input.items.length,
  relevantFound: input.items.filter((i) => i.relevanceScore > 50).length,
  sources: [...new Set(input.items.map((i) => i.source))],
  items: input.items
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`✓ Imported ${input.items.length} reviews`);
console.log(`✓ File: ${outputPath}`);
console.log(`\nConfidence: ${output.confidence}`);
console.log(`Sources: ${output.sources.join(", ")}`);

function calculateConfidence(items: ReviewEvidenceItem[]): string {
  if (items.length >= 12) return "high";
  if (items.length >= 6) return "medium";
  return "low";
}
