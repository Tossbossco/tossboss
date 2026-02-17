import { promises as fs } from "fs";
import path from "path";
import type {
  Player,
  AchievementsData,
  Business,
  PropertiesData,
  TasksData,
  MissionsData,
  TipsData,
  DashboardMetrics,
  DashboardData,
} from "./types";

// ═══════════════════════════════════════════════════════════
// Data Loaders — Server-side JSON file readers
// ═══════════════════════════════════════════════════════════

const DATA_DIR = path.join(process.cwd(), "lib", "data");

async function readDataFile<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

// Individual loaders with safe defaults

export async function getPlayer(): Promise<Player> {
  try {
    return await readDataFile<Player>("player.json");
  } catch {
    return {
      name: "Player",
      businessName: "Business",
      level: 1,
      title: "Associate",
      xp: 0,
      xpToNextLevel: 100,
      totalXpEarned: 0,
      streak: { current: 0, longest: 0, lastActiveDate: "", multiplier: 1 },
      dailyXp: {},
      stats: { sales: 0, operations: 0, marketing: 0, finance: 0, leadership: 0 },
      lastDecayCheck: "",
      decayActive: false,
      joinedDate: new Date().toISOString().split("T")[0],
    };
  }
}

export async function getAchievements(): Promise<AchievementsData> {
  try {
    return await readDataFile<AchievementsData>("achievements.json");
  } catch {
    return { achievements: [] };
  }
}

export async function getBusiness(): Promise<Business> {
  try {
    return await readDataFile<Business>("business.json");
  } catch {
    return {
      name: "",
      tagline: "",
      location: "",
      description: "",
      services: [],
      addOns: [],
      targetMarket: "",
      corePromise: "",
      website: { url: "", status: "draft", lastUpdated: "" },
      revenue: { monthlyRecurring: 0, totalEarned: 0, target: 0 },
    };
  }
}

export async function getProperties(): Promise<PropertiesData> {
  try {
    return await readDataFile<PropertiesData>("properties.json");
  } catch {
    return { properties: [] };
  }
}

export async function getTasks(): Promise<TasksData> {
  try {
    return await readDataFile<TasksData>("tasks.json");
  } catch {
    return { tasks: [] };
  }
}

export async function getMissions(): Promise<MissionsData> {
  try {
    return await readDataFile<MissionsData>("missions.json");
  } catch {
    return { storyMissions: [], weeklyMissions: [], sideMissions: [] };
  }
}

export async function getTips(): Promise<TipsData> {
  try {
    return await readDataFile<TipsData>("tips.json");
  } catch {
    return { tips: [] };
  }
}

// ═══════════════════════════════════════════════════════════
// Computed metrics
// ═══════════════════════════════════════════════════════════

function computeMetrics(
  player: Player,
  achievements: AchievementsData,
  properties: PropertiesData,
  tasks: TasksData,
  missions: MissionsData
): DashboardMetrics {
  const today = new Date().toISOString().split("T")[0];

  const todaysTasks = tasks.tasks.filter((t) => t.dueDate <= today && !t.completed);
  const todaysCompleted = tasks.tasks.filter(
    (t) => t.completed && t.completedDate === today
  );

  const activeProps = properties.properties.filter(
    (p) => p.status === "active" || p.status === "contract"
  );
  const totalUnits = activeProps.reduce((sum, p) => sum + p.units, 0);

  const activeMissions =
    missions.weeklyMissions.length +
    missions.sideMissions.filter((m) => !m.completed).length +
    (missions.storyMissions.find((m) => !m.completed) ? 1 : 0);

  const unlockedCount = achievements.achievements.filter((a) => a.unlocked).length;

  const levelThreshold = getLevelThreshold(player.level);
  const nextThreshold = player.xpToNextLevel;
  const xpInLevel = player.xp - levelThreshold;
  const xpNeeded = nextThreshold - levelThreshold;
  const xpProgress = xpNeeded > 0 ? xpInLevel / xpNeeded : 0;

  const joinedDate = new Date(player.joinedDate);
  const daysActive = Math.floor(
    (Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    tasksToday: todaysTasks.length,
    tasksTodayCompleted: todaysCompleted.length,
    totalProperties: properties.properties.length,
    activeProperties: activeProps.length,
    totalUnits,
    monthlyRevenue: 0, // computed from active properties in real usage
    activeMissions,
    achievementsUnlocked: unlockedCount,
    achievementsTotal: achievements.achievements.length,
    xpProgress: Math.min(1, Math.max(0, xpProgress)),
    daysActive,
  };
}

// ═══════════════════════════════════════════════════════════
// Level thresholds
// ═══════════════════════════════════════════════════════════

const LEVEL_THRESHOLDS = [0, 0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500];

export function getLevelThreshold(level: number): number {
  if (level <= 10) return LEVEL_THRESHOLDS[level] || 0;
  return 5500 + (level - 10) * 2000;
}

export function getLevelTitle(level: number): string {
  const titles = [
    "",
    "Associate",
    "Runner",
    "Soldier",
    "Wiseguy",
    "Made Man",
    "Capo",
    "Consigliere",
    "Boss",
    "Don",
    "Godfather",
  ];
  if (level <= 10) return titles[level];
  return `Godfather ${romanNumeral(level - 9)}`;
}

function romanNumeral(n: number): string {
  if (n <= 1) return "";
  if (n === 2) return "II";
  if (n === 3) return "III";
  if (n === 4) return "IV";
  if (n === 5) return "V";
  return n.toString();
}

// ═══════════════════════════════════════════════════════════
// Streak multiplier
// ═══════════════════════════════════════════════════════════

export function getStreakMultiplier(days: number): number {
  if (days >= 15) return 2;
  if (days >= 8) return 1.5;
  if (days >= 4) return 1.25;
  return 1;
}

// ═══════════════════════════════════════════════════════════
// Bundle all data for the dashboard
// ═══════════════════════════════════════════════════════════

export async function getDashboardData(): Promise<DashboardData> {
  const [player, achievementsData, business, propertiesData, tasksData, missions, tipsData] =
    await Promise.all([
      getPlayer(),
      getAchievements(),
      getBusiness(),
      getProperties(),
      getTasks(),
      getMissions(),
      getTips(),
    ]);

  const metrics = computeMetrics(player, achievementsData, propertiesData, tasksData, missions);

  // Compute tip index on server using day-of-year so it's stable per day
  // and consistent between SSR and client hydration
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const tipIndex = tipsData.tips.length > 0 ? dayOfYear % tipsData.tips.length : 0;

  return {
    player,
    achievements: achievementsData.achievements,
    business,
    properties: propertiesData.properties,
    tasks: tasksData.tasks,
    missions,
    tips: tipsData.tips,
    tipIndex,
    metrics,
  };
}
