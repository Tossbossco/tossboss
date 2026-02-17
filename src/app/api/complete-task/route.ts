import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { Task, TasksData, Player } from "@/lib/types";
import { getLevelTitle, getLevelThreshold, getStreakMultiplier } from "@/lib/loaders";

const DATA_DIR = path.join(process.cwd(), "lib", "data");

async function readData<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

async function writeData<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(request: Request) {
  try {
    const { taskId } = await request.json();
    
    if (!taskId) {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 });
    }

    // 1. Read data
    const tasksData = await readData<TasksData>("tasks.json");
    const player = await readData<Player>("player.json");

    // 2. Find task
    const taskIndex = tasksData.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = tasksData.tasks[taskIndex];
    const isUndo = task.completed; // If already completed, we are undoing

    // 3. Update Task
    const today = new Date().toISOString().split("T")[0];
    
    if (isUndo) {
      // UNDO LOGIC
      task.completed = false;
      task.completedDate = undefined;
      
      // Revert XP
      player.xp = Math.max(0, player.xp - task.xpReward);
      player.totalXpEarned = Math.max(0, player.totalXpEarned - task.xpReward);

      // Revert Daily XP
      if (player.dailyXp && player.dailyXp[today]) {
        player.dailyXp[today] = Math.max(0, player.dailyXp[today] - task.xpReward);
      }
      
      // Revert Stats
      if (task.category && player.stats[task.category] !== undefined) {
        const statBoost = task.xpReward >= 50 ? 2 : 1;
        player.stats[task.category] = Math.max(0, player.stats[task.category] - statBoost);
      }
      
      // Revert Level (if XP drops below current threshold)
      // Note: This is simplified. True de-leveling is complex if thresholds change dynamically.
      // For now, we'll just check if XP < current level base threshold.
      const currentLevelBase = getLevelThreshold(player.level);
      if (player.xp < currentLevelBase && player.level > 1) {
        player.level -= 1;
        player.title = getLevelTitle(player.level);
        player.xpToNextLevel = getLevelThreshold(player.level + 1);
      }
      
      // Note: We generally don't revert streaks on undo because it's messy and punitive for a misclick.
      // We'll leave the streak as is.
      
    } else {
      // COMPLETE LOGIC
      task.completed = true;
      task.completedDate = today;
      
      // Award XP
      player.xp += task.xpReward;
      player.totalXpEarned += task.xpReward;

      // Award Daily XP
      if (!player.dailyXp) player.dailyXp = {};
      player.dailyXp[today] = (player.dailyXp[today] || 0) + task.xpReward;

      // Award Stats
      if (task.category && player.stats[task.category] !== undefined) {
        const statBoost = task.xpReward >= 50 ? 2 : 1;
        player.stats[task.category] += statBoost;
      }

      // Level Check
      let nextThreshold = player.xpToNextLevel;
      if (player.xp >= nextThreshold) {
        player.level += 1;
        player.title = getLevelTitle(player.level);
        const newNextThreshold = getLevelThreshold(player.level + 1);
        player.xpToNextLevel = newNextThreshold;
      }

      // Streak Logic
      if (player.streak.lastActiveDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        
        if (player.streak.lastActiveDate === yesterday) {
          player.streak.current += 1;
        } else if (player.streak.lastActiveDate < yesterday) {
          player.streak.current = 1;
        }
        
        player.streak.lastActiveDate = today;
        if (player.streak.current > player.streak.longest) {
          player.streak.longest = player.streak.current;
        }
        player.streak.multiplier = getStreakMultiplier(player.streak.current);
      }
    }
    
    tasksData.tasks[taskIndex] = task;

    // 5. Save Data
    await Promise.all([
      writeData("tasks.json", tasksData),
      writeData("player.json", player),
    ]);

    return NextResponse.json({ success: true, task, player });
  } catch (error) {
    console.error("Error toggling task:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
