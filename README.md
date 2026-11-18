# 🌿 AirWise — GenAI Air Quality & Low-Emission Lifestyle Assistant

> **A GenAI-powered assistant that helps families and communities navigate severe winter smog and urban air pollution with personalized routines, indoor air quality hacks, and an interactive 3D Real-Time AQI Globe.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![Three.js](https://img.shields.io/badge/Three.js-3D_WebGL-000000?logo=three.js)](https://threejs.org)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0_Flash-4285F4?logo=google)](https://ai.google.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🌍 **3D Real-Time AQI Globe** | Interactive WebGL globe powered by Three.js displaying live global smog beacons, atmospheric Fresnel rim glow, orbital particle rings, and glassmorphic city HUDs. |
| 🗺️ **Location-Aware AQI Dashboard** | Real-time air quality index with detailed breakdown of PM2.5, PM10, NO₂, O₃, CO, weather conditions, and animated risk indicators. |
| 🤖 **Gemini AI Health Advisor** | Streaming conversational AI powered by Google Gemini, equipped with live AQI context, weather conditions, and your household health profile. |
| 📋 **Personalized Action Cards** | AI-generated daily routines and indoor air quality hacks ranked by direct health impact score and estimated CO₂ savings. |
| 📅 **7-Day Low-Emission Planner** | AI-crafted weekly routine calendar with time slots (Morning, Afternoon, Evening) optimized to avoid peak smog inversion windows. |
| 🏆 **Gamified Habit Tracker** | Log sustainable habits, track streaks, and earn points (e.g. HEPA filtration, induction cooking, transit swaps, N95 protection). |
| 👨‍👩‍👧 **Multi-Member Family Profiles** | Tailored safety rules for vulnerable demographics including infants, elderly relatives, asthma, and pregnancy. |

---

## 🏗️ Architecture & Tech Stack

```
AirWise
 ├── Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
 ├── 3D Graphics: Three.js (WebGL, Atmospheric Fresnel Shader, Orbital Particle Systems)
 ├── GenAI Engine: Google Gemini 2.0 Flash / 1.5 Flash via @google/generative-ai
 ├── Data Sources: OpenWeatherMap Air Pollution API (with intelligent real-time fallback)
 ├── State Management: Zustand (persisted local storage)
 └── Data Viz: Recharts (Radial AQI gauge)
```

---

## 🚀 Quick Start Guide

### 1. Clone Repository
```bash
git clone https://github.com/Jatin8630s/AirWise.git
cd AirWise
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Google Gemini API Key (Free): https://aistudio.google.com/app/apikey
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# OpenWeatherMap API Key (Free): https://openweathermap.org/api/air-pollution
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key_here
```
*(Note: AirWise includes smart fallback data, so the app, 3D Globe, and AI chat will run seamlessly even before keys are added!)*

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
airwise/
├── app/
│   ├── api/
│   │   ├── aqi/route.ts          # Real-time AQI + reverse geocoding
│   │   ├── chat/route.ts         # Gemini streaming AI chat advisor
│   │   └── recommend/route.ts    # Impact-ranked recommendation generator
│   ├── layout.tsx                # App layout & styling
│   ├── page.tsx                  # Main application controller
│   └── globals.css               # Design system & AQI color themes
├── components/
│   ├── AQIGlobe.tsx              # 3D WebGL Planetary Smog Globe (Three.js)
│   ├── AQIDashboard.tsx          # Real-time AQI hero card with radial gauge
│   ├── ChatInterface.tsx         # Streaming AI chat with quick action chips
│   ├── RecommendationCards.tsx   # Action cards with impact metrics
│   ├── WeeklyPlanner.tsx         # 7-day routine calendar
│   ├── HabitTracker.tsx          # Habit streaks & gamification
│   ├── ProfileSetup.tsx          # 5-step onboarding wizard
│   └── NavBar.tsx                # Responsive navigation with 3D Globe tab
├── lib/
│   ├── store.ts                  # Zustand global state
│   └── aqi.ts                    # AQI calculation & pollutant thresholds
└── public/                       # Static assets & icons
```

---

## 🌐 Deploy to Vercel

```bash
npx vercel --prod
```

Configure `GOOGLE_GENERATIVE_AI_API_KEY` and `OPENWEATHERMAP_API_KEY` in your Vercel Project Settings under Environment Variables.

---

## 📄 License

MIT License. Built for the community to combat winter smog and promote sustainable urban living.
