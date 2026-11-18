import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages, aqiData, userProfile } = await req.json();

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const isKeyValid = apiKey && apiKey.trim() !== "" && !apiKey.includes("your_gemini_api_key");

    const lastMessage = messages[messages.length - 1]?.content || "";

    // If no valid Gemini API key is configured, provide instant intelligent rule-based responses
    if (!isKeyValid) {
      return streamLocalResponse(lastMessage, aqiData, userProfile);
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Try gemini-1.5-flash which is widely supported and reliable
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: buildSystemPrompt(aqiData, userProfile),
      });

      // Gemini history MUST start with role 'user' and alternate between user and model
      const rawHistory = messages.slice(0, -1);
      const firstUserIndex = rawHistory.findIndex((m: any) => m.role === "user");

      const validHistory = firstUserIndex !== -1
        ? rawHistory.slice(firstUserIndex).map((m: any) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content || "" }],
          }))
        : [];

      const chat = model.startChat({ history: validHistory });
      const result = await chat.sendMessageStream(lastMessage);

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) {
                controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
              }
            }
          } catch (streamErr) {
            console.error("Stream chunk error:", streamErr);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Vercel-AI-Data-Stream": "v1",
        },
      });
    } catch (apiError: any) {
      console.warn("Gemini API call failed, falling back to local advisor:", apiError?.message);
      return streamLocalResponse(lastMessage, aqiData, userProfile, true);
    }
  } catch (error: any) {
    console.error("Error in chat route:", error);
    return new Response(JSON.stringify({ error: error.message || "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function streamLocalResponse(query: string, aqi: any, profile: any, hadApiError = false) {
  const currentAQI = aqi?.aqi || 285;
  const city = aqi?.city || "your area";
  const q = query.toLowerCase();

  let reply = "";

  if (q.includes("run") || q.includes("jog") || q.includes("exercise") || q.includes("outdoor") || q.includes("walk")) {
    if (currentAQI > 200) {
      reply = `🚫 **Outdoor Running is NOT Recommended Right Now** (AQI: ${currentAQI} in ${city})\n\n` +
        `• **High Exposure Risk:** Heavy aerobic workouts cause rapid, deep breathing that deposits toxic PM2.5 and PM10 particles deep into your lungs and bloodstream.\n\n` +
        `• **Immediate Action:** Shift your workout indoors today. Use a treadmill, jump rope, yoga, or calisthenics in a closed room with a running air purifier.\n\n` +
        `• **Best Window if Necessary:** If you must walk outside, go between 12 PM and 3 PM when solar heating breaks the morning smog inversion layer, and always wear a snugly-fitted **N95 mask**.\n\n` +
        `💡 *Impact:* Shifting intense cardio indoors cuts your daily particulate inhalation by over 80%!`;
    } else if (currentAQI > 100) {
      reply = `⚠️ **Proceed with Caution** (AQI: ${currentAQI})\n\n` +
        `• Keep outdoor runs under 30 minutes, preferably midday.\n` +
        `• Sensitive groups (${profile?.conditions?.join(", ") || "children/asthma"}) should stick to indoor activities.`;
    } else {
      reply = `✅ **Safe for Outdoor Running!** (AQI: ${currentAQI})\n\nAir quality is currently in a safe range. Enjoy your run!`;
    }
  } else if (q.includes("asthma") || q.includes("cough") || q.includes("child") || q.includes("kid") || q.includes("elderly") || q.includes("health")) {
    reply = `🛡️ **Health & Vulnerability Precautions for ${city}** (AQI: ${currentAQI})\n\n` +
      `1. **Keep Inhalers/Meds Readily Available:** Winter smog contains sulfur and nitrogen dioxides that trigger rapid bronchial irritation.\n\n` +
      `2. **Create a Clean Air Sanctuary:** Keep bedroom doors closed with an air purifier running continuously on auto/medium.\n\n` +
      `3. **Avoid Early Morning Exposure:** Ground-level smog concentration is highest between 6 AM and 9 AM due to thermal inversion. Avoid outdoor playtime or morning walks during these hours.\n\n` +
      `4. **Hydration & Steam Inhalation:** Evening steam inhalation and warm saline gargles help clear trapped particulate residue from mucosal linings.`;
  } else if (q.includes("plant") || q.includes("purif") || q.includes("indoor") || q.includes("hack")) {
    reply = `🌿 **Top Indoor Air Quality Hacks for Smog Season**\n\n` +
      `• **HEPA Purifier Setup:** Run your air purifier in the most frequently occupied room with windows and doors shut tight.\n\n` +
      `• **Air-Purifying Plants:** Snake Plants (*Sansevieria*), Spider Plants, and Areca Palms help filter airborne toxins and boost oxygen.\n\n` +
      `• **Ventilation Timing:** Never open windows in the early morning or late evening. Ventilate briefly (15-20 mins) only between 1 PM and 3 PM when sunlight disperses smog.\n\n` +
      `• **Eliminate Indoor Sources:** Avoid burning incense (agarbatti), scented candles, or mosquito coils indoors, and always turn on the kitchen exhaust when frying.`;
  } else if (q.includes("commute") || q.includes("travel") || q.includes("car") || q.includes("transit") || q.includes("bus")) {
    reply = `🚗 **Low-Emission Commute & Travel Strategy**\n\n` +
      `• **Car Recirculation Mode:** Always switch your car AC to 'Recirculate' to avoid pulling high-pollution exhaust from surrounding traffic into the cabin.\n\n` +
      `• **Transit Swaps:** Using metro or shared transit cuts personal emissions by ~70% and reduces road congestion during peak smog hours.\n\n` +
      `• **Commute Protection:** Always wear an N95 mask while waiting at bus stops, train platforms, or in auto-rickshaws.`;
  } else {
    reply = `🌿 **AirWise Guidance for ${profile?.name || "you"} in ${city}** (AQI: ${currentAQI})\n\n` +
      `• **Daily Routine:** Limit strenuous outdoor activities during morning and evening smog peaks.\n\n` +
      `• **Indoor Air:** Keep doors and windows closed, and use an air purifier or air-filtering plants.\n\n` +
      `• **Sustainable Swaps:** Use public transit, avoid idling your engine, and opt for electric or induction cooking.\n\n` +
      `Feel free to ask me about running safety, child protection, indoor purifier hacks, or low-emission habits!`;
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const words = reply.split(" ");
      for (let i = 0; i < words.length; i++) {
        const text = (i === 0 ? "" : " ") + words[i];
        controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
        await new Promise((r) => setTimeout(r, 12));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Vercel-AI-Data-Stream": "v1",
    },
  });
}

function buildSystemPrompt(aqi: any, profile: any): string {
  const aqiCategory = getAQICategory(aqi?.aqi ?? 200);
  return `You are AirWise, an expert environmental health advisor helping families navigate severe winter smog and urban air pollution.
Current AQI: ${aqi?.aqi || 280} (${aqiCategory}) in ${aqi?.city || "Urban area"}.
Household: ${profile?.adults || 2} adults, ${profile?.children || 0} children, conditions: ${profile?.conditions?.join(", ") || "none"}.
Be supportive, practical, concise, and scientifically grounded. Give actionable advice with emojis and impact metrics.`;
}

function getAQICategory(aqi: number): string {
  if (aqi <= 50) return "Good 🟢";
  if (aqi <= 100) return "Moderate 🟡";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups 🟠";
  if (aqi <= 200) return "Unhealthy 🔴";
  if (aqi <= 300) return "Very Unhealthy 🟣";
  return "Hazardous ⚫";
}
