"use client";

import { useState } from "react";
import Link from "next/link";
import { Spark } from "@/types/spark";
import {
  ExternalSection,
  ExternalEyebrow,
  ExternalHeading,
  ExternalCard,
  ExternalMetric,
  externalButtonClass,
} from "@/components/external/design-system";

interface SparkPageProps {
  spark: Spark;
}

export default function SparkPage({ spark }: SparkPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const score = spark.vendorScorecard.provisionalScore;

  return (
    <div className="min-h-screen bg-[#F5F7F4]">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="font-serif text-xl font-semibold text-[#2D5A45] hover:text-[#3A7A52] transition-colors">
            TossBoss
          </Link>
        </div>
      </div>

      {/* Hero */}
      <ExternalSection tone="surface" className="pt-16 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1B4D3E] mb-6 leading-tight">
            {spark.businessName}<br />
            Free Valet Service Audit
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed mb-8">
            We analyzed your current valet setup and found specific opportunities to improve NOI and resident satisfaction. Book a 20-minute debrief to review the findings.
          </p>
          <Link
            href="#book"
            className={externalButtonClass("primary", "px-8 py-4")}
          >
            Claim Your Free Audit
          </Link>
        </div>
      </ExternalSection>

      {/* Three Key Findings */}
      <ExternalSection tone="base" className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <ExternalEyebrow>Preview</ExternalEyebrow>
            <ExternalHeading>Three findings from your audit</ExternalHeading>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Finding 1: Signal */}
            <ExternalCard>
              <ExternalMetric
                label="Operational Health Scan"
                value={
                  <span className={
                    spark.reviewRiskScan.riskSignal === "Critical" ? "text-red-600" :
                    spark.reviewRiskScan.riskSignal === "Friction" ? "text-amber-600" :
                    "text-[#2D5A45]"
                  }>
                    {spark.reviewRiskScan.riskSignal}
                  </span>
                }
                helper={`${spark.reviewRiskScan.mentionsCount} trash-related mentions in public history`}
              />
            </ExternalCard>

            {/* Finding 2: Score */}
            <ExternalCard>
              <ExternalMetric
                label="Vendor Score"
                value={<span className="text-[#1B4D3E]">{score}/100</span>}
                helper="Across reliability, experience, response, and communication"
              />
            </ExternalCard>

            {/* Finding 3: NOI */}
            <ExternalCard>
              <ExternalMetric
                label="Annual NOI Opportunity"
                value={<span className="text-[#2D5A45]">${(spark.noiOpportunity.minAmount / 1000).toFixed(0)}k-${(spark.noiOpportunity.maxAmount / 1000).toFixed(0)}k</span>}
                helper="Conservative estimate based on optimization"
              />
            </ExternalCard>
          </div>
        </div>
      </ExternalSection>

      {/* Score Breakdown */}
      <ExternalSection tone="surface" className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <ExternalEyebrow>Performance Benchmark</ExternalEyebrow>
              <ExternalHeading className="mb-4">Where your vendor stands</ExternalHeading>
              <p className="text-gray-600 leading-relaxed mb-8">
                Scored across the four dimensions that most impact resident satisfaction and operational efficiency.
              </p>
              <Link
                href="#book"
                className="text-[#2D5A45] font-medium hover:text-[#1B4D3E] transition-colors"
              >
                See full breakdown in debrief →
              </Link>
            </div>

            <div className="space-y-6">
              {[
                { label: "Reliability", score: spark.vendorScorecard.dimensions.reliability },
                { label: "Resident Experience", score: spark.vendorScorecard.dimensions.residentExperience },
                { label: "Issue Response", score: spark.vendorScorecard.dimensions.issueResponse },
                { label: "Communication", score: spark.vendorScorecard.dimensions.communication },
              ].map((dim) => (
                <div key={dim.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">{dim.label}</span>
                    <span className="font-medium text-[#1B4D3E]">{dim.score}/100</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2D5A45] rounded-full"
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ExternalSection>

      {/* What You Get */}
      <ExternalSection tone="base" className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <ExternalEyebrow>The Audit</ExternalEyebrow>
            <ExternalHeading>What you get in 20 minutes</ExternalHeading>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: "Review Risk Analysis",
                desc: "Complete breakdown of resident sentiment signals and reputation risks",
              },
              {
                title: "Performance Benchmark",
                desc: "Four-dimension scorecard comparing your vendor to industry standards",
              },
              {
                title: "NOI Optimization Plan",
                desc: "Specific actions to recover value and reduce operational drag",
              },
              {
                title: "Action Summary",
                desc: "Prioritized next steps whether you switch vendors or not",
              },
            ].map((item, idx) => (
              <ExternalCard key={idx}>
                <h3 className="font-serif text-xl text-[#1B4D3E] mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </ExternalCard>
            ))}
          </div>
        </div>
      </ExternalSection>

      {/* Booking CTA - Dark Section */}
      <ExternalSection id="book" tone="contrast" className="py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
            Book Your Audit Debrief
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            20 minutes. No prep needed. Walk away with actionable insights and a full benchmark report.
          </p>
          
          {/* Booking Block - Production Config Handoff */}
          <ExternalCard tone="dark" className="max-w-xl mx-auto border border-white/20 !bg-white/10">
            <p className="text-white mb-4">Ready to schedule your audit debrief?</p>
            <p className="text-white/60 text-sm mb-6">
              Select a time that works for you. We'll walk through the findings and answer your questions in 20 minutes.
            </p>
            <a 
              href="https://calendar.app.google/5cXBStx4B5ZcfNFX6"
              target="_blank"
              rel="noopener noreferrer"
              className={externalButtonClass("ghost", "inline-block !bg-white !text-[#1B4D3E] !border-0 py-4 px-8 hover:!bg-gray-100")}
            >
              Book My 20-Minute Audit
            </a>
          </ExternalCard>
        </div>
      </ExternalSection>

      {/* FAQ - White Section Following Dark */}
      <ExternalSection tone="surface" className="py-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <ExternalHeading>Common Questions</ExternalHeading>
          </div>
          
          <div className="space-y-3">
            {[
              {
                q: "Is this a sales pitch?",
                a: "No. The audit provides genuine value whether you switch vendors or not. Many properties use it to negotiate better terms with their current provider.",
              },
              {
                q: "What if no issues are found?",
                a: "That's valuable data too. You'll have documented proof of good performance for renewals and resident communications.",
              },
              {
                q: "How long does the debrief take?",
                a: "20 minutes. We'll walk through the findings and answer your questions. You get the full report to keep.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="overflow-hidden rounded-lg border border-gray-200 bg-[#F5F7F4]">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium text-[#1B4D3E] pr-4">{faq.q}</span>
                  <span className="text-xl text-gray-400 flex-shrink-0">
                    {openFaq === idx ? "−" : "+"}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600 leading-relaxed pt-2">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ExternalSection>

      {/* Footer - Matching Marketing Site */}
      <ExternalSection tone="contrast" className="pt-20 pb-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-1">
              <h3 className="font-serif text-3xl text-white mb-4">
                TossBoss
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Reliable valet trash and recycling for multifamily communities in North Georgia.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">
                Services
              </h4>
              <ul className="space-y-3">
                {["Valet Trash", "Recycling", "Dumpster Cleaning", "Custom Solutions"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="/"
                        className="text-white/60 text-sm hover:text-white transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">
                Company
              </h4>
              <ul className="space-y-3">
                {["How It Works", "Plans", "NOI Calculator", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="/"
                        className="text-white/60 text-sm hover:text-white transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">
                Resources
              </h4>
              <ul className="space-y-3">
                {["ROI Calculator", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="/"
                        className="text-white/60 text-sm hover:text-white transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              &copy; 2024 TossBoss. All rights reserved.
            </p>
            <p className="text-white/40 text-sm">
              Serving Cumming, GA & North Georgia
            </p>
          </div>
        </div>
      </ExternalSection>
    </div>
  );
}
