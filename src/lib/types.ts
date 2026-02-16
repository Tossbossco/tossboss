// ═══════════════════════════════════════════════════════════
// Types — All data shapes for the dashboard
// ═══════════════════════════════════════════════════════════

export interface Player {
  name: string;
  businessName: string;
  level: number;
  title: string;
  xp: number;
  xpToNextLevel: number;
  totalXpEarned: number;
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string;
    multiplier: number;
  };
  stats: CharacterStats;
  lastDecayCheck: string;
  decayActive: boolean;
  joinedDate: string;
  primaryTargetId?: string | null;
}

export interface CharacterStats {
  sales: number;
  operations: number;
  marketing: number;
  finance: number;
  leadership: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: "hustle" | "business" | "growth";
  xpReward: number;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: { current: number; target: number };
}

export interface AchievementsData {
  achievements: Achievement[];
}

export interface Service {
  name: string;
  frequency: string;
  pricePerUnit: number;
  description: string;
  popular?: boolean;
}

export interface Business {
  name: string;
  tagline: string;
  location: string;
  description: string;
  services: Service[];
  addOns: string[];
  targetMarket: string;
  corePromise: string;
  website: {
    url: string;
    status: string;
    lastUpdated: string;
  };
  revenue: {
    monthlyRecurring: number;
    totalEarned: number;
    target: number;
  };
}

export interface PropertyContact {
  name: string;
  role: string;
  phone: string | null;
  email: string | null;
  lastContact: string;
  notes: string;
}

export interface Property {
  id: string;
  name: string;
  status: "prospect" | "meeting" | "negotiation" | "contract" | "active" | "churned";
  units: number;
  tier: string | null;
  address: string;
  notes: string;
  contacts: PropertyContact[];
  createdDate: string;
}

export interface PropertiesData {
  properties: Property[];
}

export interface Task {
  id: string;
  task: string;
  priority: "high" | "medium" | "low";
  xpReward: number;
  dueDate: string;
  linkedProperty: string | null;
  completed: boolean;
  completedDate?: string;
  category: "sales" | "operations" | "marketing" | "finance" | "leadership";
}

export interface TasksData {
  tasks: Task[];
}

export interface StoryMission {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  completed: boolean;
  completedDate?: string;
  progress?: { current: number; target: number };
}

export interface WeeklyMission {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  statBoost: { stat: keyof CharacterStats; amount: number };
  progress: { current: number; target: number };
  weekStart: string;
}

export interface SideMission {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  statBoost: { stat: keyof CharacterStats; amount: number };
  completed: boolean;
  completedDate?: string;
}

export interface MissionsData {
  storyMissions: StoryMission[];
  weeklyMissions: WeeklyMission[];
  sideMissions: SideMission[];
}

export interface TipsData {
  tips: string[];
}

// Computed dashboard metrics
export interface DashboardMetrics {
  tasksToday: number;
  tasksTodayCompleted: number;
  totalProperties: number;
  activeProperties: number;
  totalUnits: number;
  monthlyRevenue: number;
  activeMissions: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
  xpProgress: number; // 0-1
  daysActive: number;
}

// All data bundled for the client component
export interface DashboardData {
  player: Player;
  achievements: Achievement[];
  business: Business;
  properties: Property[];
  tasks: Task[];
  missions: MissionsData;
  tips: string[];
  tipIndex: number; // Server-computed to avoid hydration mismatch
  metrics: DashboardMetrics;
}
