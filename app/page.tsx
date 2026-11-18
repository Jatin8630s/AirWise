"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wind, MapPin, RefreshCw, AlertTriangle } from "lucide-react";
import AQIDashboard from "@/components/AQIDashboard";
import AQIGlobe from "@/components/AQIGlobe";
import ChatInterface from "@/components/ChatInterface";
import RecommendationCards from "@/components/RecommendationCards";
import WeeklyPlanner from "@/components/WeeklyPlanner";
import HabitTracker from "@/components/HabitTracker";
import ProfileSetup from "@/components/ProfileSetup";
import NavBar from "@/components/NavBar";
import { useAirStore } from "@/lib/store";
import { fetchAQI } from "@/lib/aqi";
import toast from "react-hot-toast";

export default function Home() {
  const { profile, aqi, setAqi, activeTab } = useAirStore();
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const data = await fetchAQI(pos.coords.latitude, pos.coords.longitude);
            setAqi(data);
            setLoading(false);
          } catch {
            toast.error("Could not load air quality data.");
            setLoading(false);
          }
        },
        (err) => {
          setLocationError("Location access denied. Using default city (Delhi).");
          fetchAQI(28.6139, 77.209)
            .then((data) => { setAqi(data); setLoading(false); })
            .catch(() => setLoading(false));
        }
      );
    }
  }, [setAqi]);

  if (!profile) return <ProfileSetup />;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <NavBar />
      {locationError && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2 text-sm text-amber-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {locationError}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AQIDashboard />
            <div className="mt-6">
              {activeTab === "globe" && <AQIGlobe />}
              {activeTab === "chat" && <ChatInterface />}
              {activeTab === "recommendations" && <RecommendationCards />}
              {activeTab === "planner" && <WeeklyPlanner />}
              {activeTab === "habits" && <HabitTracker />}
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-48 bg-gray-200 rounded-2xl" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-xl" />
        ))}
      </div>
      <div className="h-96 bg-gray-200 rounded-2xl" />
    </div>
  );
}
