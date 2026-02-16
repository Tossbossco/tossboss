"use client";

import type { CharacterStats, Achievement } from "@/lib/types";
import { Lock, Trophy } from "lucide-react";
import { ProgressBar } from "../design-system";

// ═══════════════════════════════════════════════════════════
// Stats Tab — Character stats + achievement grid
// ═══════════════════════════════════════════════════════════

interface StatsTabProps {
  stats: CharacterStats;
  achievements: Achievement[];
}

export default function StatsTab({ stats, achievements }: StatsTabProps) {
  const maxStat = Math.max(...Object.values(stats), 1);

  const hustle = achievements.filter((a) => a.category === "hustle");
  const business = achievements.filter((a) => a.category === "business");
  const growth = achievements.filter((a) => a.category === "growth");

  return (
    <div className="space-y-12 fade-in">
      {/* Character Stats */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <span className="font-pixel text-[10px] text-[var(--text-secondary)] tracking-wider">
            {"> CHARACTER_STATS"}
          </span>
        </div>

        <div className="space-y-4">
          {(Object.entries(stats) as [keyof CharacterStats, number][]).map(
            ([stat, value]) => (
              <StatBar key={stat} name={stat} value={value} max={maxStat} />
            )
          )}
        </div>
      </section>

      {/* Achievements */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Trophy size={12} className="text-[var(--gold)]" />
          <span className="font-pixel text-[10px] text-[var(--text-secondary)] tracking-wider">
            {"> ACHIEVEMENTS"}
          </span>
          <span className="font-pixel text-[9px] text-[var(--text-faint)]">
            [{achievements.filter((a) => a.unlocked).length}/{achievements.length}]
          </span>
        </div>

        <AchievementCategory label="HUSTLE" achievements={hustle} />
        <AchievementCategory label="BUSINESS" achievements={business} />
        <AchievementCategory label="GROWTH" achievements={growth} />
      </section>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────

function StatBar({
  name,
  value,
  max,
}: {
  name: string;
  value: number;
  max: number;
}) {
  const displayMax = Math.max(max * 1.5, value);

  return (
    <div className="flex items-center gap-3">
      <span className="font-pixel text-[9px] text-[var(--text-muted)] w-[80px] text-right">
        {name.toUpperCase()}
      </span>
      <div className="flex-1">
        <ProgressBar
          current={value}
          max={Math.ceil(displayMax)}
          size="md"
        />
      </div>
      <span className="font-mono text-[12px] text-[var(--text-secondary)] w-[28px]">
        {value}
      </span>
    </div>
  );
}

function AchievementCategory({
  label,
  achievements,
}: {
  label: string;
  achievements: Achievement[];
}) {
  if (achievements.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="font-pixel text-[8px] text-[var(--text-faint)] mb-4 tracking-widest">
        {label}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {achievements.map((a) => (
          <AchievementCard key={a.id} achievement={a} />
        ))}
      </div>
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const unlocked = achievement.unlocked;

  return (
    <div
      className={`p-3 border transition-colors ${
        unlocked
          ? "border-[var(--border-accent)] bg-[var(--accent-glow)]"
          : "border-[var(--border-dim)] bg-[var(--bg-surface)] opacity-40"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {unlocked ? (
          <span className="text-[var(--accent)] text-[10px]">&#9733;</span>
        ) : (
          <Lock size={10} className="text-[var(--text-faint)]" />
        )}
        <span
          className={`font-pixel text-[9px] ${
            unlocked
              ? "text-[var(--accent-bright)]"
              : "text-[var(--text-faint)]"
          }`}
        >
          {achievement.name.toUpperCase()}
        </span>
      </div>
      <p className={`text-[11px] leading-snug ${unlocked ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]"}`}>
        {achievement.description}
      </p>
      <div className="flex items-center justify-between mt-3">
        <span className={`text-label ${unlocked ? "text-gold" : "text-faint"}`}>
          +{achievement.xpReward} XP
        </span>
        {achievement.progress && !unlocked && (
          <span className="text-label text-faint">
            {achievement.progress.current}/{achievement.progress.target}
          </span>
        )}
        {unlocked && achievement.unlockedDate && (
          <span className="text-label text-faint">
            {achievement.unlockedDate}
          </span>
        )}
      </div>
    </div>
  );
}
