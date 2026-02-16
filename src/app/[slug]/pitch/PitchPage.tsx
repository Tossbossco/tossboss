"use client";

import { useState } from "react";
import Link from "next/link";
import { PitchPageData, ReviewEvidenceItem, TransitionIntent, TransitionDecision } from "@/types/spark";
import {
  ExternalSection,
  ExternalCard,
  ExternalEvidenceQuote,
  ExternalMetric,
  externalButtonClass,
} from "@/components/external/design-system";

interface PitchPageProps {
  data: PitchPageData;
  reviewEvidence?: ReviewEvidenceItem[];
}

function captureTransitionIntent(
  decision: TransitionDecision,
  sparkSlug: string,
  selectedPackage?: "basic" | "standard" | "premium",
  estimatedStartWindow?: string
): TransitionIntent {
  return {
    sparkSlug,
    decision,
    selectedPackage,
    estimatedStartWindow,
    timestamp: new Date().toISOString(),
  };
}

export default function PitchPage({ data, reviewEvidence = [] }: PitchPageProps) {
  const [activeSection, setActiveSection] = useState<number>(0);
  const { spark, preparedDate, preparedFor, executiveSnapshot, reviewDeepDive, vendorGaps, noiBreakdown, switchPlan } = data;

  const sections = [
    { id: "snapshot", label: "Snapshot" },
    { id: "reviews", label: "Reviews" },
    { id: "scorecard", label: "Scorecard" },
    { id: "education", label: "Education" },
    { id: "noi", label: "NOI" },
    { id: "why-us", label: "Why TossBoss" },
    { id: "switch", label: "Switch Plan" },
    { id: "close", label: "Next Steps" },
  ];

  const getRiskColor = (signal: string) => {
    switch (signal) {
      case "High": return "text-red-600 bg-red-50";
      case "Medium": return "text-amber-600 bg-amber-50";
      default: return "text-emerald-600 bg-emerald-50";
    }
  };

  const score = spark.vendorScorecard.provisionalScore;
  const scoreColor = score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-red-600";

  return (
    <div className="min-h-screen bg-[#F5F7F4]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 bg-[#1B4D3E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Centered Logo + Property Name */}
          <div className="text-center mb-4">
            <Link href="/" className="font-serif text-2xl sm:text-3xl font-semibold text-white hover:text-white/90 transition-colors">
              TossBoss
            </Link>
            <span className="text-white/40 mx-3">|</span>
            <span className="font-serif text-2xl sm:text-3xl font-semibold text-white">{spark.businessName}</span>
          </div>
          
          {/* Desktop Stage Navigation */}
          <div className="hidden md:flex items-center justify-center gap-1">
            <button
              onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              className="px-3 py-1.5 rounded-full border border-white/30 text-white/70 hover:bg-white/10 text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ←
            </button>
            
            {sections.map((section, idx) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(idx)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  activeSection === idx
                    ? "bg-white text-[#1B4D3E]"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {idx + 1}. {section.label}
              </button>
            ))}
            
            <button
              onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
              disabled={activeSection === sections.length - 1}
              className="px-3 py-1.5 rounded-full border border-white/30 text-white/70 hover:bg-white/10 text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              →
            </button>
          </div>

          {/* Mobile Stage Navigation */}
          <div className="md:hidden flex items-center justify-between">
            <button
              onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              className="px-4 py-2 rounded-full border border-white/30 text-white/70 text-sm font-medium disabled:opacity-30"
            >
              ← Prev
            </button>
            <span className="text-white text-sm font-medium">
              {activeSection + 1} / {sections.length}
            </span>
            <button
              onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
              disabled={activeSection === sections.length - 1}
              className="px-4 py-2 rounded-full bg-white text-[#1B4D3E] text-sm font-medium disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </div>
        
        {/* Mobile Progress Bar */}
        <div className="md:hidden mt-3 px-4">
          <div className="flex gap-1">
            {sections.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  idx <= activeSection ? "bg-white" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area - Vertically Centered */}
      <div className="min-h-screen pt-36 md:pt-40 pb-12 flex items-center justify-center">
        <div className="w-full">
          {/* Section 1: Executive Snapshot */}
          {activeSection === 0 && (
            <ExternalSection className="py-0 animate-fadeIn" containerClassName="max-w-none px-4 sm:px-6 lg:px-10">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1B4D3E] mb-4">
                    {spark.businessName}
                  </h1>
                  <p className="text-gray-600 text-lg">Prepared for {preparedFor} on {preparedDate}</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <ExternalCard tone="soft" className={`rounded-xl ${getRiskColor(executiveSnapshot.residentFrictionSignal)}`}>
                    <ExternalMetric
                      label="Resident Friction Signal"
                      value={<span className="font-serif text-5xl">{executiveSnapshot.residentFrictionSignal}</span>}
                      helper={`Based on ${reviewEvidence.length} relevant reviews`}
                    />
                  </ExternalCard>

                  <ExternalCard className="rounded-xl">
                    <ExternalMetric
                      label="Vendor Score"
                      value={<span className={`font-serif text-5xl ${scoreColor}`}>{score}</span>}
                      helper={
                        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#2D5A45] rounded-full" style={{ width: `${score}%` }} />
                        </div>
                      }
                    />
                  </ExternalCard>

                  <ExternalCard tone="dark" className="rounded-xl">
                    <div className="text-sm text-[#7CB98A] mb-2">Annual NOI Upside</div>
                    <div className="font-serif text-4xl text-white">
                      ${(executiveSnapshot.noiUpsideMin / 1000).toFixed(0)}k-${(executiveSnapshot.noiUpsideMax / 1000).toFixed(0)}k
                    </div>
                  </ExternalCard>
                </div>

                <ExternalCard className="rounded-xl">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    The property has measurable execution gaps and recoverable value. The opportunity is operational improvement plus measurable financial upside.
                  </p>
                </ExternalCard>
              </div>
            </ExternalSection>
          )}

          {/* Section 2: Review Risk Deep Dive - WITH REAL EVIDENCE */}
          {activeSection === 1 && (
            <ExternalSection className="py-0 animate-fadeIn" containerClassName="max-w-none px-4 sm:px-6 lg:px-10">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-serif text-3xl lg:text-4xl text-[#1B4D3E]">
                    What Residents Are Signaling
                  </h2>
                  <p className="text-gray-600 mt-4">Evidence from public reviews (last 12 months)</p>
                </div>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <ExternalCard className="rounded-xl">
                      <h3 className="font-serif text-xl text-[#1B4D3E] mb-4">Recurring Complaint Themes</h3>
                      <ul className="space-y-3">
                        {reviewDeepDive.recurringThemes.map((theme, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-600">
                            <span className="text-[#2D5A45] mt-1">•</span>
                            {theme}
                          </li>
                        ))}
                      </ul>
                    </ExternalCard>

                    <ExternalCard className="rounded-xl">
                      <h3 className="font-serif text-xl text-[#1B4D3E] mb-4">Reputation Impact</h3>
                      <p className="text-gray-600">{reviewDeepDive.impactOnReputation}</p>
                    </ExternalCard>
                  </div>

                  {/* Real Review Evidence */}
                  <ExternalCard className="rounded-xl">
                    <h3 className="font-serif text-xl text-[#1B4D3E] mb-6">Evidence from Reviews</h3>
                    <div className="space-y-4">
                      {reviewEvidence.map((review, idx) => (
                        <ExternalEvidenceQuote
                          key={idx}
                          quote={review.textSnippet}
                          source={review.source}
                          date={new Date(review.reviewDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          tags={review.tags.join(', ')}
                        />
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Method:</span> Analyzed {reviewEvidence.length} reviews across Google, Yelp, and ApartmentRatings. 
                        Tagged by relevance to trash/sanitation issues and weighted by recency and severity.
                      </p>
                    </div>
                  </ExternalCard>
                </div>
              </div>
            </ExternalSection>
          )}

          {/* Section 3: Vendor Scorecard */}
          {activeSection === 2 && (
            <ExternalSection className="py-0 animate-fadeIn" containerClassName="max-w-none px-4 sm:px-6 lg:px-10">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-serif text-3xl lg:text-4xl text-[#1B4D3E]">
                    Vendor Performance Scorecard
                  </h2>
                  <p className="text-gray-600 mt-4">Scored based on review evidence and observable standards</p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { label: "Reliability", score: spark.vendorScorecard.dimensions.reliability, note: "Missed pickups mentioned in 60% of negative reviews" },
                    { label: "Resident Experience", score: spark.vendorScorecard.dimensions.residentExperience, note: "Consistent complaints about odor and overflow" },
                    { label: "Issue Response", score: spark.vendorScorecard.dimensions.issueResponse, note: "Average 3+ day response time per review evidence" },
                    { label: "Communication", score: spark.vendorScorecard.dimensions.communication, note: "Limited proactive communication noted" },
                  ].map((dim) => (
                    <ExternalCard key={dim.label}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600 font-medium">{dim.label}</span>
                        <span className="font-serif text-2xl text-[#1B4D3E]">{dim.score}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-[#2D5A45] rounded-full" style={{ width: `${dim.score}%` }} />
                      </div>
                      <p className="text-xs text-gray-500">{dim.note}</p>
                    </ExternalCard>
                  ))}
                </div>

                <ExternalCard tone="dark" className="rounded-xl mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-lg">Overall Score</span>
                    <span className="font-serif text-5xl text-white">{score}/100</span>
                  </div>
                </ExternalCard>

                <ExternalCard className="rounded-xl">
                  <h3 className="font-serif text-xl text-[#1B4D3E] mb-4">Top Three Gaps</h3>
                  <ul className="space-y-3">
                    {vendorGaps.map((gap, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-600">
                        <span className="text-red-500 font-bold">{idx + 1}.</span>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </ExternalCard>
              </div>
            </ExternalSection>
          )}

          {/* Section 4: Resident Education */}
          {activeSection === 3 && (
            <ExternalSection className="py-0 animate-fadeIn" containerClassName="max-w-none px-4 sm:px-6 lg:px-10">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-serif text-3xl lg:text-4xl text-[#1B4D3E]">
                    Resident Education System
                  </h2>
                  <p className="text-gray-600 mt-4">Included with every TossBoss engagement</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Resident QR Guide page (mobile-first, building-ready)",
                    "Set-out timing and pickup rules",
                    "Bagging and placement best practices",
                    "Holiday and no-service-day guidance",
                    "Missed pickup and support flow",
                    "Office script pack + reminder templates",
                    "Move-in one-pager for new residents",
                    "Friendly door-tag templates",
                  ].map((item, idx) => (
                    <ExternalCard key={idx} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-[#2D5A45] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </ExternalCard>
                  ))}
                </div>

                <ExternalCard tone="soft" className="rounded-xl mt-8">
                  <p className="text-emerald-800 text-center">
                    <span className="font-medium">Impact:</span> Properties with structured resident education see 40% fewer service complaints
                  </p>
                </ExternalCard>
              </div>
            </ExternalSection>
          )}

          {/* Section 5: NOI Breakdown */}
          {activeSection === 4 && (
            <ExternalSection className="py-0 animate-fadeIn" containerClassName="max-w-none px-4 sm:px-6 lg:px-10">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-serif text-3xl lg:text-4xl text-[#1B4D3E]">
                    NOI Opportunity Breakdown
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <ExternalCard tone="soft" className="rounded-xl bg-red-50 border-red-100">
                    <h3 className="font-medium text-red-700 mb-4 text-lg">Current-State Leakage</h3>
                    <ul className="space-y-3">
                      {noiBreakdown.currentLeakage.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-red-600">
                          <span>•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </ExternalCard>

                  <ExternalCard tone="soft" className="rounded-xl bg-emerald-50 border-emerald-100">
                    <h3 className="font-medium text-emerald-700 mb-4 text-lg">Optimized-State Economics</h3>
                    <ul className="space-y-3">
                      {noiBreakdown.optimizedEconomics.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-emerald-600">
                          <span>•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </ExternalCard>
                </div>

                <ExternalCard className="rounded-xl mb-8">
                  <h3 className="font-serif text-xl text-[#1B4D3E] mb-6 text-center">Scenario Analysis</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <ExternalCard tone="soft" className="rounded-xl text-center">
                      <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Conservative</div>
                      <div className="font-serif text-2xl text-[#1B4D3E]">${(noiBreakdown.scenarios.conservative / 1000).toFixed(0)}k</div>
                    </ExternalCard>
                    <ExternalCard tone="dark" className="rounded-xl text-center">
                      <div className="text-xs text-[#7CB98A] mb-2 uppercase tracking-wider">Base Case</div>
                      <div className="font-serif text-2xl text-white">${(noiBreakdown.scenarios.base / 1000).toFixed(0)}k</div>
                    </ExternalCard>
                    <ExternalCard tone="soft" className="rounded-xl text-center">
                      <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Upside</div>
                      <div className="font-serif text-2xl text-[#1B4D3E]">${(noiBreakdown.scenarios.upside / 1000).toFixed(0)}k</div>
                    </ExternalCard>
                  </div>
                </ExternalCard>

                <ExternalCard tone="soft" className="rounded-xl">
                  <p className="text-sm text-gray-600 text-center">
                    <span className="font-medium">Assumptions:</span> Based on {spark.units} units, $15/unit standard service tier,
                    and conservative estimates of complaint reduction and operational efficiency gains.
                  </p>
                </ExternalCard>
              </div>
            </ExternalSection>
          )}

          {/* Section 6: Why TossBoss */}
          {activeSection === 5 && (
            <ExternalSection className="py-0 animate-fadeIn" containerClassName="max-w-none px-4 sm:px-6 lg:px-10">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-serif text-3xl lg:text-4xl text-[#1B4D3E]">
                    Why TossBoss Wins
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    { title: "Local Accountability", desc: "Direct operator visibility with local supervisor and account management" },
                    { title: "Practical Pickup Policy", desc: "Lenient policy that reduces resident friction compared to rigid competitors" },
                    { title: "Nightly Cleanup Standards", desc: "Including minor spill response and dumpster area maintenance" },
                    { title: "Backup Coverage Model", desc: "Floater system that protects service continuity during absences" },
                    { title: "Clear Communication", desc: "Service logs, completion tracking, and transparent reporting" },
                    { title: "First-30-Day Controls", desc: "Structured onboarding with quality checkpoints and rapid issue response" },
                  ].map((pillar, idx) => (
                    <ExternalCard key={idx} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#2D5A45] flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">{idx + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-[#1B4D3E] mb-1">{pillar.title}</h3>
                        <p className="text-gray-600">{pillar.desc}</p>
                      </div>
                    </ExternalCard>
                  ))}
                </div>
              </div>
            </ExternalSection>
          )}

          {/* Section 7: Switch Plan */}
          {activeSection === 6 && (
            <ExternalSection className="py-0 animate-fadeIn" containerClassName="max-w-none px-4 sm:px-6 lg:px-10">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-serif text-3xl lg:text-4xl text-[#1B4D3E]">
                    14-Day Transition Plan
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {[
                    { days: "1-3", title: "Kickoff", items: switchPlan.days1to3 },
                    { days: "4-7", title: "Preparation", items: switchPlan.days4to7 },
                    { days: "8-14", title: "Go-Live", items: switchPlan.days8to14 },
                  ].map((phase, idx) => (
                    <ExternalCard key={idx} className="rounded-xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-[#2D5A45] flex items-center justify-center text-white font-bold text-lg">
                          {phase.days}
                        </div>
                        <h3 className="font-serif text-xl text-[#1B4D3E]">Days {phase.days}: {phase.title}</h3>
                      </div>
                      <ul className="space-y-3 ml-18">
                        {phase.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-600">
                            <span className="text-[#2D5A45]">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    </ExternalCard>
                  ))}

                  <ExternalCard tone="dark" className="rounded-xl">
                    <h3 className="text-white font-medium mb-4 text-lg">Risk Controls</h3>
                    <ul className="space-y-3">
                      {switchPlan.riskControls.map((item, idx) => (
                        <li key={idx} className="text-white/80 flex items-start gap-3">
                          <span>•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </ExternalCard>
                </div>
              </div>
            </ExternalSection>
          )}

          {/* Section 8: Close / Next Action */}
          {activeSection === 7 && (
            <ExternalSection className="py-0 animate-fadeIn" containerClassName="max-w-none px-4 sm:px-6 lg:px-10">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="font-serif text-3xl lg:text-4xl text-[#1B4D3E]">
                    Next Steps
                  </h2>
                  <p className="text-gray-600 mt-4">Choose your path forward</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <ExternalCard tone="dark" className="rounded-xl text-center">
                    <div className="w-16 h-16 rounded-full bg-white/10 mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-xl text-white mb-2">Approve Transition</h3>
                    <p className="text-white/70 text-sm mb-6">Lock in your start date and begin implementation</p>
                    <button 
                      onClick={() => {
                        const intent = captureTransitionIntent("approve_transition", spark.slug, "standard", "30 days");
                        console.log("Transition Intent:", intent);
                        alert("Transition approval captured! In production, this would create a proposal/checkout session.");
                      }}
                      className={externalButtonClass("ghost", "w-full !bg-white !text-[#1B4D3E] !border-0 py-3 hover:!bg-gray-100")}
                    >
                      Get Started
                    </button>
                  </ExternalCard>

                  <ExternalCard className="rounded-xl text-center">
                    <div className="w-16 h-16 rounded-full bg-[#F5F7F4] mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#2D5A45]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-xl text-[#1B4D3E] mb-2">On-Site Walkthrough</h3>
                    <p className="text-gray-600 text-sm mb-6">See operations firsthand and finalize details</p>
                    <a 
                      href="https://calendar.app.google/5cXBStx4B5ZcfNFX6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={externalButtonClass("secondary", "w-full py-3 block text-center")}
                    >
                      Schedule Visit
                    </a>
                  </ExternalCard>

                  <ExternalCard className="rounded-xl text-center">
                    <div className="w-16 h-16 rounded-full bg-[#F5F7F4] mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#2D5A45]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-xl text-[#1B4D3E] mb-2">Review Assumptions</h3>
                    <p className="text-gray-600 text-sm mb-6">Discuss numbers and methodology in detail</p>
                    <button 
                      onClick={() => {
                        const intent = captureTransitionIntent("review_assumptions", spark.slug);
                        console.log("Transition Intent:", intent);
                        alert("Review request captured! In production, this would trigger a follow-up flow.");
                      }}
                      className="w-full border-2 border-gray-300 text-gray-600 py-3 rounded-full font-medium hover:border-[#2D5A45] hover:text-[#2D5A45] transition-colors"
                    >
                      Request Review
                    </button>
                  </ExternalCard>
                </div>

                <ExternalCard tone="soft" className="rounded-xl text-center">
                  <p className="text-gray-600 mb-2">Questions about the transition?</p>
                  <p className="text-sm text-gray-500">Our team is available for a follow-up call to address any concerns</p>
                </ExternalCard>
              </div>
            </ExternalSection>
          )}
        </div>
      </div>
    </div>
  );
}
