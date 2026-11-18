"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, ShieldAlert, Sparkles, Navigation, Layers, RotateCw, Wind, Flame, Eye, Thermometer, Droplets } from "lucide-react";
import { useAirStore, AQIData } from "@/lib/store";
import clsx from "clsx";

export interface GlobalCityAQI {
  name: string;
  country: string;
  lat: number;
  lon: number;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  temp: number;
  condition: string;
  status: "Good" | "Moderate" | "Sensitive" | "Unhealthy" | "Very Unhealthy" | "Hazardous";
  color: string;
  impact: string;
}

export const GLOBAL_CITIES: GlobalCityAQI[] = [
  {
    name: "Delhi NCR",
    country: "India 🇮🇳",
    lat: 28.6139,
    lon: 77.209,
    aqi: 285,
    pm25: 184.2,
    pm10: 295.6,
    no2: 48.3,
    temp: 19,
    condition: "Severe Smog",
    status: "Very Unhealthy",
    color: "#8f3f97",
    impact: "Dangerous exposure. Indoor HEPA filtration mandatory.",
  },
  {
    name: "Lahore",
    country: "Pakistan 🇵🇰",
    lat: 31.5204,
    lon: 74.3587,
    aqi: 340,
    pm25: 230.5,
    pm10: 380.1,
    no2: 56.2,
    temp: 18,
    condition: "Dense Toxic Smog",
    status: "Hazardous",
    color: "#7e0023",
    impact: "Emergency health warning. Avoid all outdoor exertion.",
  },
  {
    name: "Beijing",
    country: "China 🇨🇳",
    lat: 39.9042,
    lon: 116.4074,
    aqi: 168,
    pm25: 88.4,
    pm10: 142.0,
    no2: 36.1,
    temp: 7,
    condition: "Haze / Industrial Dust",
    status: "Unhealthy",
    color: "#ff0000",
    impact: "High particulate level. Wear N95 outdoors.",
  },
  {
    name: "Cairo",
    country: "Egypt 🇪🇬",
    lat: 30.0444,
    lon: 31.2357,
    aqi: 175,
    pm25: 94.0,
    pm10: 165.2,
    no2: 41.0,
    temp: 23,
    condition: "Desert Dust & Smog",
    status: "Unhealthy",
    color: "#ff0000",
    impact: "Respiratory distress risk for children & seniors.",
  },
  {
    name: "Dubai",
    country: "UAE 🇦🇪",
    lat: 25.2048,
    lon: 55.2708,
    aqi: 135,
    pm25: 49.3,
    pm10: 112.5,
    no2: 28.4,
    temp: 29,
    condition: "Dust Haze",
    status: "Sensitive",
    color: "#ff7e00",
    impact: "Sensitive groups should limit outdoor workouts.",
  },
  {
    name: "Jakarta",
    country: "Indonesia 🇮🇩",
    lat: -6.2088,
    lon: 106.8456,
    aqi: 158,
    pm25: 72.5,
    pm10: 120.3,
    no2: 33.0,
    temp: 31,
    condition: "Vehicular Smog",
    status: "Unhealthy",
    color: "#ff0000",
    impact: "Stagnant humid air trapping motorcycle exhaust.",
  },
  {
    name: "Bangkok",
    country: "Thailand 🇹🇭",
    lat: 13.7563,
    lon: 100.5018,
    aqi: 152,
    pm25: 65.4,
    pm10: 104.2,
    no2: 31.8,
    temp: 32,
    condition: "Agricultural Smoke",
    status: "Unhealthy",
    color: "#ff0000",
    impact: "Seasonal haze from biomass burning.",
  },
  {
    name: "New York",
    country: "USA 🇺🇸",
    lat: 40.7128,
    lon: -74.006,
    aqi: 42,
    pm25: 9.8,
    pm10: 18.2,
    no2: 14.5,
    temp: 11,
    condition: "Clear Sky",
    status: "Good",
    color: "#00e400",
    impact: "Clean ocean breezes. Excellent for outdoor exercise.",
  },
  {
    name: "Los Angeles",
    country: "USA 🇺🇸",
    lat: 34.0522,
    lon: -118.2437,
    aqi: 82,
    pm25: 26.5,
    pm10: 45.0,
    no2: 24.0,
    temp: 21,
    condition: "Sunny / Basin Haze",
    status: "Moderate",
    color: "#ffff00",
    impact: "Valley inversion causes afternoon smog accumulation.",
  },
  {
    name: "London",
    country: "UK 🇬🇧",
    lat: 51.5074,
    lon: -0.1278,
    aqi: 38,
    pm25: 8.5,
    pm10: 15.0,
    no2: 18.2,
    temp: 9,
    condition: "Light Rain",
    status: "Good",
    color: "#00e400",
    impact: "Precipitation washing particulates from air.",
  },
  {
    name: "Paris",
    country: "France 🇫🇷",
    lat: 48.8566,
    lon: 2.3522,
    aqi: 45,
    pm25: 10.4,
    pm10: 19.1,
    no2: 19.5,
    temp: 10,
    condition: "Overcast",
    status: "Good",
    color: "#00e400",
    impact: "Low emission traffic zone maintaining clean air.",
  },
  {
    name: "Tokyo",
    country: "Japan 🇯🇵",
    lat: 35.6762,
    lon: 139.6503,
    aqi: 28,
    pm25: 6.2,
    pm10: 12.0,
    no2: 11.2,
    temp: 14,
    condition: "Crisp & Clear",
    status: "Good",
    color: "#00e400",
    impact: "Pristine air quality. Full outdoor activity recommended.",
  },
  {
    name: "São Paulo",
    country: "Brazil 🇧🇷",
    lat: -23.5505,
    lon: -46.6333,
    aqi: 68,
    pm25: 19.8,
    pm10: 36.5,
    no2: 22.0,
    temp: 24,
    condition: "Partly Cloudy",
    status: "Moderate",
    color: "#ffff00",
    impact: "Urban traffic density causing moderate morning peak.",
  },
  {
    name: "Sydney",
    country: "Australia 🇦🇺",
    lat: -33.8688,
    lon: 151.2093,
    aqi: 22,
    pm25: 4.8,
    pm10: 9.5,
    no2: 7.2,
    temp: 22,
    condition: "Coastal Breeze",
    status: "Good",
    color: "#00e400",
    impact: "Clean Southern Ocean air. Ideal conditions.",
  },
];

