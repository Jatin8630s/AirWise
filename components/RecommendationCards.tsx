"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, CheckCircle2, Circle, Info, Zap, Wind, Car, ChefHat, Leaf } from "lucide-react";
import { useAirStore, Recommendation } from "@/lib/store";
import clsx from "clsx";

const CATEGORY_ICONS: Record<string, any> = {
  routine: Sparkles, indoor: Wind, commute: Car, cooking: ChefHat, "long-term": Leaf, default: Zap,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
};

export default function RecommendationCards() {
  const { aqi, profile, recommendations, setRecommendations } = useAirStore();
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (recommendations.length === 0) loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aqiData: aqi, userProfile: profile }),
      });
      const data = await res.json();
      setRecommendations(data.recommendations ?? []);
    } catch {
      // fallback to static recommendations
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (loading) return <LoadingCards />;

  const score = recommendations.length > 0 ? Math.round((completed.size / recommendations.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Today's Action Score</span>
          <span className="text-sm font-bold text-green-600">{score}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{completed.size} done</span>
          <span>{recommendations.length - completed.size} remaining</span>
        </div>
      </div>

      {/* Refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-gray-800">Your Personalized Actions</h2>
        <button onClick={loadRecommendations} className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 font-medium">
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {recommendations.map((rec, i) => {
            const Icon = CATEGORY_ICONS[rec.category?.toLowerCase()] ?? CATEGORY_ICONS.default;
            const done = completed.has(rec.id);
            const isOpen = expanded === rec.id;

            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={clsx(
                  "bg-white dark:bg-gray-900 rounded-xl border shadow-sm overflow-hidden transition",
                  done ? "border-green-300 opacity-80" : "border-gray-100"
                )}
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setExpanded(isOpen ? null : rec.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", done ? "bg-green-100" : "bg-gray-100")}>
                      {done ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Icon className="w-5 h-5 text-gray-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={clsx("text-xs rounded-full px-2 py-0.5 font-medium", DIFFICULTY_COLORS[rec.difficulty])}>
                          {rec.difficulty}
                        </span>
                        {rec.forVulnerable && (
                          <span className="text-xs bg-red-50 text-red-600 rounded-full px-2 py-0.5 font-medium">vulnerable group</span>
                        )}
                        {rec.co2Saved && (
                          <span className="text-xs bg-blue-50 text-blue-600 rounded-full px-2 py-0.5 font-medium">🌍 {rec.co2Saved}</span>
                        )}
                      </div>
                      <div className={clsx("font-semibold text-sm mt-1", done ? "line-through text-gray-400" : "text-gray-800")}>
                        {rec.title}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleComplete(rec.id); }}
                      className="shrink-0 mt-1"
                    >
                      {done
                        ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                        : <Circle className="w-5 h-5 text-gray-300 hover:text-gray-400" />}
                    </button>
                  </div>

                  {/* Impact bar */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-gray-400">Impact</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                      <div className="h-full rounded-full bg-green-500" style={{ width: `${rec.impactScore ?? 50}%` }} />
                    </div>
                    <span className="text-xs font-medium text-green-600">{rec.impactScore ?? 50}%</span>
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-100 bg-gray-50 dark:bg-gray-800 px-4 py-3"
                    >
                      <p className="text-sm text-gray-600 leading-relaxed">{rec.description}</p>
                      <div className="mt-2 flex items-start gap-2 bg-green-50 rounded-lg p-2">
                        <Info className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-green-700 font-medium">{rec.impact}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function LoadingCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-gray-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}
