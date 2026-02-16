"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ExternalSection,
  ExternalEyebrow,
  ExternalHeading,
  ExternalCard,
  externalButtonClass,
} from "@/components/external/design-system";

export default function MarketingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [units, setUnits] = useState(200);
  const [tier, setTier] = useState<"basic" | "standard" | "premium">("standard");
  const [residentFee, setResidentFee] = useState(30);

  const tierPrices = { basic: 13, standard: 15, premium: 17 };
  const tierNames = {
    basic: "Basic ($13/unit)",
    standard: "Standard ($15/unit)",
    premium: "Premium ($17/unit)",
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const residentRevenue = units * residentFee;
  const serviceCost = units * tierPrices[tier];
  const netProfit = residentRevenue - serviceCost;
  const annualIncrease = netProfit * 12;

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://formspree.io/f/xojnwwab", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <>
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          scrolled
            ? "bg-[#F5F7F4]/98 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex justify-between items-center">
          <Link
            href="/"
            className={`font-serif text-2xl font-semibold transition-colors ${
              scrolled ? "text-[#2D5A45]" : "text-white"
            }`}
          >
            TossBoss
          </Link>
          <ul className="hidden md:flex gap-10 list-none">
            <li>
              <Link
                href="#how"
                className={`text-sm font-medium transition-colors ${
                  scrolled ? "text-[#1B4D3E] hover:text-[#4A7C59]" : "text-white/90 hover:text-white"
                }`}
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="#services"
                className={`text-sm font-medium transition-colors ${
                  scrolled ? "text-[#1B4D3E] hover:text-[#4A7C59]" : "text-white/90 hover:text-white"
                }`}
              >
                Plans
              </Link>
            </li>
            <li>
              <Link
                href="#roi"
                className={`text-sm font-medium transition-colors ${
                  scrolled ? "text-[#1B4D3E] hover:text-[#4A7C59]" : "text-white/90 hover:text-white"
                }`}
              >
                NOI Calculator
              </Link>
            </li>
            <li>
              <Link
                href="https://calendar.app.google/5cXBStx4B5ZcfNFX6"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full text-sm font-medium text-white bg-[#2D5A45] px-5 py-2.5 hover:bg-[#3A7A52] transition-colors"
              >
                Get Pricing
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero + Stats Container - 100vh Total */}
      <div className="h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 bg-[#1B4D3E] flex items-center pt-32 pb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#2D5A45]/10 to-transparent" />
          <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
            <div className="text-white text-left order-1">
              <div className="text-xs md:text-sm font-medium tracking-[3px] text-[#7CB98A] mb-4 md:mb-6 uppercase">
                Valet Trash + Recycling | North Georgia
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-4 md:mb-6">
                Valet trash that actually works.
              </h1>
              <p className="text-base md:text-lg text-white/70 mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Reliable doorstep collection for multifamily communities—reducing complaints, keeping dumpster areas clean, and running like clockwork.
              </p>
              <div className="flex flex-row gap-3 md:gap-4 justify-start">
                <Link
                  href="#roi"
                  className="rounded-full bg-[#2D5A45] text-white px-6 md:px-8 py-3 md:py-4 font-medium hover:bg-[#3A7A52] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(45,90,69,0.08)] text-sm md:text-base text-center"
                >
                  See the Numbers
                </Link>
                <Link
                  href="#services"
                  className="hidden md:block rounded-full border-2 border-white/30 text-white px-6 md:px-8 py-3 md:py-4 font-medium hover:bg-[#F5F7F4]/10 hover:border-white transition-all text-sm md:text-base text-center"
                >
                  View Plans
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block order-2">
              <div className="aspect-square rounded-lg flex items-center justify-center p-10">
                <Image
                  src="/metal-logo.png"
                  alt="TossBoss Logo"
                  width={420}
                  height={420}
                  priority
                  className="max-w-[100%] max-h-[100%] object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-[#F5F7F4] border-b border-gray-200 py-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
              <div>
                <h3 className="font-serif text-4xl text-[#1B4D3E] mb-1">7–10</h3>
                <p className="text-sm text-gray-500">Business days to start</p>
              </div>
              <div>
                <h3 className="font-serif text-4xl text-[#1B4D3E] mb-1">14</h3>
                <p className="text-sm text-gray-500">Day transition (no gap)</p>
              </div>
              <div>
                <h3 className="font-serif text-4xl text-[#1B4D3E] mb-1">99.2%</h3>
                <p className="text-sm text-gray-500">On-time service rate</p>
              </div>
              <div>
                <h3 className="font-serif text-4xl text-[#1B4D3E] mb-1">24/7</h3>
                <p className="text-sm text-gray-500">Local support</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Problems Section */}
      <ExternalSection id="benefits" tone="base">
        <div className="text-center mb-16">
          <ExternalEyebrow>The Reality</ExternalEyebrow>
          <ExternalHeading>Trash issues are loud. The costs are quiet.</ExternalHeading>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "⚠️",
              title: "Missed pickups become complaints",
              desc: "One missed night turns into trash left out, hallway clutter, and a service desk full of calls.",
            },
            {
              icon: "🗑️",
              title: "Dumpster areas spiral fast",
              desc: "Overflow, spills, odors, and curb appeal issues that prospects notice immediately.",
            },
            {
              icon: "📋",
              title: "Compliance creates friction",
              desc: "Unclear rules lead to cans left out all day and repeat enforcement headaches.",
            },
            {
              icon: "🔧",
              title: "Maintenance gets pulled in",
              desc: "Your team ends up cleaning and policing instead of completing work orders.",
            },
          ].map((problem, idx) => (
            <ExternalCard
              key={idx}
              className="p-10 hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-[#C17A53]/10 rounded-lg flex items-center justify-center text-2xl mb-5">
                {problem.icon}
              </div>
              <h3 className="font-serif text-2xl text-[#1B4D3E] mb-3 min-h-[64px] leading-tight flex items-start">
                {problem.title}
              </h3>
              <p className="text-[15px] text-gray-500 leading-relaxed">
                {problem.desc}
              </p>
            </ExternalCard>
          ))}
        </div>
      </ExternalSection>

      {/* The TossBoss Standard Section */}
      <ExternalSection id="how" tone="base">
        <div className="text-center mb-16">
          <ExternalEyebrow>How We Operate</ExternalEyebrow>
          <ExternalHeading>We don&apos;t just pick up bags. We run the system.</ExternalHeading>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Large Card */}
          <ExternalCard tone="dark" className="lg:row-span-2 p-12 flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium tracking-[2px] text-[#7CB98A] mb-4 uppercase">
                Financial Impact
              </div>
              <h3 className="font-serif text-4xl mb-4 leading-tight">
                Predictable NOI impact
              </h3>
              <p className="text-white/70 leading-relaxed">
                Most properties bill residents $25–$35 per unit and pay $13–$17 per unit for service. Your NOI is the spread—plus fewer service failures and less staff time on trash.
              </p>
            </div>
            <div className="mt-8 h-44 bg-[#2D5A45]/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-serif mb-2">$10,000–$25,000</div>
                <div className="text-white/60 text-sm">Annual NOI improvement per 200 units</div>
              </div>
            </div>
          </ExternalCard>

          {/* Top Right Card */}
          <ExternalCard tone="soft" className="p-8 flex items-center gap-6">
            <div className="hidden lg:flex w-28 h-28 bg-[#E8F4F2] rounded-lg flex-shrink-0 items-center justify-center text-[#2D5A45]">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl mb-2">
                Experience that reduces churn
              </h3>
              <p className="text-sm text-gray-500">
                Convenience residents notice—without hallway mess becoming a daily complaint.
              </p>
            </div>
          </ExternalCard>

          {/* Bottom Right Card */}
          <ExternalCard tone="dark" className="p-8 flex items-center gap-6">
            <div className="hidden lg:flex w-28 h-28 bg-[#F5F7F4]/10 rounded-lg flex-shrink-0 items-center justify-center">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl mb-2">
                99.2% on-time service
              </h3>
              <p className="text-sm text-white/80">
                Professional valets, local supervision, and fast support when needed.
              </p>
            </div>
          </ExternalCard>
        </div>
      </ExternalSection>

      {/* Services Section */}
      <ExternalSection id="services" tone="base">
        <div className="text-center mb-16">
          <ExternalEyebrow>Plans</ExternalEyebrow>
          <ExternalHeading>Choose your service level.</ExternalHeading>
        </div>
        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
          {/* Basic */}
          <ExternalCard className="p-12 flex flex-col">
            <h3 className="font-serif text-3xl mb-2">Basic</h3>
            <div className="mb-8">
              <span className="font-serif text-5xl">$13</span>
              <span className="text-gray-500">/unit/month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Example: Sun, Tue, Thu or Mon, Wed, Fri",
                "Uniformed, professional valets",
                "Doorstep trash collection",
                "Resident rules + welcome template",
                "Local support",
              ].map((feature, idx) => (
                <li
                  key={idx}
                  className="text-[15px] text-gray-700 py-2 border-b border-gray-100 last:border-0"
                >
                  • {feature}
                </li>
              ))}
            </ul>
            <Link
              href="#contact"
              className={externalButtonClass("secondary", "mt-auto block w-full text-center")}
            >
              Get Started
            </Link>
          </ExternalCard>

          {/* Standard - Featured */}
          <ExternalCard tone="dark" className="p-12 relative lg:scale-105 shadow-2xl flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2D5A45] text-white text-xs font-medium tracking-wider uppercase px-4 py-1.5 rounded-full">
              Most Popular
            </div>
            <h3 className="font-serif text-3xl mb-2">Standard</h3>
            <div className="mb-8">
              <span className="font-serif text-5xl">$15</span>
              <span className="text-white/60">/unit/month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "5-night weekly collection (Mon–Fri)",
                "Dumpster area cleanup",
                "Priority issue response",
                "Everything in Basic",
              ].map((feature, idx) => (
                <li
                  key={idx}
                  className="text-[15px] text-white/90 py-2 border-b border-white/10 last:border-0"
                >
                  • {feature}
                </li>
              ))}
            </ul>
            <Link
              href="#contact"
              className={externalButtonClass("primary", "mt-auto block w-full text-center bg-[#2D5A45] hover:bg-[#3A7A52]")}
            >
              Get Started
            </Link>
          </ExternalCard>

          {/* Premium */}
          <ExternalCard className="p-12 flex flex-col">
            <h3 className="font-serif text-3xl mb-2">Premium</h3>
            <div className="mb-8">
              <span className="font-serif text-5xl">$17</span>
              <span className="text-gray-500">/unit/month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "5-night trash collection",
                "Doorstep recycling collection",
                "Dedicated point of contact",
                "Everything in Standard",
              ].map((feature, idx) => (
                <li
                  key={idx}
                  className="text-[15px] text-gray-700 py-2 border-b border-gray-100 last:border-0"
                >
                  • {feature}
                </li>
              ))}
            </ul>
            <Link
              href="#contact"
              className={externalButtonClass("secondary", "mt-auto block w-full text-center")}
            >
              Get Started
            </Link>
          </ExternalCard>
        </div>
        <p className="text-center text-sm text-gray-400 mt-8">
          Optional add-ons: dumpster deep cleaning, common area trash pickup, bin provision, additional resident education.
        </p>
      </ExternalSection>

      {/* ROI Calculator Section */}
      <section id="roi" className="py-24 bg-[#1B4D3E]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-stretch">
            <div className="text-white">
              <div className="text-sm font-medium tracking-[3px] text-[#7CB98A] mb-4 uppercase">
                ROI Calculator
              </div>
              <h2 className="font-serif text-4xl lg:text-5xl text-white mb-6">
                Model your impact
              </h2>
              <p className="text-white/70 mb-10 leading-relaxed">
                Already have valet trash? Plug in your current resident fee. New to valet trash? Use a target fee and see what the program can produce.
              </p>

              <div className="space-y-6">
                {/* Units Slider */}
                <div className="bg-white/10 rounded-lg p-5 border border-white/20">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[15px] text-white">Number of Units</span>
                    <span className="font-medium text-[#7CB98A]">{units}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={units}
                    onChange={(e) => setUnits(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#7CB98A] hover:accent-[#8FCA9A]"
                    style={{
                      background: `linear-gradient(to right, #7CB98A 0%, #7CB98A ${((units - 50) / (500 - 50)) * 100}%, rgba(255,255,255,0.2) ${((units - 50) / (500 - 50)) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-white/50 mt-2">
                    <span>50</span>
                    <span>500</span>
                  </div>
                </div>

                {/* Service Tier Selector */}
                <div className="bg-white/10 rounded-lg p-5 border border-white/20">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[15px] text-white">Service Tier</span>
                    <span className="font-medium text-[#7CB98A]">{tierNames[tier]}</span>
                  </div>
                  <div className="flex gap-2">
                    {(['basic', 'standard', 'premium'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTier(t)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          tier === t
                            ? 'bg-[#7CB98A] text-[#1B4D3E]'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resident Fee Slider */}
                <div className="bg-white/10 rounded-lg p-5 border border-white/20">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[15px] text-white">Resident Fee</span>
                    <span className="font-medium text-[#7CB98A]">${residentFee}/unit</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="40"
                    step="1"
                    value={residentFee}
                    onChange={(e) => setResidentFee(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#7CB98A] hover:accent-[#8FCA9A]"
                    style={{
                      background: `linear-gradient(to right, #7CB98A 0%, #7CB98A ${((residentFee - 20) / (40 - 20)) * 100}%, rgba(255,255,255,0.2) ${((residentFee - 20) / (40 - 20)) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-white/50 mt-2">
                    <span>$20</span>
                    <span>$40</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F5F7F4] rounded-lg p-12 flex flex-col">
              <h3 className="font-serif text-3xl text-[#1B4D3E] mb-8 text-center">
                Monthly Revenue Impact
              </h3>
              <div className="space-y-4 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-[15px] text-gray-500">
                    Resident Fee Revenue
                  </span>
                  <span className="font-serif text-2xl text-[#1B4D3E]">
                    ${residentRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-[15px] text-gray-500">Service Cost</span>
                  <span className="font-serif text-2xl text-gray-500">
                    -${serviceCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t-2 border-[#1B4D3E]">
                  <span className="text-[15px] font-medium text-[#1B4D3E]">
                    Net Monthly NOI Impact
                  </span>
                  <span className="font-serif text-4xl text-[#2D5A45]">
                    ${netProfit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-5 bg-[#2D5A45]/10 rounded-lg">
                  <span className="text-[15px] font-medium text-[#1B4D3E]">
                    Annual NOI Impact
                  </span>
                  <span className="font-serif text-3xl text-[#2D5A45]">
                    ${annualIncrease.toLocaleString()}
                  </span>
                </div>
              </div>
              <Link
                href="#contact"
                className="rounded-full block w-full text-center bg-[#2D5A45] text-white py-4 mt-6 font-medium hover:bg-[#3A7A52] transition-all"
              >
                Get Pricing For My Property
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#2D5A45] text-center">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <h2 className="font-serif text-5xl lg:text-6xl text-white mb-4">
            Cleaner nights start here.
          </h2>
          <p className="text-lg text-white/80 mb-10">
            We&apos;ll confirm fit, recommend the right plan, and give you a clear start date—whether you&apos;re switching or starting fresh.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="https://calendar.app.google/5cXBStx4B5ZcfNFX6"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#F5F7F4] text-[#2D5A45] px-10 py-4 font-medium hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(45,90,69,0.12)] transition-all"
            >
              Get Pricing
            </a>
            <a
              href="tel:6784778717"
              className="rounded-full border-2 border-white text-white px-10 py-4 font-medium hover:bg-[#F5F7F4]/10 transition-all"
            >
              Call (678) 477-8717
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-[#F5F7F4]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-serif text-4xl text-[#1B4D3E] mb-4">
                Get your custom rollout plan.
              </h2>
              <p className="text-gray-500 mb-10">
                Tell us your unit count and whether you&apos;re switching or starting new. We&apos;ll respond within 24 hours with pricing, a timeline, and resident communication templates.
              </p>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2D5A45]/10 rounded-lg flex items-center justify-center text-[#2D5A45] text-xl">
                    📍
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-0.5">
                      Service Area
                    </h4>
                    <p className="text-[#1B4D3E] font-medium">
                      Cumming, GA & North Georgia
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2D5A45]/10 rounded-lg flex items-center justify-center text-[#2D5A45] text-xl">
                    📞
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-0.5">
                      Phone
                    </h4>
                    <p className="text-[#1B4D3E] font-medium">(678) 477-8717</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2D5A45]/10 rounded-lg flex items-center justify-center text-[#2D5A45] text-xl">
                    ✉️
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-0.5">
                      Email
                    </h4>
                    <p className="text-[#1B4D3E] font-medium">
                      Tossbossllc@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg p-10"
            >
              {status === "success" && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-center font-medium">
                  Quote request sent! We&apos;ll be in touch within 24 hours.
                </div>
              )}
              {status === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-center font-medium">
                  Something went wrong. Please call us directly at (678) 477-8717.
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B4D3E] mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Smith"
                    required
                    className="w-full p-3.5 border-2 border-gray-200 rounded-lg focus:border-[#2D5A45] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B4D3E] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@property.com"
                    required
                    className="w-full p-3.5 border-2 border-gray-200 rounded-lg focus:border-[#2D5A45] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[#1B4D3E] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="(678) 477-8717"
                    required
                    className="w-full p-3.5 border-2 border-gray-200 rounded-lg focus:border-[#2D5A45] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1B4D3E] mb-2">
                    Property Name
                  </label>
                  <input
                    type="text"
                    name="propertyName"
                    placeholder="e.g., Oakwood Apartments"
                    className="w-full p-3.5 border-2 border-gray-200 rounded-lg focus:border-[#2D5A45] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1B4D3E] mb-2">
                  Number of Units
                </label>
                <input
                  type="number"
                  name="units"
                  placeholder="e.g., 200"
                  required
                  className="w-full p-3.5 border-2 border-gray-200 rounded-lg focus:border-[#2D5A45] focus:outline-none transition-colors"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1B4D3E] mb-2">
                  Service Interest
                </label>
                <select
                  name="servicePlan"
                  required
                  className="w-full p-3.5 border-2 border-gray-200 rounded-lg focus:border-[#2D5A45] focus:outline-none transition-colors bg-white"
                >
                  <option value="">Select a service plan</option>
                  <option value="switching">Switching providers</option>
                  <option value="new">New valet trash program</option>
                  <option value="basic">Basic ($13/unit)</option>
                  <option value="standard">Standard ($15/unit)</option>
                  <option value="premium">Premium ($17/unit)</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#1B4D3E] mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us about your property..."
                  className="w-full p-3.5 border-2 border-gray-200 rounded-lg focus:border-[#2D5A45] focus:outline-none transition-colors resize-y"
                />
              </div>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="rounded-full w-full bg-[#2D5A45] text-white py-4 font-medium hover:bg-[#3A7A52] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? "Sending..." : "Get My Quote"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1B4D3E] text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
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
                        href="#services"
                        className="text-white/60 text-sm hover:text-[#2D5A45] transition-colors"
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
                        href={item === "How It Works" ? "#how" : item === "Plans" ? "#services" : item === "NOI Calculator" ? "#roi" : "#contact"}
                        className="text-white/60 text-sm hover:text-[#2D5A45] transition-colors"
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
                        href={item === "ROI Calculator" ? "#roi" : "#contact"}
                        className="text-white/60 text-sm hover:text-[#2D5A45] transition-colors"
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
              &copy; 2026 TossBoss. All rights reserved.
            </p>
            <p className="text-white/40 text-sm">
              Serving Cumming, GA & North Georgia
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
