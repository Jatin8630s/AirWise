import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  name: string;
  adults: number;
  children: number;
  childAges: string;
  elderly: number;
  conditions: string[];
  commute: string;
  commuteDist: number;
  heating: string;
  cooking: string;
  activity: string;
  city: string;
}

export interface AQIData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  so2: number;
  city: string;
  country: string;
  state: string;
  lat: number;
  lon: number;
  temp?: number;
  humidity?: number;
  windSpeed?: number;
  weather?: string;
  timestamp: string;
}

export interface Recommendation {
  id: string;
  category: string;
  icon: string;
  title: string;
  description: string;
  impact: string;
  impactScore: number;
  co2Saved?: string;
  forVulnerable?: boolean;
  difficulty: "easy" | "medium" | "hard";
  completed?: boolean;
}

export interface HabitLog {
  date: string;
  habitId: string;
  completed: boolean;
}

type Tab = "recommendations" | "globe" | "chat" | "planner" | "habits";

interface AirStore {
  profile: UserProfile | null;
  aqi: AQIData | null;
  recommendations: Recommendation[];
  habitLogs: HabitLog[];
  activeTab: Tab;
  setProfile: (p: UserProfile) => void;
  setAqi: (a: AQIData) => void;
  setRecommendations: (r: Recommendation[]) => void;
  logHabit: (habitId: string, date: string) => void;
  setActiveTab: (t: Tab) => void;
  clearProfile: () => void;
}

export const useAirStore = create<AirStore>()(
  persist(
    (set) => ({
      profile: null,
      aqi: null,
      recommendations: [],
      habitLogs: [],
      activeTab: "recommendations",
      setProfile: (profile) => set({ profile }),
      setAqi: (aqi) => set({ aqi }),
      setRecommendations: (recommendations) => set({ recommendations }),
      logHabit: (habitId, date) =>
        set((state) => ({
          habitLogs: [
            ...state.habitLogs.filter(
              (l) => !(l.habitId === habitId && l.date === date)
            ),
            { habitId, date, completed: true },
          ],
        })),
      setActiveTab: (activeTab) => set({ activeTab }),
      clearProfile: () => set({ profile: null }),
    }),
    { name: "airwise-store" }
  )
);
