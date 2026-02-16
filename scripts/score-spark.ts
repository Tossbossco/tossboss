#!/usr/bin/env tsx
/**
 * Run scoring and confidence computation on a Spark
 * Usage: npx tsx scripts/score-spark.ts <slug>
 */

import fs from "fs";
import path from "path";

interface ReviewEvidenceItem {
  reviewDate: string;
  tags?: string[];
}

interface ReviewEvidence {
  totalAnalyzed: number;
  items?: ReviewEvidenceItem[];
}

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npx tsx scripts/score-spark.ts <slug>");
  process.exit(1);
}

const SPARKS_DIR = path.join(process.cwd(), "lib/data/sparks");
const REVIEWS_DIR = path.join(process.cwd(), "lib/data/review-evidence");
const sparkPath = path.join(SPARKS_DIR, `${slug}.json`);
const reviewsPath = path.join(REVIEWS_DIR, `${slug}.reviews.json`);

// Check files exist
if (!fs.existsSync(sparkPath)) {
  console.error(`Error: Spark ${slug} not found`);
  process.exit(1);
}

// Load data
const spark = JSON.parse(fs.readFileSync(sparkPath, "utf-8"));
const reviewEvidence = fs.existsSync(reviewsPath) 
  ? JSON.parse(fs.readFileSync(reviewsPath, "utf-8"))
  : null;

console.log(`Scoring: ${spark.businessName}\n`);

// Calculate risk signal
const riskSignal = calculateRiskSignal(reviewEvidence);
console.log(`Risk Signal: ${riskSignal}`);

// Calculate scores with evidence notes
const scores = calculateScores(reviewEvidence);
console.log(`\nVendor Scorecard:`);
console.log(`  Reliability: ${scores.reliability.score}/100 ${scores.reliability.note}`);
console.log(`  Resident Experience: ${scores.residentExperience.score}/100 ${scores.residentExperience.note}`);
console.log(`  Issue Response: ${scores.issueResponse.score}/100 ${scores.issueResponse.note}`);
console.log(`  Communication: ${scores.communication.score}/100 ${scores.communication.note}`);
console.log(`  Overall: ${scores.overall}/100`);

// Update spark with computed values
spark.reviewRiskScan.riskSignal = riskSignal;
spark.vendorScorecard.provisionalScore = scores.overall;
spark.vendorScorecard.dimensions = {
  reliability: scores.reliability.score,
  residentExperience: scores.residentExperience.score,
  issueResponse: scores.issueResponse.score,
  communication: scores.communication.score
};

// Write back
fs.writeFileSync(sparkPath, JSON.stringify(spark, null, 2));

console.log(`\n✓ Updated ${sparkPath}`);

function calculateRiskSignal(evidence: ReviewEvidence | null): string {
  if (!evidence || evidence.totalAnalyzed < 3) return "Low";
  
  const recentCount = evidence.items?.filter((i) => {
    const date = new Date(i.reviewDate);
    const monthsAgo = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsAgo <= 3;
  }).length || 0;
  
  if (recentCount >= 4) return "High";
  if (recentCount >= 2) return "Medium";
  return "Low";
}

function calculateScores(evidence: ReviewEvidence | null) {
  const baseScores = {
    reliability: 70,
    residentExperience: 70,
    issueResponse: 70,
    communication: 70
  };
  
  if (!evidence) {
    return {
      reliability: { score: baseScores.reliability, note: "(no evidence)" },
      residentExperience: { score: baseScores.residentExperience, note: "(no evidence)" },
      issueResponse: { score: baseScores.issueResponse, note: "(no evidence)" },
      communication: { score: baseScores.communication, note: "(no evidence)" },
      overall: Math.round(Object.values(baseScores).reduce((a, b) => a + b, 0) / 4)
    };
  }
  
  const items = evidence.items || [];
  
  // Count by tag
  const tagCounts: Record<string, number> = {};
  items.forEach((item) => {
    item.tags?.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  // Adjust scores based on evidence
  const reliabilityDeduction = Math.min(30, (tagCounts["missed_pickup"] || 0) * 5);
  const experienceDeduction = Math.min(25, (tagCounts["odor"] || 0) * 5 + (tagCounts["overflow"] || 0) * 5);
  const responseDeduction = Math.min(25, (tagCounts["issue_response"] || 0) * 5);
  const commDeduction = Math.min(25, (tagCounts["communication"] || 0) * 5);
  
  const scores = {
    reliability: Math.max(40, baseScores.reliability - reliabilityDeduction),
    residentExperience: Math.max(40, baseScores.residentExperience - experienceDeduction),
    issueResponse: Math.max(40, baseScores.issueResponse - responseDeduction),
    communication: Math.max(40, baseScores.communication - commDeduction)
  };
  
  return {
    reliability: { 
      score: scores.reliability, 
      note: reliabilityDeduction > 0 ? `(-${reliabilityDeduction} from missed pickups)` : ""
    },
    residentExperience: { 
      score: scores.residentExperience, 
      note: experienceDeduction > 0 ? `(-${experienceDeduction} from complaints)` : ""
    },
    issueResponse: { 
      score: scores.issueResponse, 
      note: responseDeduction > 0 ? `(-${responseDeduction} from response issues)` : ""
    },
    communication: { 
      score: scores.communication, 
      note: commDeduction > 0 ? `(-${commDeduction} from comm issues)` : ""
    },
    overall: Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 4)
  };
}
