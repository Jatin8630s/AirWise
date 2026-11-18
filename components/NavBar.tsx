"use client";

import { Wind, MessageCircle, CalendarDays, Trophy, BarChart3, Globe2, Settings, LogOut } from "lucide-react";
import { useAirStore } from "@/lib/store";
import clsx from "clsx";

const TABS = [
  { id: "recommendations", label: "Actions", icon: BarChart3 },
  { id: "globe", label: "3D Globe", icon: Globe2 },
  { id: "chat", label: "AI Chat", icon: MessageCircle },
  { id: "planner", label: "Planner", icon: CalendarDays },
  { id: "habits", label: "Habits", icon: Trophy },
] as const;

export default function NavBar() {
  const { activeTab, setActiveTab, aqi, clearProfile } = useAirStore();

  return (
    <>
      {/* Top bar */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Wind className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">AirWise</span>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition",
                    activeTab === tab.id ? "bg-green-50 text-green-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}>
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <button onClick={clearProfile} title="Reset profile"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={clsx("flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition",
                activeTab === tab.id ? "text-green-600" : "text-gray-400"
              )}>
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
