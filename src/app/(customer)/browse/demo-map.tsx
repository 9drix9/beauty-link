"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPinData {
  id: string;
  price: string;
  lat: number;
  lng: number;
  tooltip: {
    service: string;
    time: string;
    location: string;
    original: string;
    discounted: string;
  };
}

const MAP_PINS: MapPinData[] = [
  {
    id: "pin-1",
    price: "$79",
    lat: 34.0625,
    lng: -118.4437,
    tooltip: {
      service: "Hybrid Lash Set",
      time: "Today \u2022 4:30 PM",
      location: "Westwood",
      original: "$125",
      discounted: "$79",
    },
  },
  {
    id: "pin-2",
    price: "$145",
    lat: 34.0195,
    lng: -118.4912,
    tooltip: {
      service: "Balayage + Blowout",
      time: "Tomorrow \u2022 11:00 AM",
      location: "Santa Monica",
      original: "$220",
      discounted: "$145",
    },
  },
  {
    id: "pin-3",
    price: "$45",
    lat: 34.0736,
    lng: -118.4004,
    tooltip: {
      service: "Gel Manicure + Pedicure",
      time: "Today \u2022 2:00 PM",
      location: "Beverly Hills",
      original: "$85",
      discounted: "$45",
    },
  },
  {
    id: "pin-4",
    price: "$110",
    lat: 34.0515,
    lng: -118.4726,
    tooltip: {
      service: "Full Glam Makeup",
      time: "Sat, Mar 15 \u2022 9:00 AM",
      location: "Brentwood",
      original: "$180",
      discounted: "$110",
    },
  },
  {
    id: "pin-5",
    price: "$95",
    lat: 34.0585,
    lng: -118.4500,
    tooltip: {
      service: "Microblading Touch-Up",
      time: "Today \u2022 6:00 PM",
      location: "Westwood",
      original: "$150",
      discounted: "$95",
    },
  },
  {
    id: "pin-6",
    price: "$129",
    lat: 34.0259,
    lng: -118.5010,
    tooltip: {
      service: "Hydrafacial Glow",
      time: "Tomorrow \u2022 3:00 PM",
      location: "Santa Monica",
      original: "$199",
      discounted: "$129",
    },
  },
];

function createPriceIcon(price: string, isActive: boolean) {
  return L.divIcon({
    className: "",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `
      <div style="
        transform: translate(-50%, -100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        filter: drop-shadow(0 2px 6px rgba(0,0,0,0.15));
      ">
        <div style="
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          font-family: Inter, -apple-system, sans-serif;
          white-space: nowrap;
          transition: all 0.15s ease;
          background: ${isActive ? "#3A1F10" : "#ffffff"};
          color: ${isActive ? "#ffffff" : "#3A1F10"};
          border: 1.5px solid ${isActive ? "#3A1F10" : "#E6D8CF"};
          ${isActive ? "transform: scale(1.1);" : ""}
        ">${price}</div>
        <div style="
          width: 0; height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid ${isActive ? "#3A1F10" : "#ffffff"};
          margin-top: -1px;
        "></div>
      </div>
    `,
  });
}

export function DemoMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [activePin, setActivePin] = useState<string | null>(null);
  const activePinRef = useRef<string | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Center on West LA
    const map = L.map(mapRef.current, {
      center: [34.048, -118.46],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    // Warm-toned map tiles (CartoDB Voyager — clean, modern, slightly warm)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        subdomains: "abcd",
      }
    ).addTo(map);

    // Zoom control — bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Attribution — collapsed
    L.control
      .attribution({ position: "bottomleft", prefix: false })
      .addAttribution(
        '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://osm.org/copyright">OSM</a>'
      )
      .addTo(map);

    mapInstanceRef.current = map;

    // Add markers
    MAP_PINS.forEach((pin) => {
      const marker = L.marker([pin.lat, pin.lng], {
        icon: createPriceIcon(pin.price, false),
      }).addTo(map);

      // Tooltip
      marker.bindPopup(
        `<div style="font-family: Inter, -apple-system, sans-serif; min-width: 180px;">
          <p style="font-weight: 600; font-size: 14px; color: #3A1F10; margin: 0 0 4px;">${pin.tooltip.service}</p>
          <p style="font-size: 12px; color: #9a7b6a; margin: 0;">${pin.tooltip.time}</p>
          <p style="font-size: 12px; color: #9a7b6a; margin: 0 0 8px;">${pin.tooltip.location}</p>
          <div style="display: flex; align-items: baseline; gap: 6px;">
            <span style="font-size: 12px; color: #9a7b6a; text-decoration: line-through;">${pin.tooltip.original}</span>
            <span style="font-size: 15px; font-weight: 700; color: #3A1F10;">${pin.tooltip.discounted}</span>
          </div>
        </div>`,
        {
          closeButton: false,
          className: "demo-map-popup",
          offset: [0, -8],
        }
      );

      marker.on("mouseover", () => {
        marker.setIcon(createPriceIcon(pin.price, true));
        marker.openPopup();
        activePinRef.current = pin.id;
        setActivePin(pin.id);
      });

      marker.on("mouseout", () => {
        marker.setIcon(createPriceIcon(pin.price, false));
        marker.closePopup();
        activePinRef.current = null;
        setActivePin(null);
      });

      marker.on("click", () => {
        marker.openPopup();
      });

      markersRef.current.push(marker);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[700px] rounded-2xl overflow-hidden border border-border">
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Map label */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-dark font-semibold border border-border/50 shadow-sm z-[1000] pointer-events-none">
        <span className="flex items-center gap-1.5">
          <svg
            className="h-3.5 w-3.5 text-[#D06A4E]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          West Los Angeles
        </span>
      </div>

      {/* Custom popup styles */}
      <style jsx global>{`
        .demo-map-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid #E6D8CF;
        }
        .demo-map-popup .leaflet-popup-content {
          margin: 14px 16px;
        }
        .demo-map-popup .leaflet-popup-tip {
          box-shadow: none;
          border: 1px solid #E6D8CF;
        }
      `}</style>
    </div>
  );
}
