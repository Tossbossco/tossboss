import { Spark, ReviewEvidenceItem } from "@/types/spark";
import fs from "fs";
import path from "path";

const SPARKS_DIR = path.join(process.cwd(), "lib/data/sparks");
const REVIEWS_DIR = path.join(process.cwd(), "lib/data/review-evidence");

/**
 * Load a Spark package from JSON file by slug
 */
export function loadSparkFromFile(slug: string): Spark | null {
  try {
    const filePath = path.join(SPARKS_DIR, `${slug}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`Spark file not found: ${filePath}`);
      return null;
    }
    
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);
    
    // Validate required fields
    if (!data.slug || !data.businessName || !data.units) {
      console.error(`Invalid Spark data for ${slug}: missing required fields`);
      return null;
    }
    
    return data as Spark;
  } catch (error) {
    console.error(`Error loading Spark ${slug}:`, error);
    return null;
  }
}

/**
 * Load review evidence from JSON file by slug
 */
export function loadReviewEvidenceFromFile(slug: string): ReviewEvidenceItem[] | null {
  try {
    const filePath = path.join(REVIEWS_DIR, `${slug}.reviews.json`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`No review evidence found for ${slug}`);
      return null;
    }
    
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);
    
    return data.items as ReviewEvidenceItem[];
  } catch (error) {
    console.error(`Error loading review evidence for ${slug}:`, error);
    return null;
  }
}

/**
 * Get all available Spark slugs
 */
export function getAllSparkSlugs(): string[] {
  try {
    if (!fs.existsSync(SPARKS_DIR)) {
      return [];
    }
    
    const files = fs.readdirSync(SPARKS_DIR);
    return files
      .filter(file => file.endsWith(".json") && file !== "spark-template.json")
      .map(file => file.replace(".json", ""));
  } catch (error) {
    console.error("Error listing Spark files:", error);
    return [];
  }
}

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use loadSparkFromFile instead
 */
export function getSparkBySlug(slug: string): Spark | null {
  return loadSparkFromFile(slug);
}

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use getAllSparkSlugs instead
 */
export function getAllSparks(): Spark[] {
  const slugs = getAllSparkSlugs();
  return slugs
    .map(slug => loadSparkFromFile(slug))
    .filter((spark): spark is Spark => spark !== null);
}

/**
 * Compose full Spark package with evidence
 */
export interface SparkPackage {
  spark: Spark;
  reviewEvidence: ReviewEvidenceItem[];
}

export function loadSparkPackage(slug: string): SparkPackage | null {
  const SPARKS_DIR = path.join(process.cwd(), "lib/data/sparks");
  const REVIEWS_DIR = path.join(process.cwd(), "lib/data/review-evidence");

  console.log(`Attempting to load Spark package for slug: ${slug}`);
  console.log(`SPARKS_DIR: ${SPARKS_DIR}`);
  console.log(`REVIEWS_DIR: ${REVIEWS_DIR}`);

  const spark = loadSparkFromFile(slug);
  if (!spark) {
    console.error(`Failed to load Spark from file for slug: ${slug}`);
    return null;
  }
  
  const reviewEvidence = loadReviewEvidenceFromFile(slug) || [];
  console.log(`Loaded Spark package successfully for: ${slug}`);
  
  return { spark, reviewEvidence };
}
