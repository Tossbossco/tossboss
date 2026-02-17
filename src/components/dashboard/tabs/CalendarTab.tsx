"use client";

import { Panel } from "../design-system";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════
// Calendar Tab — Tracks daily XP performance
// ═══════════════════════════════════════════════════════════

interface CalendarTabProps {
  dailyXp: Record<string, number>;
}

export default function CalendarTab({ dailyXp }: CalendarTabProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const days = [];
  // Padding for first week
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  // Actual days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getDayXp = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return dailyXp[dateStr] || 0;
  };

  return (
    <div className="space-y-8 fade-in">
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-accent" />
            <span className="text-label text-dim tracking-widest uppercase font-pixel">
              {`> XP_CHRONICLE`}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={prevMonth} className="p-1 hover:bg-white/5 rounded transition-colors text-dim hover:text-primary">
              <ChevronLeft size={16} />
            </button>
            <span className="text-label text-secondary min-w-[100px] text-center uppercase tracking-wider">
              {monthName} {year}
            </span>
            <button onClick={nextMonth} className="p-1 hover:bg-white/5 rounded transition-colors text-dim hover:text-primary">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <Panel className="p-4">
          <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/5">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div key={d} className="bg-[var(--bg-surface)] p-2 text-center text-[9px] font-pixel text-faint tracking-tighter">
                {d}
              </div>
            ))}
            {days.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} className="bg-[var(--bg-surface)] h-24 p-2 opacity-20" />;
              }

              const xp = getDayXp(day);
              const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
              
              return (
                <div 
                  key={day} 
                  className={`bg-[var(--bg-surface)] h-24 p-2 border-t border-l border-white/5 transition-colors hover:bg-white/[0.02] relative group ${isToday ? 'ring-1 ring-inset ring-accent/30' : ''}`}
                >
                  <span className={`text-[10px] font-mono ${isToday ? 'text-accent' : 'text-dim'}`}>
                    {String(day).padStart(2, "0")}
                  </span>
                  
                  {xp > 0 && (
                    <div className="mt-2 flex flex-col gap-1">
                      <div className="text-[10px] font-pixel text-accent">+{xp} XP</div>
                      <div 
                        className="h-1 bg-accent/20 rounded-full overflow-hidden" 
                        style={{ width: '100%' }}
                      >
                        <div 
                          className="h-full bg-accent shadow-[0_0_8px_rgba(52,168,83,0.5)]" 
                          style={{ width: `${Math.min(100, (xp / 200) * 100)}%` }} 
                        />
                      </div>
                    </div>
                  )}

                  {isToday && (
                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-accent rounded-full animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </Panel>
      </section>

      <section>
        <div className="text-label text-faint mb-4 uppercase tracking-widest">Performance_Key</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 border border-dim bg-surface/50">
            <div className="text-[10px] font-pixel text-faint mb-1">STREAK_STATUS</div>
            <div className="text-body text-secondary">ACTIVE</div>
          </div>
          <div className="p-3 border border-dim bg-surface/50">
            <div className="text-[10px] font-pixel text-faint mb-1">AVG_DAILY_XP</div>
            <div className="text-body text-secondary">
              {Object.values(dailyXp).length > 0 
                ? Math.round(Object.values(dailyXp).reduce((a, b) => a + b, 0) / Object.values(dailyXp).length)
                : 0}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
