#!/usr/bin/env tsx
/**
 * Quality assurance check for Spark package
 * Usage: npx tsx scripts/qa-spark.ts <slug>
 */

import fs from "fs";
import path from "path";

interface ReviewEvidenceItem {
  source: string;
  reviewDate: string;
  textSnippet: string;
  tags?: string[];
}

interface ReviewEvidence {
  items?: ReviewEvidenceItem[];
  confidence?: string;
}

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npx tsx scripts/qa-spark.ts <slug>");
  process.exit(1);
}

const SPARKS_DIR = path.join(process.cwd(), "lib/data/sparks");
const REVIEWS_DIR = path.join(process.cwd(), "lib/data/review-evidence");
const sparkPath = path.join(SPARKS_DIR, `${slug}.json`);
const reviewsPath = path.join(REVIEWS_DIR, `${slug}.reviews.json`);

let passed = 0;
let failed = 0;

console.log(`QA Check: ${slug}\n`);

// Check spark file exists
if (!fs.existsSync(sparkPath)) {
  console.error("✗ Spark file not found");
  process.exit(1);
}

const spark = JSON.parse(fs.readFileSync(sparkPath, "utf-8"));

// Required fields check
const requiredFields = ["slug", "businessName", "units", "reviewRiskScan", "vendorScorecard", "noiOpportunity"];
requiredFields.forEach(field => {
  if (spark[field]) {
    console.log(`✓ ${field} present`);
    passed++;
  } else {
    console.error(`✗ ${field} missing`);
    failed++;
  }
});

// Check review evidence
  if (fs.existsSync(reviewsPath)) {
  const evidence: ReviewEvidence = JSON.parse(fs.readFileSync(reviewsPath, "utf-8"));
  
  if (evidence.items && evidence.items.length > 0) {
    console.log(`✓ Review evidence: ${evidence.items.length} items`);
    passed++;
    
    // Check citations
    const withCitations = evidence.items.filter((i) => i.source && i.reviewDate).length;
    if (withCitations === evidence.items.length) {
      console.log(`✓ All reviews have citations (source + date)`);
      passed++;
    } else {
      console.error(`✗ ${evidence.items.length - withCitations} reviews missing citations`);
      failed++;
    }
    
    // Check confidence
    if (evidence.confidence) {
      console.log(`✓ Evidence confidence: ${evidence.confidence}`);
      passed++;
    } else {
      console.error(`✗ Evidence confidence not set`);
      failed++;
    }
  } else {
    console.error(`✗ No review evidence items`);
    failed++;
  }
} else {
  console.error(`✗ Review evidence file not found`);
  failed++;
}

// Check for placeholder tokens
const sparkJson = JSON.stringify(spark);
const placeholderPatterns = [
  /\[placeholder\]/i,
  /\[.*TODO.*\]/i,
  /\[.*FIXME.*\]/i,
  /\[example\]/i,
  /\[template\]/i,
  /\[.*\?\]/
];
const foundPlaceholders = placeholderPatterns.filter(p => p.test(sparkJson));

if (foundPlaceholders.length === 0) {
  console.log(`✓ No placeholder tokens found`);
  passed++;
} else {
  console.error(`✗ Found placeholder tokens: ${foundPlaceholders.length} patterns matched`);
  failed++;
}

// Summary
console.log(`\n${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log("\nFix issues before publishing.");
  process.exit(1);
} else {
  console.log("\n✓ Spark package ready for production!");
}
