"use client";

import type { Task, Property, StoryMission, WeeklyMission, SideMission } from "@/lib/types";
import { useRouter } from "next/navigation";
import { isOverdue } from "@/lib/utils";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Crosshair,
  MapPin,
  Sword,
  Target,
} from "lucide-react";
import { ProgressBar, TaskRow, MissionCard, Panel } from "../design-system";

// ═══════════════════════════════════════════════════════════
// Home Tab — Today's tasks, active missions, tip
// ═══════════════════════════════════════════════════════════

interface HomeTabProps {
  tasks: Task[];
  properties: Property[];
  storyMissions: StoryMission[];
  weeklyMissions: WeeklyMission[];
  sideMissions: SideMission[];
  tips: string[];
  tipIndex: number;
  primaryTargetId?: string | null;
}

export default function HomeTab({
  tasks,
  properties,
  storyMissions,
  weeklyMissions,
  sideMissions,
  tips,
  tipIndex,
  primaryTargetId,
}: HomeTabProps) {
  const today = new Date().toISOString().split("T")[0];
  
  const primaryTarget = properties.find(p => p.id === primaryTargetId);

  const todayTasks = tasks.filter(
    (t) => !t.completed && (t.dueDate === today || isOverdue(t.dueDate))
  );
  const completedToday = tasks.filter(
    (t) => t.completed && t.completedDate === today
  );
  const upcomingTasks = tasks.filter(
    (t) => !t.completed && t.dueDate > today
  ).slice(0, 3);

  const router = useRouter();

  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await fetch("/api/complete-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to complete task", err);
    }
  };

  const activeStory = storyMissions.find((m) => !m.completed);

  return (
    <div className="space-y-10 fade-in">
      {/* Primary Target Highlight */}
      {primaryTarget && (
        <section>
          <SectionHeader icon={<MapPin size={12} />} label="PRIMARY_TARGET" />
          <Panel className="mt-3 border-[var(--accent)] bg-[var(--accent-glow)] shadow-[0_0_15px_rgba(52,168,83,0.1)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-label text-[var(--accent)] mb-1 tracking-widest uppercase font-pixel">Priority_Intel</div>
                <div className="text-body font-medium text-primary">{primaryTarget.name.toUpperCase()}</div>
                <div className="text-label text-dim mt-1">{primaryTarget.units} Units • {primaryTarget.status.toUpperCase()}</div>
              </div>
              <div className="text-right">
                <div className="text-label text-faint mb-1">CURRENT_PHASE</div>
                <div className="text-label text-secondary px-2 py-1 bg-white/5 border border-white/10 rounded">
                  FIRST_CONTACT
                </div>
              </div>
            </div>
          </Panel>
        </section>
      )}

      {/* Active Story Mission */}
      {activeStory && (
        <section>
          <SectionHeader icon={<Sword size={12} />} label="STORY_MISSION" />
          <MissionCard
            name={activeStory.name.toUpperCase()}
            description={activeStory.description}
            xp={activeStory.xpReward}
            progress={activeStory.progress}
            className="mt-3 !border-[var(--border-accent)] !bg-[var(--accent-glow)]"
          />
        </section>
      )}

      {/* Today's Tasks */}
      <section>
        <SectionHeader
          icon={<Crosshair size={12} />}
          label="TODAY"
          count={todayTasks.length}
        />
        <div className="mt-3 space-y-0">
          {todayTasks.length === 0 && completedToday.length === 0 && (
            <div className="text-body text-faint py-4 text-center">
              No tasks for today. Tell the AI what you worked on.
            </div>
          )}
          {todayTasks.map((task) => (
            <TaskRowDS key={task.id} task={task} onToggle={() => handleToggleTask(task.id)} />
          ))}
        </div>
      </section>

      {/* Completed Today */}
      {completedToday.length > 0 && (
        <section>
          <SectionHeader
            icon={<CheckCircle2 size={12} />}
            label="COMPLETED_TODAY"
            count={completedToday.length}
          />
          <div className="mt-3 space-y-0 opacity-60">
            {completedToday.map((task) => (
              <TaskRowDS key={task.id} task={task} onToggle={() => handleToggleTask(task.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcomingTasks.length > 0 && (
        <section>
          <SectionHeader
            icon={<Circle size={12} />}
            label="UPCOMING"
            count={upcomingTasks.length}
          />
          <div className="mt-3 space-y-0">
            {upcomingTasks.map((task) => (
              <TaskRowDS key={task.id} task={task} showDate onToggle={() => handleToggleTask(task.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Active Missions (weekly + side) */}
      {(weeklyMissions.length > 0 || sideMissions.filter((m) => !m.completed).length > 0) && (
        <section>
          <SectionHeader
            icon={<Target size={12} />}
            label="ACTIVE_MISSIONS"
          />
          <div className="mt-3 space-y-3">
            {weeklyMissions.map((m) => (
              <CompactMissionRow key={m.id} name={m.name} desc={m.description} xp={m.xpReward} progress={m.progress} type="WEEKLY" />
            ))}
            {sideMissions
              .filter((m) => !m.completed)
              .slice(0, 3)
              .map((m) => (
                <CompactMissionRow key={m.id} name={m.name} desc={m.description} xp={m.xpReward} type="SIDE" />
              ))}
          </div>
        </section>
      )}

      {/* Tip */}
      {tips.length > 0 && (
        <section className="border-t border-dim pt-4">
          <div className="text-label text-faint mb-1">
            TIP
          </div>
          <p className="text-body text-secondary leading-relaxed">
            {tips[tipIndex]}
          </p>
        </section>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────

function SectionHeader({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-accent">{icon}</span>
      <span className="text-label text-dim tracking-wider">
        {`> ${label}`}
      </span>
      {count !== undefined && (
        <span className="text-label text-faint">
          [{count}]
        </span>
      )}
    </div>
  );
}

// Wrapper to adapt TaskRow primitive to HomeTab's needs
function TaskRowDS({ task, showDate, onToggle }: { task: Task; showDate?: boolean; onToggle?: () => void }) {
  return (
    <TaskRow
      task={task.task}
      xp={task.xpReward}
      completed={task.completed}
      priority={task.priority}
      dueDate={showDate ? task.dueDate : undefined}
      onToggle={onToggle}
    />
  );
}

// Compact mission row for weekly/side missions (different from full MissionCard)
function CompactMissionRow({
  name,
  desc,
  xp,
  progress,
  type,
}: {
  name: string;
  desc: string;
  xp: number;
  progress?: { current: number; target: number };
  type: "WEEKLY" | "SIDE";
}) {
  return (
    <div className="p-3 border border-dim bg-surface hover:bg-[var(--bg-hover)] hover:border-accent/20 transition-all duration-200 group cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <ChevronRight size={10} className="text-faint group-hover:text-accent transition-colors" />
          <span className="text-label text-secondary group-hover:text-primary transition-colors">
            {name.toUpperCase()}
          </span>
          <span className="text-label text-faint">{type}</span>
        </div>
        <span className="text-label text-accent">+{xp}</span>
      </div>
      <p className="text-body text-dim mt-1 ml-5">
        {desc}
      </p>
      {progress && (
        <div className="mt-2 ml-5">
          <ProgressBar
            current={progress.current}
            max={progress.target}
            size="sm"
          />
        </div>
      )}
    </div>
  );
}
