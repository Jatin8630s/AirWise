export async function fetchAQI(lat: number, lon: number) {
  const res = await fetch(`/api/aqi?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error("AQI fetch failed");
  return res.json();
}

export function getAQILevel(aqi: number): {
  label: string;
  color: string;
  bg: string;
  textColor: string;
  emoji: string;
  advice: string;
} {
  if (aqi <= 50)
    return { label: "Good", color: "#00e400", bg: "bg-green-100", textColor: "text-green-800", emoji: "😊", advice: "Air quality is satisfactory. Enjoy outdoor activities!" };
  if (aqi <= 100)
    return { label: "Moderate", color: "#ffff00", bg: "bg-yellow-100", textColor: "text-yellow-800", emoji: "😐", advice: "Acceptable, but sensitive individuals should limit prolonged outdoor exertion." };
  if (aqi <= 150)
    return { label: "Unhealthy for Sensitive Groups", color: "#ff7e00", bg: "bg-orange-100", textColor: "text-orange-800", emoji: "😷", advice: "Children, elderly, and those with respiratory issues should reduce outdoor time." };
  if (aqi <= 200)
    return { label: "Unhealthy", color: "#ff0000", bg: "bg-red-100", textColor: "text-red-800", emoji: "🚨", advice: "Everyone should reduce prolonged outdoor exertion." };
  if (aqi <= 300)
    return { label: "Very Unhealthy", color: "#8f3f97", bg: "bg-purple-100", textColor: "text-purple-800", emoji: "☠️", advice: "Avoid outdoor activities. Use N95 masks if going out." };
  return { label: "Hazardous", color: "#7e0023", bg: "bg-red-900", textColor: "text-red-100", emoji: "⚠️", advice: "Health emergency. Stay indoors with air purifier running." };
}

export function getPollutantInfo(key: string) {
  const info: Record<string, { name: string; unit: string; limit: number; source: string }> = {
    pm25: { name: "PM2.5", unit: "µg/m³", limit: 15, source: "Vehicle exhaust, industry, burning" },
    pm10: { name: "PM10", unit: "µg/m³", limit: 45, source: "Dust, pollen, construction" },
    no2: { name: "NO₂", unit: "µg/m³", limit: 25, source: "Vehicle emissions, power plants" },
    o3: { name: "O₃ (Ozone)", unit: "µg/m³", limit: 100, source: "Sunlight + NOx + VOCs" },
    co: { name: "CO", unit: "µg/m³", limit: 4000, source: "Incomplete combustion, vehicles" },
    so2: { name: "SO₂", unit: "µg/m³", limit: 40, source: "Coal burning, industrial processes" },
  };
  return info[key] ?? { name: key.toUpperCase(), unit: "µg/m³", limit: 100, source: "Various" };
}
