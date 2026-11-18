import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "AirWise — Your AI Air Quality Assistant",
  description:
    "GenAI-powered assistant for low-emission daily routines, indoor air quality hacks, and sustainable alternatives tailored to your location and lifestyle.",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico" },
  keywords: ["air quality", "AQI", "pollution", "health", "AI", "smog"],
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { borderRadius: "12px", background: "#1f2937", color: "#fff" },
          }}
        />
      </body>
    </html>
  );
}
