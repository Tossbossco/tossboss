"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Panel } from "../design-system";

// ═══════════════════════════════════════════════════════════
// Guide Tab — How the system works + example prompts
// ═══════════════════════════════════════════════════════════

export default function GuideTab() {
  return (
    <div className="space-y-10 fade-in">
      <div className="mb-8">
        <span className="font-pixel text-[10px] text-[var(--text-secondary)] tracking-wider">
          {"> SYSTEM_GUIDE"}
        </span>
        <p className="text-[12px] text-[var(--text-muted)] mt-3 leading-relaxed">
          This dashboard is your live board. Talk to the AI like a business
          partner: report actions, ask for the next move, or ask for prep before
          meetings.
        </p>
      </div>

      <GuideSection title="QUICK START" defaultOpen>
        <div className="space-y-3 text-[12px] text-[var(--text-muted)] leading-relaxed">
          <p>
            Start with one line: what you already did today. The AI updates your
            board, awards XP, and gives the next highest-leverage move.
          </p>
          <p>
            Then ask for a focused plan: 2-3 tasks for today and 1 weekly mission.
            Keep it simple and executable.
          </p>
          <p>
            If you miss two days, XP decay starts. One completed task stops the
            bleed immediately.
          </p>
        </div>
      </GuideSection>

      <GuideSection title="WHAT TO SAY BY SCENARIO">
        <div className="space-y-3">
          <PromptExample prompt="Daily check-in: I made 4 outreach calls and sent 2 follow-ups" />
          <PromptExample prompt="Meeting prep: Help me prep for Greenwood tomorrow" />
          <PromptExample prompt="Pipeline update: Move Summit Ridge to negotiation" />
          <PromptExample prompt="Stuck moment: Give me one next move for today" />
          <PromptExample prompt="Objection help: They said residents will push back on fees" />
          <PromptExample prompt="Learning credit: I studied cold-calling openers for 20 minutes" />
          <PromptExample prompt="Planning: Build my tasks for today and one weekly mission" />
          <PromptExample prompt="Recovery: I missed two days. Get me back on track fast" />
        </div>
      </GuideSection>

      <GuideSection title="IF STUCK, SAY THIS">
        <div className="space-y-2 text-[12px] text-[var(--text-muted)]">
          <PromptExample prompt="Give me one next move for today" />
          <PromptExample prompt="Break this into 15-minute actions" />
          <PromptExample prompt="Tell me exactly what to say on the next call" />
          <PromptExample prompt="Reset me: today task + this week mission" />
        </div>
      </GuideSection>

      <GuideSection title="COMMON CONFUSION -> EXACT PROMPT">
        <div className="space-y-2 text-[12px] text-[var(--text-muted)] leading-relaxed">
          <ConfusionRow
            state="I did work but forgot to log it"
            prompt="Log this: I called 3 properties and booked one follow-up"
          />
          <ConfusionRow
            state="I don't know what matters most"
            prompt="Prioritize my top 3 moves for today"
          />
          <ConfusionRow
            state="A prospect went quiet"
            prompt="Write my reactivation message for Lakeside"
          />
          <ConfusionRow
            state="I have a meeting but feel unprepared"
            prompt="Give me a 5-minute pre-meeting script for this property"
          />
          <ConfusionRow
            state="I lost momentum"
            prompt="Give me one win I can complete in 15 minutes"
          />
        </div>
      </GuideSection>

      <GuideSection title="CHARACTER STATS">
        <div className="space-y-2 text-[12px] text-[var(--text-muted)]">
          <StatGuide
            name="SALES"
            desc="Grows from calls, meetings, contracts, and studying sales techniques"
          />
          <StatGuide
            name="OPERATIONS"
            desc="Service runs, route management, problem solving, logistics study"
          />
          <StatGuide
            name="MARKETING"
            desc="Content, reviews, referrals, website work, competitor analysis"
          />
          <StatGuide
            name="FINANCE"
            desc="Revenue tracking, expenses, pricing decisions, financial learning"
          />
          <StatGuide
            name="LEADERSHIP"
            desc="Hiring, delegating, expanding, documenting systems, management study"
          />
        </div>
      </GuideSection>

      <GuideSection title="LEVELS">
        <div className="space-y-1 text-[12px]">
          {[
            ["1", "Associate", "0"],
            ["2", "Runner", "100"],
            ["3", "Soldier", "300"],
            ["4", "Wiseguy", "600"],
            ["5", "Made Man", "1,000"],
            ["6", "Capo", "1,500"],
            ["7", "Consigliere", "2,200"],
            ["8", "Boss", "3,000"],
            ["9", "Don", "4,000"],
            ["10", "Godfather", "5,500"],
          ].map(([lvl, title, xp]) => (
            <div
              key={lvl}
              className="flex items-center gap-3 py-1 border-b border-[var(--border-dim)]"
            >
              <span className="font-pixel text-[8px] text-[var(--text-faint)] w-[24px]">
                {lvl}
              </span>
              <span className="font-pixel text-[9px] text-[var(--text-secondary)] flex-1">
                {title.toUpperCase()}
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">
                {xp} XP
              </span>
            </div>
          ))}
        </div>
      </GuideSection>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────

function GuideSection({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <Panel className="p-0 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] transition-colors text-left"
      >
        {open ? (
          <ChevronDown size={10} className="text-[var(--text-faint)]" />
        ) : (
          <ChevronRight size={10} className="text-[var(--text-faint)]" />
        )}
        <span className="font-pixel text-[9px] text-[var(--text-muted)] tracking-wider">
          {title}
        </span>
      </button>
      {open && <div className="px-4 py-3 bg-[var(--bg-primary)]">{children}</div>}
    </Panel>
  );
}

function PromptExample({ prompt }: { prompt: string }) {
  return (
    <Panel className="flex items-center gap-2 py-2 px-3 hover:border-bright transition-colors">
      <span className="text-[var(--accent-dim)] text-[10px]">&gt;</span>
      <span className="text-[12px] text-[var(--text-secondary)]">
        &ldquo;{prompt}&rdquo;
      </span>
    </Panel>
  );
}

function StatGuide({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <span className="font-pixel text-[8px] text-[var(--accent-dim)] w-[72px] text-right flex-shrink-0 mt-0.5">
        {name}
      </span>
      <span className="text-[12px] text-[var(--text-muted)]">{desc}</span>
    </div>
  );
}

function ConfusionRow({ state, prompt }: { state: string; prompt: string }) {
  return (
    <Panel className="py-2 px-3">
      <div className="text-[11px] text-[var(--text-faint)]">{state}</div>
      <div className="text-[12px] text-[var(--text-secondary)] mt-1">
        &gt; &ldquo;{prompt}&rdquo;
      </div>
    </Panel>
  );
}
