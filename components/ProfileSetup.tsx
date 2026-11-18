"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, User, Users, Heart, MapPin, Bike, Flame, Utensils, Activity } from "lucide-react";
import { useAirStore, UserProfile } from "@/lib/store";
import clsx from "clsx";

const STEPS = [
  { id: "welcome", title: "Welcome to AirWise 🌿", subtitle: "Let's personalize your air quality experience" },
  { id: "household", title: "Your Household", subtitle: "Help us understand who we're protecting" },
  { id: "health", title: "Health Considerations", subtitle: "Any conditions we should know about?" },
  { id: "lifestyle", title: "Your Lifestyle", subtitle: "How you live shapes your pollution exposure" },
  { id: "done", title: "You're all set! 🎉", subtitle: "Your personalized plan is ready" },
];

const CONDITIONS = ["Asthma", "COPD", "Heart disease", "Diabetes", "Pregnancy", "Allergies", "None"];
const COMMUTE_TYPES = [
  { id: "car", label: "🚗 Car", icon: "🚗" },
  { id: "motorbike", label: "🏍️ Motorbike", icon: "🏍️" },
  { id: "public", label: "🚌 Public Transit", icon: "🚌" },
  { id: "bike", label: "🚲 Bicycle", icon: "🚲" },
  { id: "walk", label: "🚶 Walk", icon: "🚶" },
  { id: "wfh", label: "🏠 Work from Home", icon: "🏠" },
];
const HEATING_TYPES = ["Gas boiler", "Electric heater", "Wood burning", "District heating", "Heat pump", "None"];
const COOKING_TYPES = ["Gas stove", "Induction", "Electric coil", "Open fire / Chulha", "Microwave only"];
const ACTIVITY_LEVELS = ["Sedentary", "Light (walks)", "Moderate (runs/yoga)", "Active (daily gym)", "Athlete"];

export default function ProfileSetup() {
  const { setProfile } = useAirStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", adults: 2, children: 0, childAges: "", elderly: 0,
    conditions: [] as string[], commute: "car", commuteDist: 10,
    heating: "Gas boiler", cooking: "Gas stove", activity: "Moderate (runs/yoga)", city: "",
  });

  const update = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));
  const toggleCondition = (c: string) =>
    update("conditions", form.conditions.includes(c) ? form.conditions.filter((x) => x !== c) : [...form.conditions, c]);

  const finish = () => setProfile(form as UserProfile);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden"
      >
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
            animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        <div className="p-8">
          {/* Step header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{STEPS[step].title}</h1>
            <p className="text-gray-500 mt-1">{STEPS[step].subtitle}</p>
          </div>

          {/* Step content */}
          <AnimatedStep key={step}>
            {step === 0 && (
              <div className="text-center space-y-4">
                <div className="text-6xl">🌬️</div>
                <p className="text-gray-600 leading-relaxed">
                  AirWise uses real-time air quality data and <strong>Gemini AI</strong> to give you
                  personalized recommendations for staying healthy during winter smog season.
                </p>
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700">Your first name</label>
                  <input
                    type="text" placeholder="e.g. Priya"
                    value={form.name} onChange={(e) => update("name", e.target.value)}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <Counter label="👨‍👩‍👧‍👦 Adults" value={form.adults} onChange={(v) => update("adults", v)} min={1} max={10} />
                <Counter label="👶 Children" value={form.children} onChange={(v) => update("children", v)} min={0} max={10} />
                {form.children > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Children's ages (comma separated)</label>
                    <input type="text" placeholder="e.g. 3, 7, 12" value={form.childAges}
                      onChange={(e) => update("childAges", e.target.value)}
                      className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                  </div>
                )}
                <Counter label="👴 Elderly members (60+)" value={form.elderly} onChange={(v) => update("elderly", v)} min={0} max={10} />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-4">Select all that apply to anyone in your household</p>
                <div className="grid grid-cols-2 gap-2">
                  {CONDITIONS.map((c) => (
                    <button key={c}
                      onClick={() => toggleCondition(c)}
                      className={clsx("text-sm rounded-xl px-3 py-2.5 border text-left transition font-medium",
                        form.conditions.includes(c) ? "bg-red-50 border-red-300 text-red-700" : "border-gray-200 hover:border-gray-300 text-gray-600"
                      )}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Bike className="w-4 h-4" />Primary commute</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {COMMUTE_TYPES.map((c) => (
                      <button key={c.id} onClick={() => update("commute", c.id)}
                        className={clsx("rounded-xl p-3 text-center text-sm border transition",
                          form.commute === c.id ? "bg-green-50 border-green-400 text-green-700 font-medium" : "border-gray-200 hover:border-gray-300 text-gray-600"
                        )}>
                        <div className="text-xl mb-1">{c.icon}</div>
                        {c.label.split(" ").slice(1).join(" ")}
                      </button>
                    ))}
                  </div>
                </div>
                <Selector label={<><Flame className="w-4 h-4" /> Home heating</>} value={form.heating} options={HEATING_TYPES} onChange={(v) => update("heating", v)} />
                <Selector label={<><Utensils className="w-4 h-4" /> Cooking method</>} value={form.cooking} options={COOKING_TYPES} onChange={(v) => update("cooking", v)} />
                <Selector label={<><Activity className="w-4 h-4" /> Activity level</>} value={form.activity} options={ACTIVITY_LEVELS} onChange={(v) => update("activity", v)} />
              </div>
            )}

            {step === 4 && (
              <div className="text-center space-y-4">
                <div className="text-6xl">🎯</div>
                <p className="text-gray-600">
                  Your personalized air quality plan is ready, <strong>{form.name || "friend"}</strong>!
                  We'll track {form.adults + form.children + form.elderly} household members and tailor every recommendation to your lifestyle.
                </p>
                <div className="bg-green-50 rounded-xl p-4 text-sm text-green-700 text-left space-y-1">
                  <div>✓ Real-time AQI monitoring</div>
                  <div>✓ Gemini AI-powered recommendations</div>
                  <div>✓ Habit tracking & impact metrics</div>
                  <div>✓ Family health alerts</div>
                </div>
              </div>
            )}
          </AnimatedStep>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 transition">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={finish}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition">
                Start AirWise 🚀
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AnimatedStep({ children, key }: { children: React.ReactNode; key: number }) {
  return (
    <motion.div key={key} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      {children}
    </motion.div>
  );
}

function Counter({ label, value, onChange, min, max }: { label: React.ReactNode; value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">{label}</span>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(Math.max(min, value - 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition text-lg">−</button>
        <span className="w-6 text-center font-semibold">{value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition text-lg">+</button>
      </div>
    </div>
  );
}

function Selector({ label, value, options, onChange }: { label: React.ReactNode; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
