"use client";

import { motion } from "framer-motion";
import { Trophy, Flame, CheckCircle2, Circle } from "lucide-react";
import { useAirStore } from "@/lib/store";
import { format, subDays, isSameDay } from "date-fns";
import clsx from "clsx";

const HABITS = [
  { id: "no-idle", label: "No car idling today", emoji: "🚗", category: "Commute", points: 10 },
  { id: "hepa-on", label: "HEPA purifier ran all day", emoji: "💨", category: "Indoor", points: 15 },
  { id: "no-burn", label: "No wood/coal burning", emoji: "🔥", category: "Heating", points: 20 },
  { id: "induction", label: "Used induction/electric cooking", emoji: "🍳", category: "Cooking", points: 15 },
  { id: "mask", label: "Wore N95 mask outdoors", emoji: "😷", category: "Protection", points: 10 },
  { id: "public-transit", label: "Used public transport", emoji: "🚌", category: "Commute", points: 20 },
  { id: "no-aerosol", label: "No aerosols/air fresheners", emoji: "🌸", category: "Indoor", points: 5 },
  { id: "windows-closed", label: "Kept windows closed during peak hours", emoji: "🪟", category: "Indoor", points: 10 },
  { id: "aqi-check", label: "Checked AQI before going out", emoji: "📊", category: "Awareness", points: 5 },
  { id: "plants", label: "Watered indoor air-purifying plants", emoji: "🌿", category: "Indoor", points: 5 },
];

const LAST_7_DAYS = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));

export default function HabitTracker() {
  const { habitLogs, logHabit } = useAirStore();
  const today = format(new Date(), "yyyy-MM-dd");

  const isLogged = (habitId: string, date: string) =>
    habitLogs.some((l) => l.habitId === habitId && l.date === date && l.completed);

  const todayPoints = HABITS.filter((h) => isLogged(h.id, today)).reduce((sum, h) => sum + h.points, 0);
  const maxPoints = HABITS.reduce((sum, h) => sum + h.points, 0);
  const streak = calculateStreak(habitLogs);

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Today's Points" value={`${todayPoints}/${maxPoints}`} icon="⭐" color="yellow" />
        <StatCard label="Day Streak" value={`${streak} 🔥`} icon="🏆" color="orange" />
        <StatCard label="Habits Done" value={`${HABITS.filter((h) => isLogged(h.id, today)).length}/${HABITS.length}`} icon="✅" color="green" />
      </div>

      {/* 7-day mini calendar */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Last 7 Days</h3>
        <div className="flex gap-2">
          {LAST_7_DAYS.map((date) => {
            const dateStr = format(date, "yyyy-MM-dd");
            const count = HABITS.filter((h) => isLogged(h.id, dateStr)).length;
            const pct = Math.round((count / HABITS.length) * 100);
            const isToday = isSameDay(date, new Date());
            return (
              <div key={dateStr} className="flex-1 text-center">
                <div className="text-xs text-gray-400 mb-1">{format(date, "EEE")}</div>
                <div className={clsx("w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold border-2 transition",
                  isToday ? "border-green-500" : "border-transparent",
                  pct >= 80 ? "bg-green-100 text-green-700" : pct >= 50 ? "bg-yellow-100 text-yellow-700" : pct > 0 ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-400"
                )}>
                  {count}
                </div>
                <div className="text-xs text-gray-300 mt-0.5">{format(date, "d")}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's habits */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Today's Habits</h3>
          <p className="text-xs text-gray-400">{format(new Date(), "EEEE, MMMM d")}</p>
        </div>
        <div className="divide-y divide-gray-50">
          {HABITS.map((habit, i) => {
            const done = isLogged(habit.id, today);
            return (
              <motion.button key={habit.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                onClick={() => logHabit(habit.id, today)}
                className={clsx("w-full flex items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50",
                  done ? "opacity-70" : ""
                )}>
                <span className="text-xl">{habit.emoji}</span>
                <div className="flex-1">
                  <div className={clsx("text-sm font-medium", done ? "line-through text-gray-400" : "text-gray-800")}>{habit.label}</div>
                  <div className="text-xs text-gray-400">{habit.category} · {habit.points} pts</div>
                </div>
                {done
                  ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  : <Circle className="w-5 h-5 text-gray-200 shrink-0" />}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 p-3 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-lg font-bold text-gray-800">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}

function calculateStreak(logs: any[]): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const dateStr = format(subDays(today, i), "yyyy-MM-dd");
    const count = logs.filter((l) => l.date === dateStr && l.completed).length;
    if (count > 0) streak++;
    else break;
  }
  return streak;
}
