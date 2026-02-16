#!/usr/bin/env tsx
/**
 * Create a new Spark package from template
 * Usage: npx tsx scripts/create-spark.ts <slug>
 */

import fs from "fs";
import path from "path";

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npx tsx scripts/create-spark.ts <slug>");
  console.error("Example: npx tsx scripts/create-spark.ts oakwood-terrace");
  process.exit(1);
}

const SPARKS_DIR = path.join(process.cwd(), "lib/data/sparks");
const templatePath = path.join(SPARKS_DIR, "spark-template.json");
const newSparkPath = path.join(SPARKS_DIR, `${slug}.json`);

// Check if template exists
if (!fs.existsSync(templatePath)) {
  console.error("Error: spark-template.json not found");
  process.exit(1);
}

// Check if spark already exists
if (fs.existsSync(newSparkPath)) {
  console.error(`Error: Spark ${slug} already exists`);
  process.exit(1);
}

// Read template
const template = JSON.parse(fs.readFileSync(templatePath, "utf-8"));

// Create new spark from template
delete template._template;
delete template._description;

template.slug = slug;
template.businessName = slug.split("-").map(word => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join(" ");

// Write new spark file
fs.writeFileSync(newSparkPath, JSON.stringify(template, null, 2));

console.log(`✓ Created Spark: ${slug}`);
console.log(`✓ File: ${newSparkPath}`);
console.log(`\nNext steps:`);
console.log(`1. Edit ${newSparkPath} with property details`);
console.log(`2. Ingest reviews:`);
console.log(`   - API path: npx tsx scripts/ingest-reviews-google.ts ${slug}`);
console.log(`   - Manual path: npx tsx scripts/import-reviews-manual.ts ${slug}`);
console.log(`3. Run: npx tsx scripts/score-spark.ts ${slug}`);
console.log(`   (also generates assessment report fields)`);
console.log(`4. Run: npx tsx scripts/qa-spark.ts ${slug}`);
