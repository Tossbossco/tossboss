"use client";

import type { Player } from "@/lib/types";
import { Flame } from "lucide-react";

// ═══════════════════════════════════════════════════════════
// AtmosphericWindow — Visual window with status overlay
// ═══════════════════════════════════════════════════════════

const LEVEL_TITLES = [
  "", "Associate", "Runner", "Soldier", "Wiseguy", "Made Man",
  "Capo", "Consigliere", "Boss", "Don", "Godfather",
];

function getTitle(level: number): string {
  if (level <= 10) return LEVEL_TITLES[level] || "";
  return `Godfather ${level - 9 > 1 ? romanNumeral(level - 9) : ""}`.trim();
}

function romanNumeral(n: number): string {
  if (n === 2) return "II";
  if (n === 3) return "III";
  if (n === 4) return "IV";
  if (n === 5) return "V";
  return n.toString();
}

interface AtmosphericWindowProps {
  player: Player;
  onClick: () => void;
  isStatsActive: boolean;
}

export default function AtmosphericWindow({
  player,
  onClick,
  isStatsActive,
}: AtmosphericWindowProps) {
  const nextTitle = getTitle(player.level + 1);

  return (
    <div
      onClick={onClick}
      className={`
        relative h-[360px] border border-black/[0.08] dark:border-white/10 overflow-hidden
        cursor-pointer transition-all duration-200
        ${isStatsActive ? "border-black/[0.20] dark:border-white/25" : "hover:border-black/[0.12] dark:hover:border-white/20"}
      `}
    >
      {/* Atmospheric background image - 100% opacity in light, 60% in dark */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-100 dark:opacity-60"
        style={{ backgroundImage: "url('/winodw-bg.png')" }}
      />
      
      {/* Gradient fade overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

      {/* Status overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 p-2">
        {/* Current level */}
        <span className="text-label text-white px-4 py-1.5 bg-white/15 dark:bg-white/5 backdrop-blur-[10px] flex-shrink-0">{player.title}</span>
        
        {/* Progress bar container - contains XP and next level */}
        <div className="flex-1 flex items-center justify-between px-4 py-1.5 bg-white/15 dark:bg-white/5 backdrop-blur-[10px] min-w-0">
          <span className="text-label text-white/80">
            {player.xp}/{player.xpToNextLevel}xp
          </span>
          <span className="text-label text-white/80">{nextTitle}</span>
        </div>
        
        {/* Streak */}
        <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white/15 dark:bg-white/5 backdrop-blur-[10px] flex-shrink-0">
          <Flame
            size={14}
            className={
              player.streak.current >= 4 ? "text-white" : "text-white/60"
            }
          />
          <span className="text-label text-white/80">
            {player.streak.current}
          </span>
        </div>
      </div>
    </div>
  );
}
