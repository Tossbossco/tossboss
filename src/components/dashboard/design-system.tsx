"use client";

import { ReactNode } from "react";

// ═══════════════════════════════════════════════════════════
// Dashboard Design System
// Reusable primitives for consistency across tabs
// ═══════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────
// Section Header
// ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-label font-medium text-primary">{title}</h2>
        {subtitle && (
          <p className="text-label text-dim mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Panel / Surface
// ───────────────────────────────────────────────────────────

interface PanelProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Panel({ children, className = "", hover = false }: PanelProps) {
  return (
    <div
      className={`
        bg-surface border border-dim p-4
        ${hover ? "hover:border-bright transition-colors cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Stat Box
// ───────────────────────────────────────────────────────────

interface StatBoxProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatBox({ label, value, subtext, trend }: StatBoxProps) {
  const trendColor = {
    up: "text-accent",
    down: "text-red",
    neutral: "text-dim",
  }[trend || "neutral"];

  return (
    <div className="bg-surface border border-dim p-4">
      <div className="text-label text-dim mb-1">{label}</div>
      <div className="text-body font-medium text-primary">{value}</div>
      {subtext && (
        <div className={`text-label mt-1 ${trendColor}`}>{subtext}</div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Progress Bar
// ───────────────────────────────────────────────────────────

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  color?: "accent" | "gold" | "red";
}

export function ProgressBar({
  current,
  max,
  label,
  size = "md",
  color = "accent",
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));

  const heightClass = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  }[size];

  const colorClass = {
    accent: "bg-accent",
    gold: "bg-gold",
    red: "bg-red",
  }[color];

  return (
    <div>
      {label && (
        <div className="flex justify-between text-label mb-1.5">
          <span className="text-dim">{label}</span>
          <span className="text-secondary">
            {current}/{max}
          </span>
        </div>
      )}
      <div className={`w-full bg-elevated ${heightClass}`}>
        <div
          className={`${colorClass} ${heightClass} xp-fill`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// XP Progress (specialized for level progression)
// ───────────────────────────────────────────────────────────

interface XPProgressProps {
  current: number;
  toNext: number;
  level: number;
  title: string;
}

export function XPProgress({ current, toNext, level, title }: XPProgressProps) {
  const percentage = Math.min(100, Math.max(0, (current / toNext) * 100));

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-label font-medium text-primary">{title}</span>
          <span className="text-label text-dim">Lvl {level}</span>
        </div>
        <span className="text-label text-secondary">
          {current}/{toNext} XP
        </span>
      </div>
      <div className="w-full h-2 bg-elevated">
        <div
          className="h-2 bg-accent xp-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Badge / Chip
// ───────────────────────────────────────────────────────────

type BadgeVariant = 
  | "default"
  | "accent"
  | "gold"
  | "priorityHigh"
  | "priorityMedium"
  | "priorityLow"
  | "statusActive"
  | "statusProspect"
  | "statusMeeting"
  | "statusContract"
  | "statusChurned";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const badgeStyles: Record<BadgeVariant, string> = {
  default: "bg-elevated text-secondary",
  accent: "bg-accent-glow text-accent",
  gold: "bg-gold-glow text-gold",
  priorityHigh: "bg-red/10 text-red",
  priorityMedium: "bg-gold/10 text-gold",
  priorityLow: "bg-accent/10 text-accent",
  statusActive: "bg-accent/10 text-accent",
  statusProspect: "bg-blue-500/10 text-blue-500",
  statusMeeting: "bg-gold/10 text-gold",
  statusContract: "bg-accent/10 text-accent",
  statusChurned: "bg-faint/10 text-faint",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={`text-label px-2 py-0.5 inline-block ${badgeStyles[variant]} ${className || ""}`}>
      {children}
    </span>
  );
}

// ───────────────────────────────────────────────────────────
// Empty State
// ───────────────────────────────────────────────────────────

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4 border border-dashed border-dim">
      <div className="text-body text-dim mb-1">{title}</div>
      {description && <p className="text-label text-faint mb-4">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// List Item (for tasks, properties, etc.)
// ───────────────────────────────────────────────────────────

interface ListItemProps {
  title: string;
  subtitle?: string;
  meta?: string;
  badge?: ReactNode;
  action?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ListItem({
  title,
  subtitle,
  meta,
  badge,
  action,
  onClick,
  className = "",
}: ListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center justify-between py-3 px-4 
        border-b border-dim last:border-b-0
        hover:bg-[var(--bg-hover)] transition-colors
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-body text-primary truncate">{title}</span>
          {badge && <span className="flex-shrink-0">{badge}</span>}
        </div>
        {subtitle && <p className="text-label text-dim mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        {meta && <span className="text-label text-faint">{meta}</span>}
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Task Row (checkbox + text + XP + optional date)
// ───────────────────────────────────────────────────────────

interface TaskRowProps {
  task: string;
  xp: number;
  completed: boolean;
  priority: "high" | "medium" | "low";
  onToggle?: () => void;
  dueDate?: string;
}

export function TaskRow({ task, xp, completed, priority, onToggle, dueDate }: TaskRowProps) {
  const isMutable = typeof onToggle === "function";
  const priorityColor = {
    high: "bg-priority-high",
    medium: "bg-priority-medium",
    low: "bg-priority-low",
  }[priority];

  return (
    <div
      className={`
        flex items-center gap-3 py-2.5 px-3 
        hover:bg-[var(--bg-hover)] transition-colors group
        ${completed ? "opacity-50" : ""}
      `}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${priorityColor} flex-shrink-0`} />
      <input
        type="checkbox"
        checked={completed}
        onChange={isMutable ? onToggle : undefined}
        readOnly={!isMutable}
        className="task-check flex-shrink-0"
      />
      <span
        className={`
          flex-1 text-body 
          ${completed ? "line-through text-dim" : "text-primary"}
        `}
      >
        {task}
      </span>
      {dueDate && (
        <span className="text-label text-dim flex-shrink-0">
          {new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      )}
      <span className="text-label text-accent">+{xp} XP</span>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Mission Card
// ───────────────────────────────────────────────────────────

interface MissionCardProps {
  name: string;
  description: string;
  progress?: { current: number; target: number };
  xp: number;
  completed?: boolean;
  onClick?: () => void;
  className?: string;
}

export function MissionCard({
  name,
  description,
  progress,
  xp,
  completed = false,
  onClick,
  className = "",
}: MissionCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        p-4 border border-dim bg-surface
        ${completed ? "opacity-60" : "hover:border-bright"}
        ${onClick ? "cursor-pointer" : ""}
        transition-colors
        ${className}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-body font-medium ${completed ? "line-through text-dim" : "text-primary"}`}>
          {name}
        </h3>
        <span className="text-label text-accent">+{xp} XP</span>
      </div>
      <p className="text-label text-dim mb-3">{description}</p>
      {progress && (
        <ProgressBar
          current={progress.current}
          max={progress.target}
          size="sm"
        />
      )}
      {completed && (
        <div className="mt-2 text-label text-accent">Completed</div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Achievement Badge
// ───────────────────────────────────────────────────────────

interface AchievementBadgeProps {
  name: string;
  description: string;
  xp: number;
  unlocked: boolean;
  unlockedDate?: string;
}

export function AchievementBadge({
  name,
  description,
  xp,
  unlocked,
}: AchievementBadgeProps) {
  return (
    <div
      className={`
        p-3 border border-dim text-center
        ${unlocked ? "bg-surface" : "bg-elevated opacity-50"}
      `}
    >
      <div className={`text-body font-medium ${unlocked ? "text-primary" : "text-dim"}`}>
        {name}
      </div>
      <p className="text-label text-dim mt-1">{description}</p>
      {unlocked ? (
        <div className="mt-2 text-label text-gold">+{xp} XP</div>
      ) : (
        <div className="mt-2 text-label text-faint">Locked</div>
      )}
    </div>
  );
}
