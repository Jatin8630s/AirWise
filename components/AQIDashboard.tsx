"use client";

import { motion } from "framer-motion";
import { Wind, Droplets, Thermometer, Eye, Navigation, RefreshCw, Globe2 } from "lucide-react";
import { useAirStore } from "@/lib/store";
import { getAQILevel, getPollutantInfo } from "@/lib/aqi";
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";
import { fetchAQI } from "@/lib/aqi";

export default function AQIDashboard() {
  const { aqi, setAqi, setActiveTab } = useAirStore();
  const [refreshing, setRefreshing] = useState(false);

  if (!aqi) return null;

  const level = getAQILevel(aqi.aqi);
  const aqiPercent = Math.min((aqi.aqi / 500) * 100, 100);

  const pollutants = ["pm25", "pm10", "no2", "o3", "co"];

  const refresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchAQI(aqi.lat, aqi.lon);
      setAqi(data);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden shadow-lg"
    >
      {/* Hero AQI Banner */}
      <div
        className="p-6 text-white relative"
        style={{ background: `linear-gradient(135deg, ${level.color}22, ${level.color}44)`, borderTop: `4px solid ${level.color}` }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <span>📍</span>
              <span className="font-medium">{aqi.city}{aqi.state ? `, ${aqi.state}` : ""}, {aqi.country}</span>
              <button onClick={refresh} disabled={refreshing} className="ml-2 p-1 hover:bg-black/10 rounded-full transition">
                <RefreshCw className={`w-3 h-3 text-gray-500 ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-7xl font-black" style={{ color: level.color }}>{aqi.aqi}</span>
              <div>
                <div className="text-2xl">{level.emoji}</div>
                <div className="text-sm font-semibold text-gray-700">{level.label}</div>
                <div className="text-xs text-gray-500">US AQI</div>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 max-w-md">{level.advice}</p>
          </div>

          {/* Radial gauge */}
          <div className="w-32 h-32 hidden sm:block">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" data={[{ value: aqiPercent, fill: level.color }]} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weather strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-black/5">
          <div className="flex gap-4 text-xs text-gray-600">
            {aqi.temp !== undefined && <span className="flex items-center gap-1"><Thermometer className="w-3 h-3 text-gray-500" />{aqi.temp}°C</span>}
            {aqi.humidity !== undefined && <span className="flex items-center gap-1"><Droplets className="w-3 h-3 text-gray-500" />{aqi.humidity}%</span>}
            {aqi.windSpeed !== undefined && <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-gray-500" />{aqi.windSpeed} m/s</span>}
            {aqi.weather && <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-gray-500" />{aqi.weather}</span>}
          </div>

          <button
            onClick={() => setActiveTab("globe")}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs px-3.5 py-1.5 rounded-full transition shadow-md shadow-cyan-900/20"
          >
            <Globe2 className="w-3.5 h-3.5 animate-pulse" />
            <span>Explore 3D Smog Globe</span>
          </button>
        </div>
      </div>

      {/* Pollutant grid */}
      <div className="bg-white dark:bg-gray-900 grid grid-cols-2 sm:grid-cols-5 divide-x divide-y divide-gray-100">
        {pollutants.map((key) => {
          const info = getPollutantInfo(key);
          const value = (aqi as any)[key] ?? 0;
          const pct = Math.min((value / info.limit) * 100, 100);
          const over = value > info.limit;
          return (
            <div key={key} className="p-3 text-center">
              <div className="text-xs text-gray-400 font-medium">{info.name}</div>
              <div className={`text-lg font-bold mt-1 ${over ? "text-red-500" : "text-gray-800"}`}>
                {value}
              </div>
              <div className="text-xs text-gray-400">{info.unit}</div>
              <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: over ? "#ef4444" : "#22c55e" }}
                />
              </div>
              <div className="text-xs text-gray-300 mt-0.5">WHO: {info.limit}</div>
            </div>
          );
        })}
      </div>

      {/* Updated timestamp */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-2 text-xs text-gray-400 text-right">
        Updated: {new Date(aqi.timestamp).toLocaleTimeString()}
      </div>
    </motion.div>
  );
}
