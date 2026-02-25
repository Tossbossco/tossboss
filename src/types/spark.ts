export interface Spark {
  slug: string;
  businessName: string;
  units: number;
  strategy: "RiskAudit" | "RevenueLeadership";
  preparedFor?: string;
  preparedDate?: string;
  reviewRiskScan: {
    mentionsCount: number;
    mostCommonIssue: string;
    riskSignal: "Optimization" | "Friction" | "Critical";
  };
  vendorScorecard: {
    provisionalScore: number;
    confidence?: "high" | "medium" | "low";
    dimensions: {
      reliability: number;
      residentExperience: number;
      issueResponse: number;
      communication: number;
    };
  };
  noiOpportunity: {
    minAmount: number;
    maxAmount: number;
    assumptions?: string[];
  };
  // Optional full data for Stage 2
  reviewDeepDive?: {
    recurringThemes: string[];
    frequencyAndRecency: string;
    impactOnReputation: string;
  };
  vendorGaps?: string[];
  noiBreakdown?: {
    currentLeakage: string[];
    optimizedEconomics: string[];
    scenarios: {
      conservative: number;
      base: number;
      upside: number;
    };
  };
  switchPlan?: {
    days1to3: string[];
    days4to7: string[];
    days8to14: string[];
    riskControls: string[];
  };
}

export interface ReviewEvidenceItem {
  source: "google" | "apartmentratings" | "yelp" | "other";
  sourceUrl?: string;
  sourceId?: string;
  platformRating?: number;
  reviewDate: string;
  capturedDate: string;
  authorHandle?: string;
  textRaw: string;
  textSnippet: string;
  tags: string[];
  sentiment: "negative" | "neutral" | "positive";
  relevanceScore: number;
  severityScore: number;
  confidence: "high" | "medium" | "low";
}

export interface SparkData {
  sparks: Spark[];
}

// Stage 2 Pitch Page Types
export interface PitchPageData {
  spark: Spark;
  preparedDate: string;
  preparedFor: string;
    executiveSnapshot: {
    residentFrictionSignal: "Optimization" | "Friction" | "Critical";
    currentVendorPerformance: number;
    noiUpsideMin: number;
    noiUpsideMax: number;
    isUndercutQuote?: boolean;
  };
  reviewDeepDive: {
    recurringThemes: string[];
    frequencyAndRecency: string;
    impactOnReputation: string;
  };
  vendorGaps: string[];
  noiBreakdown: {
    currentLeakage: string[];
    optimizedEconomics: string[];
    scenarios: {
      conservative: number;
      base: number;
      upside: number;
    };
  };
  switchPlan: {
    days1to3: string[];
    days4to7: string[];
    days8to14: string[];
    riskControls: string[];
  };
}

// Transition intent for Stage 2 close actions
export type TransitionDecision = "approve_transition" | "schedule_walkthrough" | "review_assumptions";

export interface TransitionIntent {
  sparkSlug: string;
  decision: TransitionDecision;
  selectedPackage?: "basic" | "standard" | "premium";
  estimatedStartWindow?: string;
  timestamp: string;
}