// Convert Lat/Lon to 3D Sphere Position
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export default function AQIGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCity, setSelectedCity] = useState<GlobalCityAQI>(GLOBAL_CITIES[0]);
  const [filter, setFilter] = useState<"All" | "Hazardous" | "Unhealthy" | "Good">("All");
  const [autoRotate, setAutoRotate] = useState(true);
  const [showRings, setShowRings] = useState(true);
  const { setAqi, setActiveTab } = useAirStore();

  const globeRef = useRef<THREE.Group | null>(null);
  const ringsRef = useRef<THREE.Group | null>(null);
  const targetRotationRef = useRef({ x: 0.3, y: 0.5 });
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 580;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeRef.current = globeGroup;

    // 4. Base Dark Earth Sphere
    const sphereRadius = 70;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x050c1e,
      emissive: 0x020714,
      specular: 0x224488,
      shininess: 25,
      transparent: true,
      opacity: 0.95,
    });
    const earthMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(earthMesh);

    // 5. High-Tech Grid & Continental Dot Matrix
    const gridHelper = new THREE.WireframeGeometry(new THREE.SphereGeometry(sphereRadius + 0.3, 36, 18));
    const gridLine = new THREE.LineSegments(
      gridHelper,
      new THREE.LineBasicMaterial({ color: 0x1d3e75, transparent: true, opacity: 0.18 })
    );
    globeGroup.add(gridLine);

    // Dot matrix field across surface (representing cities and terrain)
    const dotCount = 1800;
    const dotPositions: number[] = [];
    const dotColors: number[] = [];
    for (let i = 0; i < dotCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = sphereRadius + 0.6;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      dotPositions.push(x, y, z);
      // Cyan to soft purple dots
      if (Math.random() > 0.4) {
        dotColors.push(0.1, 0.6, 0.9);
      } else {
        dotColors.push(0.5, 0.2, 0.7);
      }
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(dotPositions, 3));
    dotGeo.setAttribute("color", new THREE.Float32BufferAttribute(dotColors, 3));
    const dotMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const dotsMesh = new THREE.Points(dotGeo, dotMat);
    globeGroup.add(dotsMesh);

    // 6. Glowing Atmospheric Limb / Fresnel Halo
    const haloGeo = new THREE.SphereGeometry(sphereRadius * 1.22, 64, 64);
    const haloMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(0.1, 0.6, 1.0, 1.0) * intensity * 1.6;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(haloGeo, haloMat);
    scene.add(atmosphereMesh);

    // 7. Ambient Particle Starfield
    const starCount = 600;
    const starPositions: number[] = [];
    for (let i = 0; i < starCount; i++) {
      starPositions.push(
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 600
      );
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      size: 1.4,
      color: 0x88bbff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 8. Futuristic Orbital Particle Rings (matching image)
    const ringsGroup = new THREE.Group();
    scene.add(ringsGroup);
    ringsRef.current = ringsGroup;

    const createOrbitalRing = (radius: number, tiltX: number, tiltY: number, colorHex: number, count = 280) => {
      const ringPositions: number[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 4;
        ringPositions.push(x, y, z);
      }
      const ringGeo = new THREE.BufferGeometry();
      ringGeo.setAttribute("position", new THREE.Float32BufferAttribute(ringPositions, 3));
      const ringMat = new THREE.PointsMaterial({
        size: 1.3,
        color: colorHex,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Points(ringGeo, ringMat);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      return ring;
    };

    const ring1 = createOrbitalRing(96, 0.45, 0.35, 0x00d2ff, 320);
    const ring2 = createOrbitalRing(108, -0.6, 0.7, 0xbb44ff, 260);
    const ring3 = createOrbitalRing(118, 0.8, -0.4, 0x44ffaa, 200);
    ringsGroup.add(ring1, ring2, ring3);

    // 9. Add AQI City Hotspots & Light Beacons
    const cityMarkers: THREE.Mesh[] = [];
    GLOBAL_CITIES.forEach((city) => {
      const pos = latLonToVector3(city.lat, city.lon, sphereRadius + 0.8);
      const color = new THREE.Color(city.color);

      // Core pulsating marker sphere
      const markerGeo = new THREE.SphereGeometry(1.6, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      marker.userData = { city };
      globeGroup.add(marker);
      cityMarkers.push(marker);

      // Vertical holographic beacon cylinder
      const beamHeight = Math.min(city.aqi * 0.08, 28);
      const beamGeo = new THREE.CylinderGeometry(0.3, 0.8, beamHeight, 12);
      beamGeo.translate(0, beamHeight / 2, 0);
      const beamMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.copy(pos);
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      globeGroup.add(beam);

      // Outer ripple pulse disc
      const ringGeo = new THREE.RingGeometry(2.0, 3.2, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos.clone().multiplyScalar(1.01));
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      globeGroup.add(ringMesh);
    });

    // 10. Lighting
    const dirLight = new THREE.DirectionalLight(0xddeeff, 2.2);
    dirLight.position.set(120, 80, 150);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x4422aa, 1.8);
    backLight.position.set(-150, -50, -100);
    scene.add(backLight);

    const ambientLight = new THREE.AmbientLight(0x0a1428, 1.5);
    scene.add(ambientLight);

    // 11. Mouse & Touch Drag Controls
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetRotationRef.current.y += deltaX * 0.005;
      targetRotationRef.current.x += deltaY * 0.005;
      targetRotationRef.current.x = Math.max(-1.2, Math.min(1.2, targetRotationRef.current.x));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Zoom on wheel
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(140, Math.min(320, camera.position.z + e.deltaY * 0.15));
    };

    // Click on City Marker using Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cityMarkers);
      if (intersects.length > 0) {
        const clickedCity = intersects[0].object.userData.city as GlobalCityAQI;
        if (clickedCity) {
          setSelectedCity(clickedCity);
        }
      }
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("click", onClick);

    // 12. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (autoRotate && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.0025;
      }

      // Smooth damping interpolation
      if (globeRef.current) {
        globeRef.current.rotation.y += (targetRotationRef.current.y - globeRef.current.rotation.y) * 0.08;
        globeRef.current.rotation.x += (targetRotationRef.current.x - globeRef.current.rotation.x) * 0.08;
      }

      // Slowly rotate orbital particle rings
      if (ringsRef.current) {
        ringsRef.current.rotation.z = elapsedTime * 0.03;
        ringsRef.current.rotation.y = elapsedTime * 0.015;
      }

      // Pulse city markers & beacon scale
      const pulse = 1 + Math.sin(elapsedTime * 4.0) * 0.18;
      cityMarkers.forEach((m) => {
        m.scale.set(pulse, pulse, pulse);
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 580;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("click", onClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoRotate]);

  // Smoothly rotate globe towards selected city
  const rotateToCity = (city: GlobalCityAQI) => {
    setSelectedCity(city);
    const targetY = -((city.lon + 180) * (Math.PI / 180)) + Math.PI / 2;
    const targetX = (city.lat * (Math.PI / 180)) * 0.6;
    targetRotationRef.current = { x: targetX, y: targetY };
  };

  // Set the selected city as user's active location in store
  const activateCity = (city: GlobalCityAQI) => {
    const updatedData: AQIData = {
      aqi: city.aqi,
      pm25: city.pm25,
      pm10: city.pm10,
      no2: city.no2,
      o3: 32,
      co: 1100,
      so2: 15,
      city: city.name,
      country: city.country,
      state: "",
      lat: city.lat,
      lon: city.lon,
      temp: city.temp,
      humidity: 68,
      windSpeed: 2.1,
      weather: city.condition,
      timestamp: new Date().toISOString(),
    };
    setAqi(updatedData);
  };

  const filteredCities = GLOBAL_CITIES.filter((c) => {
    if (filter === "Hazardous") return c.aqi >= 200;
    if (filter === "Unhealthy") return c.aqi >= 150 && c.aqi < 200;
    if (filter === "Good") return c.aqi <= 50;
    return true;
  });

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#030712] border border-cyan-900/40 text-white min-h-[680px]">
      {/* Cosmic background glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 z-20 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div className="pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center backdrop-blur-md">
              <Globe2 className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent">
                AirWise 3D Global Smog Monitor
              </h2>
              <p className="text-xs text-cyan-200/60 font-mono">Real-time planetary particulate telemetry</p>
            </div>
          </div>
        </div>

        {/* Severity filter badges */}
        <div className="flex items-center gap-1.5 bg-gray-900/70 border border-white/10 rounded-full p-1 backdrop-blur-md pointer-events-auto">
          {(["All", "Hazardous", "Unhealthy", "Good"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={clsx(
                "px-3 py-1 rounded-full text-xs font-medium transition",
                filter === cat
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm"
                  : "text-gray-400 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="w-full h-[680px] cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Telemetry Card (Left Overlay) */}
      <div className="absolute top-28 left-6 z-20 w-80 pointer-events-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCity.name}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className="rounded-2xl bg-gray-950/80 border border-white/15 p-5 backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            {/* Top Accent glow line */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: selectedCity.color, boxShadow: `0 0 12px ${selectedCity.color}` }}
            />

            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Spotlight City</span>
                <h3 className="text-xl font-bold text-white flex items-center gap-1.5 mt-0.5">
                  {selectedCity.name}
                </h3>
                <span className="text-xs text-gray-400">{selectedCity.country}</span>
              </div>
              <div className="text-right">
                <div
                  className="text-3xl font-black font-mono"
                  style={{ color: selectedCity.color, textShadow: `0 0 16px ${selectedCity.color}55` }}
                >
                  {selectedCity.aqi}
                </div>
                <span
                  className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${selectedCity.color}25`, color: selectedCity.color }}
                >
                  {selectedCity.status}
                </span>
              </div>
            </div>

            {/* Pollutant Matrix */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
              <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                <div className="text-[10px] text-gray-400 uppercase">PM2.5</div>
                <div className="text-sm font-bold text-cyan-300">{selectedCity.pm25}</div>
                <div className="text-[9px] text-gray-500">µg/m³</div>
              </div>
              <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                <div className="text-[10px] text-gray-400 uppercase">PM10</div>
                <div className="text-sm font-bold text-indigo-300">{selectedCity.pm10}</div>
                <div className="text-[9px] text-gray-500">µg/m³</div>
              </div>
              <div className="bg-white/5 rounded-xl p-2 border border-white/5">
                <div className="text-[10px] text-gray-400 uppercase">Temp</div>
                <div className="text-sm font-bold text-emerald-300">{selectedCity.temp}°C</div>
                <div className="text-[9px] text-gray-500">{selectedCity.condition}</div>
              </div>
            </div>

            {/* Health Impact Note */}
            <div className="mt-3.5 bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-gray-300 leading-relaxed flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{selectedCity.impact}</span>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  activateCity(selectedCity);
                  setActiveTab("chat");
                }}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs py-2 px-3 rounded-xl transition shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Ask AI About {selectedCity.name.split(" ")[0]}
              </button>
              <button
                onClick={() => activateCity(selectedCity)}
                title="Set as Dashboard AQI"
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition border border-white/10"
              >
                <Navigation className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* City Quick Picker Bar (Bottom Overlay) */}
      <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-auto flex flex-wrap items-center justify-between gap-3 bg-gray-950/80 border border-white/10 rounded-2xl p-3 backdrop-blur-xl">
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-2xl scrollbar-none">
          <span className="text-xs text-gray-400 uppercase font-mono mr-1">Major Hubs:</span>
          {filteredCities.slice(0, 7).map((c) => (
            <button
              key={c.name}
              onClick={() => rotateToCity(c)}
              className={clsx(
                "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition",
                selectedCity.name === c.name
                  ? "bg-white/15 border-cyan-400 text-white shadow-md shadow-cyan-950"
                  : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
              )}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
              <span>{c.name}</span>
              <span className="font-mono text-[10px] text-gray-400">({c.aqi})</span>
            </button>
          ))}
        </div>

        {/* Rotation & Rings Controls */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition",
              autoRotate
                ? "bg-cyan-500/20 border-cyan-400/40 text-cyan-300"
                : "bg-white/5 border-white/10 text-gray-400"
            )}
          >
            <RotateCw className={clsx("w-3.5 h-3.5", autoRotate && "animate-spin")} />
            Auto-Rotate
          </button>
        </div>
      </div>
    </div>
  );
}
