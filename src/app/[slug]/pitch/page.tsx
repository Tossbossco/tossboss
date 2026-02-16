import { notFound } from "next/navigation";
import { loadSparkPackage } from "@/lib/sparks";
import PitchPage from "./PitchPage";
import { PitchPageData, Spark } from "@/types/spark";

interface Props {
  params: Promise<{ slug: string }>;
}

function composePitchData(spark: Spark): PitchPageData {
  return {
    spark,
    preparedDate: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    preparedFor: "Property Management Team",
    executiveSnapshot: {
      residentFrictionSignal: spark.reviewRiskScan.riskSignal,
      currentVendorPerformance: spark.vendorScorecard.provisionalScore,
      noiUpsideMin: spark.noiOpportunity.minAmount,
      noiUpsideMax: spark.noiOpportunity.maxAmount,
    },
    reviewDeepDive: {
      recurringThemes: spark.reviewDeepDive?.recurringThemes || [
        spark.reviewRiskScan.mostCommonIssue,
        "Late or missed pickups",
        "Overflowing dumpsters",
      ],
      frequencyAndRecency: spark.reviewDeepDive?.frequencyAndRecency || 
        `${spark.reviewRiskScan.mentionsCount} mentions in the last 12 months`,
      impactOnReputation: spark.reviewDeepDive?.impactOnReputation ||
        "These complaints are visible to prospective residents and affect online ratings. Properties with trash issues see 15-20% lower inquiry-to-tour conversion.",
    },
    vendorGaps: spark.vendorGaps || [
      "Inconsistent nightly completion logs",
      "No proactive resident education system",
      "Slow response to service failures",
    ],
    noiBreakdown: {
      currentLeakage: spark.noiBreakdown?.currentLeakage || [
        "Staff time handling complaints: ~$3,200/year",
        "Reputation impact on renewal rates: ~$4,800/year",
        "Avoidable maintenance from spills: ~$2,100/year",
      ],
      optimizedEconomics: spark.noiBreakdown?.optimizedEconomics || [
        "Resident satisfaction improvement: +12% retention",
        "Reduced office burden: 5hrs/week saved",
        "NOI optimization through better pricing",
      ],
      scenarios: spark.noiBreakdown?.scenarios || {
        conservative: spark.noiOpportunity.minAmount,
        base: Math.round((spark.noiOpportunity.minAmount + spark.noiOpportunity.maxAmount) / 2),
        upside: spark.noiOpportunity.maxAmount,
      },
    },
    switchPlan: {
      days1to3: spark.switchPlan?.days1to3 || [
        "Property walkthrough and route mapping",
        "Resident communication templates review",
        "Service timing and access coordination",
      ],
      days4to7: spark.switchPlan?.days4to7 || [
        "Resident notice rollout via email/portal",
        "Office team training on new procedures",
        "QR guide deployment to common areas",
      ],
      days8to14: spark.switchPlan?.days8to14 || [
        "Service launch with supervisor oversight",
        "Daily quality checks and rapid issue resolution",
        "Week 2 stabilization and fine-tuning",
      ],
      riskControls: spark.switchPlan?.riskControls || [
        "No service gap - overlapping coverage with current vendor",
        "Backup valets on standby for continuity",
        "24/7 support line for urgent issues",
        "30-day quality guarantee with free remediation",
      ],
    },
  };
}

export default async function PitchRoute({ params }: Props) {
  const { slug } = await params;
  const sparkPackage = loadSparkPackage(slug);

  if (!sparkPackage) {
    notFound();
  }

  const { spark, reviewEvidence } = sparkPackage;
  const pitchData = composePitchData(spark);

  return <PitchPage data={pitchData} reviewEvidence={reviewEvidence} />;
}
