"use client";

import type { MissionsData } from "@/lib/types";
import { Check, Lock, ChevronRight, Target, Swords, Scroll } from "lucide-react";
import { ProgressBar, Panel } from "../design-system";

// ═══════════════════════════════════════════════════════════
// Missions Tab — Story progress, weekly, side missions
// ═══════════════════════════════════════════════════════════

interface MissionsTabProps {
  missions: MissionsData;
}

export default function MissionsTab({ missions }: MissionsTabProps) {
  const activeStoryIndex = missions.storyMissions.findIndex((m) => !m.completed);

  return (
    <div className="space-y-12 fade-in">
      {/* Story Missions - Main arc */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Swords size={12} className="text-[var(--accent)]" />
          <span className="font-pixel text-[10px] text-[var(--text-secondary)] tracking-wider">
            {"> STORY_ARC"}
          </span>
        </div>

        <div className="space-y-0">
          {missions.storyMissions.map((mission, i) => {
            const isActive = i === activeStoryIndex;
            const isLocked = i > activeStoryIndex && activeStoryIndex >= 0;
            const isComplete = mission.completed;

            return (
              <div
                key={mission.id}
                className={`
                  flex items-start gap-3 px-4 py-3.5 border-l-2 border-b border-b-[var(--border-dim)]
                  ${isComplete ? "border-l-[var(--text-faint)] opacity-25" : ""}
                  ${isActive ? "border-l-[var(--accent)] bg-[var(--accent-glow)]" : ""}
                  ${isLocked ? "border-l-[var(--border-dim)] opacity-50" : ""}
                `}
              >
                {/* Status icon */}
                <div className="mt-0.5 flex-shrink-0">
                  {isComplete && (
                    <Check size={12} className="text-[var(--text-muted)]" />
                  )}
                  {isActive && (
                    <ChevronRight size={12} className="text-[var(--accent)]" />
                  )}
                  {isLocked && (
                    <Lock size={10} className="text-[var(--text-faint)]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-[8px] text-[var(--text-faint)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-pixel text-[10px] ${
                        isActive
                          ? "text-[var(--accent-bright)]"
                          : isComplete
                            ? "text-[var(--text-muted)]"
                            : "text-[var(--text-faint)]"
                      }`}
                    >
                      {mission.name.toUpperCase()}
                    </span>
                    <span
                      className={`font-pixel text-[8px] ml-auto ${
                        isActive ? "text-[var(--gold)]" : "text-[var(--text-faint)]"
                      }`}
                    >
                      +{mission.xpReward}
                    </span>
                  </div>
                  <p
                    className={`text-[12px] mt-0.5 ${
                      isActive ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]"
                    }`}
                  >
                    {mission.description}
                  </p>
                  {isActive && mission.progress && (
                    <div className="mt-2">
                      <ProgressBar
                        current={mission.progress.current}
                        max={mission.progress.target}
                        size="sm"
                      />
                    </div>
                  )}
                  {isComplete && mission.completedDate && (
                    <span className="text-label text-faint mt-0.5 inline-block">
                      {mission.completedDate}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Weekly Missions */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Target size={12} className="text-[var(--accent)]" />
          <span className="font-pixel text-[10px] text-[var(--text-secondary)] tracking-wider">
            {"> WEEKLY"}
          </span>
        </div>
        <div className="space-y-3">
          {missions.weeklyMissions.map((m) => (
            <Panel key={m.id} className="p-3">
              <div className="flex justify-between items-center">
                <span className="font-pixel text-[9px] text-[var(--text-secondary)]">
                  {m.name.toUpperCase()}
                </span>
                <span className="font-pixel text-[8px] text-[var(--gold-dim)]">
                  +{m.xpReward} XP
                </span>
              </div>
              <p className="text-[12px] text-[var(--text-muted)] mt-2">{m.description}</p>
              <div className="mt-3">
                <ProgressBar
                  current={m.progress.current}
                  max={m.progress.target}
                  size="sm"
                />
              </div>
              {m.statBoost && (
                <div className="text-label text-faint mt-1">
                  {m.statBoost.stat.toUpperCase()} +{m.statBoost.amount}
                </div>
              )}
            </Panel>
          ))}
        </div>
      </section>

      {/* Side Missions */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Scroll size={12} className="text-[var(--accent)]" />
          <span className="font-pixel text-[10px] text-[var(--text-secondary)] tracking-wider">
            {"> SIDE_MISSIONS"}
          </span>
        </div>
        <div className="space-y-3">
          {missions.sideMissions.map((m) => (
            <Panel
              key={m.id}
              className={`p-3 ${m.completed ? "opacity-35" : ""}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {m.completed && <Check size={10} className="text-[var(--text-muted)]" />}
                  <span className={`font-pixel text-[9px] ${m.completed ? "text-[var(--text-faint)] line-through" : "text-[var(--text-secondary)]"}`}>
                    {m.name.toUpperCase()}
                  </span>
                </div>
                <span className="font-pixel text-[8px] text-[var(--gold-dim)]">
                  +{m.xpReward}
                </span>
              </div>
              <p className="text-[12px] text-[var(--text-muted)] mt-2">{m.description}</p>
            </Panel>
          ))}
        </div>
      </section>
    </div>
  );
}
