"use client";

import Link from "next/link";
import { Spark } from "@/types/spark";
import {
  ExternalSection,
  ExternalCard,
  ExternalMetric,
  externalButtonClass,
} from "@/components/external/design-system";
import { Printer, FileText, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

interface QuotePageProps {
  spark: Spark;
}

export default function QuotePage({ spark }: QuotePageProps) {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Financial calculations based on the Statesman example or generic defaults
  const currentRate = 13.25;
  const proposedRate = 11.50;
  const monthlySavings = (currentRate - proposedRate) * spark.units;
  const annualSavings = monthlySavings * 12;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pb-20">
      {/* Top Bar - Non-print */}
      <div className="bg-[#1B4D3E] py-3 px-6 no-print">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href={`/${spark.slug}/pitch`} className="text-white/80 hover:text-white text-sm flex items-center gap-2">
            ← Back to Pitch
          </Link>
          <button 
            onClick={() => window.print()}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
          >
            <Printer size={14} /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Quote Container */}
      <div className="max-w-4xl mx-auto px-8 pt-16 sm:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b-2 border-[#2D5A45] pb-10 mb-12">
          <div>
            <div className="text-[#2D5A45] font-serif text-3xl font-bold mb-2">TossBoss</div>
            <div className="text-gray-500 text-sm uppercase tracking-widest font-medium">Service Proposal & Quote</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Date: {today}</div>
            <div className="text-sm text-gray-500 mb-1">Valid for: 30 Days</div>
            <div className="text-sm text-gray-500">Proposal ID: TB-{spark.slug.substring(0, 3).toUpperCase()}-2026</div>
          </div>
        </div>

        {/* Property Info */}
        <div className="mb-12">
          <div className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-4">Prepared For</div>
          <h1 className="font-serif text-4xl text-[#1B4D3E] mb-2">{spark.businessName}</h1>
          <p className="text-gray-600">{spark.units} Residential Units • North Georgia Portfolio</p>
        </div>

        {/* Executive Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#F5F7F4] p-6 rounded-xl border border-gray-100">
            <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Current Rate</div>
            <div className="text-2xl font-serif text-gray-400 line-through">${currentRate.toFixed(2)}</div>
            <div className="text-sm text-gray-500 mt-1">per door / month</div>
          </div>
          <div className="bg-[#E8F5E9] p-6 rounded-xl border border-[#2D5A45]/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#2D5A45] text-white text-[10px] px-3 py-1 font-bold rounded-bl-lg">PROPOSED</div>
            <div className="text-xs uppercase tracking-wider text-[#2D5A45] font-bold mb-2">TossBoss Rate</div>
            <div className="text-3xl font-serif text-[#1B4D3E] font-bold">${proposedRate.toFixed(2)}</div>
            <div className="text-sm text-[#2D5A45] mt-1 font-medium">per door / month</div>
          </div>
          <div className="bg-[#1B4D3E] p-6 rounded-xl text-white shadow-lg shadow-[#1B4D3E]/20">
            <div className="text-xs uppercase tracking-wider text-white/60 font-bold mb-2">Annual Savings</div>
            <div className="text-3xl font-serif font-bold text-[#7CB98A]">${annualSavings.toLocaleString()}</div>
            <div className="text-sm text-white/60 mt-1">Direct NOI Impact</div>
          </div>
        </div>

        {/* Service Scope */}
        <div className="mb-12">
          <h2 className="font-serif text-2xl text-[#1B4D3E] mb-6 flex items-center gap-3">
            <FileText className="text-[#2D5A45]" size={24} />
            Scope of Service
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
            {[
            "5-Night Doorstep Collection (Tue-Sat)",
            "Nightly Dumpster Area Tidying",
            "Minor Spill Response & Cleanup",
            "Resident Education & Onboarding",
            "Direct Account Manager Access",
            "Local Accountability (Cumming, GA)",
            "No 'National Brand' Overhead Tax",
            "14-Day Seamless Transition Guarantee"
          ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 py-2 border-b border-gray-50">
                <CheckCircle2 className="text-[#2D5A45] flex-shrink-0" size={18} />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* The Why */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="border border-gray-100 p-8 rounded-2xl bg-gray-50/50">
            <ShieldCheck className="text-[#2D5A45] mb-4" size={32} />
            <h3 className="font-serif text-xl text-[#1B4D3E] mb-3">Local Accountability</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Unlike national vendors, TossBoss is based in Cumming. We don't hide behind 1-800 numbers or regional bureaucracy. If there's an issue, you have a direct line to ownership.
            </p>
          </div>
          <div className="border border-gray-100 p-8 rounded-2xl bg-gray-50/50">
            <Zap className="text-[#2D5A45] mb-4" size={32} />
            <h3 className="font-serif text-xl text-[#1B4D3E] mb-3">NOI Maximization</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our lean operational model allows us to provide superior service at a lower cost. We pass that efficiency directly to your bottom line, increasing your asset's valuation.
            </p>
          </div>
        </div>

        {/* Footer / Signature */}
        <div className="border-t border-gray-200 pt-12 flex flex-col md:flex-row justify-between gap-12 items-end">
          <div className="max-w-xs">
            <div className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-8">Authorized By</div>
            <div className="font-serif italic text-2xl text-gray-800 mb-1">Alan Miranda</div>
            <div className="h-px bg-gray-300 w-full mb-2"></div>
            <div className="text-sm text-gray-500">Founder & CEO, TossBoss</div>
          </div>
          <div className="no-print">
            <a 
              href="https://calendar.app.google/5cXBStx4B5ZcfNFX6"
              target="_blank"
              rel="noopener noreferrer"
              className={externalButtonClass("primary", "px-10 py-4 shadow-xl shadow-[#2D5A45]/20")}
            >
              Schedule Final Walkthrough
            </a>
          </div>
        </div>

        {/* Print Footer */}
        <div className="hidden print-only mt-20 text-center text-[10px] text-gray-400">
          TossBoss LLC • Serving North Georgia • thetossboss.co
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            background: white !important;
          }
          .min-h-screen {
            min-h-0 !important;
          }
        }
      `}</style>
    </div>
  );
}
