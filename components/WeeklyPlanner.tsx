"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Sparkles, Download } from "lucide-react";
import { useAirStore } from "@/lib/store";
import { format, addDays, startOfWeek } from "date-fns";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SLOTS = ["Morning", "Afternoon", "Evening"];

const DEFAULT_PLAN = {
  Mon: { Morning: "🚶 Walk before 8am (AQI peaks later)", Afternoon: "🏠 WFH or indoor tasks", Evening: "🌿 Air purifier + ventilate briefly" },
  Tue: { Morning: "🚌 Public transit (not personal car)", Afternoon: "🥗 Induction cooking", Evening: "🧘 Indoor yoga session" },
  Wed: { Morning: "🚲 Cycle to work (mask on)", Afternoon: "🌱 Water indoor plants", Evening: "📱 Check AQI forecast for tomorrow" },
  Thu: { Morning: "🥗 Cook with minimal gas", Afternoon: "💨 Change HVAC filter", Evening: "🛁 Avoid aerosol products" },
  Fri: { Morning: "🚶 Walk with N95 if AQI > 150", Afternoon: "🛒 Eco-friendly shopping", Evening: "🕯️ No candles — use LED" },
  Sat: { Morning: "🌳 Visit park early (cleanest air)", Afternoon: "🧹 HEPA vacuum the home", Evening: "🍃 Cook ventilated, windows cracked" },
  Sun: { Morning: "🏃 Outdoor run before 9am", Afternoon: "🔋 Plan e-bike commute week", Evening: "📊 Review your AirWise habit log" },
};

export default function WeeklyPlanner() {
  const { aqi, profile } = useAirStore();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Record<string, Record<string, string>>>(DEFAULT_PLAN);
  const [aiGenerated, setAiGenerated] = useState(false);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Generate a 7-day low-emission daily routine plan for my household. Format as JSON: { Mon: { Morning: "...", Afternoon: "...", Evening: "..." }, Tue: {...}, ... } for all 7 days. Keep each slot to one short action sentence with an emoji.` }],
          aqiData: aqi, userProfile: profile,
        }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n").filter(Boolean)) {
          if (line.startsWith("0:")) full += JSON.parse(line.slice(2));
        }
      }
      const jsonMatch = full.match(/\{[\s\S]*\}/);
      if (jsonMatch) { setPlan(JSON.parse(jsonMatch[0])); setAiGenerated(true); }
    } catch { } finally { setLoading(false); }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-600" />
          <div>
            <h2 className="font-semibold text-gray-800">Weekly Low-Emission Planner</h2>
            <p className="text-xs text-gray-400">Week of {format(weekStart, "MMM d, yyyy")}</p>
          </div>
        </div>
        <button onClick={generatePlan} disabled={loading}
          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium px-3 py-2 rounded-xl transition">
          <Sparkles className="w-3.5 h-3.5" />
          {loading ? "Generating…" : aiGenerated ? "Regenerate" : "AI Generate"}
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 font-semibold text-gray-500 w-24">Time</th>
              {DAYS.map((d, i) => (
                <th key={d} className="p-3 font-semibold text-gray-700 text-center">
                  <div>{d}</div>
                  <div className="text-gray-400 font-normal">{format(addDays(weekStart, i), "d")}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {TIME_SLOTS.map((slot) => (
              <tr key={slot} className="hover:bg-gray-50 transition">
                <td className="p-3 font-medium text-gray-500">
                  {slot === "Morning" ? "🌅" : slot === "Afternoon" ? "☀️" : "🌙"} {slot}
                </td>
                {DAYS.map((day) => (
                  <td key={day} className="p-3 text-center text-gray-600 border-l border-gray-50">
                    <div className="min-h-[40px] flex items-center justify-center">
                      {plan[day]?.[slot] ?? "—"}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {aiGenerated && (
        <div className="p-3 border-t border-gray-100 text-xs text-center text-gray-400">
          ✨ AI-generated plan based on your profile and current AQI ({aqi?.city})
        </div>
      )}
    </div>
  );
}
