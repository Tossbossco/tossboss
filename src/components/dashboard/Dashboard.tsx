"use client";

import { useState } from "react";
import AtmosphericWindow from "./AtmosphericWindow";
import HomeTab from "./tabs/HomeTab";
import MissionsTab from "./tabs/MissionsTab";
import StatsTab from "./tabs/StatsTab";
import BusinessTab from "./tabs/BusinessTab";
import MapTab from "./tabs/MapTab";
import CalendarTab from "./tabs/CalendarTab";
import GuideTab from "./tabs/GuideTab";
import type { DashboardData } from "@/lib/types";

// ═══════════════════════════════════════════════════════════
// Dashboard — Main shell with atmospheric window
// ═══════════════════════════════════════════════════════════

export type TabId = "home" | "missions" | "stats" | "business" | "map" | "guide" | "calendar";

const MAIN_TABS: { id: Exclude<TabId, "stats" | "guide">; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "missions", label: "Missions" },
  { id: "business", label: "Business" },
  { id: "map", label: "Map" },
  { id: "calendar", label: "Calendar" },
];

interface DashboardProps {
  data: DashboardData;
}

export default function Dashboard({ data }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const handleOpenStats = () => {
    setActiveTab("stats");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-void)]">
      {/* Top navigation */}
      <nav className="flex items-center justify-between px-6 pt-12 pb-3 max-w-[720px] mx-auto">
        {/* Left: Main tabs */}
        <div className="flex items-center gap-[10px]">
          {MAIN_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-label px-3 py-1.5 cursor-pointer transition-all hover:bg-black/[0.04] dark:hover:bg-white/[0.03] ${
                activeTab === tab.id
                  ? "text-primary bg-black/[0.06] dark:bg-white/[0.06]"
                  : "text-dim hover:text-secondary bg-black/[0.03] dark:bg-white/[0.02]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Guide */}
        <button
          onClick={() => setActiveTab("guide")}
          className={`text-label px-3 py-1.5 cursor-pointer transition-all hover:bg-black/[0.04] dark:hover:bg-white/[0.03] ${
            activeTab === "guide"
              ? "text-primary bg-black/[0.06] dark:bg-white/[0.06]"
              : "text-dim hover:text-secondary bg-black/[0.03] dark:bg-white/[0.02]"
          }`}
        >
          Guide
        </button>
      </nav>

      {/* Atmospheric Window */}
      <div className="px-6 max-w-[720px] mx-auto">
        <AtmosphericWindow
          player={data.player}
          properties={data.properties}
          onClick={handleOpenStats}
          isStatsActive={activeTab === "stats"}
          isMapActive={activeTab === "map"}
        />
      </div>

      {/* Tab Content */}
      <div className="max-w-[720px] mx-auto px-6 py-8">
        {activeTab === "home" && (
          <HomeTab
            tasks={data.tasks}
            properties={data.properties}
            storyMissions={data.missions.storyMissions}
            weeklyMissions={data.missions.weeklyMissions}
            sideMissions={data.missions.sideMissions}
            tips={data.tips}
            tipIndex={data.tipIndex}
            primaryTargetId={data.player.primaryTargetId}
          />
        )}
        {activeTab === "missions" && (
          <MissionsTab missions={data.missions} />
        )}
        {activeTab === "stats" && (
          <StatsTab
            stats={data.player.stats}
            achievements={data.achievements}
          />
        )}
        {activeTab === "business" && (
          <BusinessTab
            business={data.business}
            properties={data.properties}
            primaryTargetId={data.player.primaryTargetId}
          />
        )}
        {activeTab === "map" && (
          <MapTab properties={data.properties} />
        )}
        {activeTab === "calendar" && (
          <CalendarTab dailyXp={data.player.dailyXp || {}} />
        )}
        {activeTab === "guide" && <GuideTab />}
      </div>
    </div>
  );
}
