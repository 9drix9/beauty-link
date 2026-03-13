"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPinData {
  id: string;
  price: string;
  lat: number;
  lng: number;
  service: string;
  category: string;
  stylist: string;
  rating: number;
  time: string;
  location: string;
  original: string;
  discounted: string;
  savings: string;
  image: string;
}

const MAP_PINS: MapPinData[] = [
  {
    id: "pin-1",
    price: "$79",
    lat: 34.0625,
    lng: -118.4437,
    service: "Hybrid Lash Set",
    category: "Lashes",
    stylist: "Jessica Kim",
    rating: 4.9,
    time: "Today \u2022 4:30 PM",
    location: "Westwood",
    original: "$125",
    discounted: "$79",
    savings: "37%",
    image:
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=300&q=80&auto=format&fit=crop",
  },
  {
    id: "pin-2",
    price: "$145",
    lat: 34.0195,
    lng: -118.4912,
    service: "Balayage + Blowout",
    category: "Hair",
    stylist: "Sarah Mitchell",
    rating: 4.8,
    time: "Tomorrow \u2022 11:00 AM",
    location: "Santa Monica",
    original: "$220",
    discounted: "$145",
    savings: "34%",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&q=80&auto=format&fit=crop",
  },
  {
    id: "pin-3",
    price: "$45",
    lat: 34.0736,
    lng: -118.4004,
    service: "Gel Manicure + Pedicure",
    category: "Nails",
    stylist: "Maria Santos",
    rating: 5.0,
    time: "Today \u2022 2:00 PM",
    location: "Beverly Hills",
    original: "$85",
    discounted: "$45",
    savings: "47%",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&q=80&auto=format&fit=crop",
  },
  {
    id: "pin-4",
    price: "$110",
    lat: 34.0515,
    lng: -118.4726,
    service: "Full Glam Makeup",
    category: "Makeup",
    stylist: "Aaliyah James",
    rating: 4.9,
    time: "Sat, Mar 15 \u2022 9:00 AM",
    location: "Brentwood",
    original: "$180",
    discounted: "$110",
    savings: "39%",
    image:
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=300&q=80&auto=format&fit=crop",
  },
  {
    id: "pin-5",
    price: "$95",
    lat: 34.0585,
    lng: -118.45,
    service: "Microblading Touch Up",
    category: "Brows",
    stylist: "Priya Patel",
    rating: 4.7,
    time: "Today \u2022 6:00 PM",
    location: "Westwood",
    original: "$150",
    discounted: "$95",
    savings: "37%",
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=300&q=80&auto=format&fit=crop",
  },
  {
    id: "pin-6",
    price: "$129",
    lat: 34.0259,
    lng: -118.501,
    service: "Hydrafacial Glow",
    category: "Skincare",
    stylist: "Emily Chen",
    rating: 4.8,
    time: "Tomorrow \u2022 3:00 PM",
    location: "Santa Monica",
    original: "$199",
    discounted: "$129",
    savings: "35%",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&q=80&auto=format&fit=crop",
  },
];

function createPriceIcon(price: string, isActive: boolean) {
  return L.divIcon({
    className: "demo-price-pin",
    iconSize: [70, 40],
    iconAnchor: [35, 40],
    popupAnchor: [0, -34],
    html: `
      <div class="demo-pin-inner" style="
        width: 70px;
        height: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;
        filter: drop-shadow(0 2px 6px rgba(0,0,0,0.15));
      ">
        <div style="
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          font-family: Inter, -apple-system, sans-serif;
          white-space: nowrap;
          background: ${isActive ? "#3A1F10" : "#ffffff"};
          color: ${isActive ? "#ffffff" : "#3A1F10"};
          border: 1.5px solid ${isActive ? "#3A1F10" : "#E6D8CF"};
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

function createPopupContent(pin: MapPinData) {
  return `
    <div style="font-family: Inter, -apple-system, sans-serif; width: 240px; margin: 0; padding: 0;">
      <div style="position: relative; height: 130px; border-radius: 12px 12px 0 0; margin: -16px -16px 12px -16px;">
        <img
          src="${pin.image}"
          alt="${pin.service}"
          style="display: block; width: 100%; height: 100%; object-fit: cover;"
        />
        <div style="position: absolute; top: 8px; left: 8px; background: #4B2615; color: white; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 12px; line-height: 1.4; z-index: 2;">
          Save ${pin.savings}
        </div>
      </div>
      <div style="font-weight: 700; font-size: 14px; color: #3A1F10; margin: 0 0 6px; line-height: 1.3;">
        ${pin.service}
      </div>
      <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 6px;">
        <div style="width: 20px; height: 20px; border-radius: 50%; background: #F4DDE5; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #D06A4E; flex-shrink: 0;">
          ${pin.stylist.charAt(0)}
        </div>
        <span style="font-size: 12px; color: #3A1F10;">${pin.stylist}</span>
        <span style="font-size: 11px; color: #9a7b6a;">\u2605 ${pin.rating}</span>
      </div>
      <div style="font-size: 11px; color: #9a7b6a; margin-bottom: 2px;">
        ${pin.time}
      </div>
      <div style="font-size: 11px; color: #9a7b6a; margin-bottom: 10px;">
        \uD83D\uDCCD ${pin.location}
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid #E6D8CF;">
        <div style="display: flex; align-items: baseline; gap: 5px;">
          <span style="font-size: 12px; color: #9a7b6a; text-decoration: line-through;">${pin.original}</span>
          <span style="font-size: 17px; font-weight: 800; color: #3A1F10;">${pin.discounted}</span>
        </div>
        <a href="#waitlist-cta" style="background: #4B2615; color: white; font-size: 11px; font-weight: 600; padding: 5px 12px; border-radius: 20px; cursor: pointer; text-decoration: none; display: inline-block;">
          Join Waitlist
        </a>
      </div>
    </div>
  `;
}

interface DemoMapProps {
  activeCategory?: string;
}

export function DemoMap({ activeCategory }: DemoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ marker: L.Marker; pin: MapPinData }[]>([]);
  const clickedRef = useRef<string | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [34.048, -118.46],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    } as L.MapOptions);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        subdomains: "abcd",
      }
    ).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.control
      .attribution({ position: "bottomleft", prefix: false })
      .addAttribution(
        '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://osm.org/copyright">OSM</a>'
      )
      .addTo(map);

    mapInstanceRef.current = map;

    const openPin = (pin: MapPinData, marker: L.Marker) => {
      markersRef.current.forEach(({ marker: m, pin: p }) => {
        if (p.id !== pin.id) {
          m.setIcon(createPriceIcon(p.price, false));
        }
      });
      clickedRef.current = pin.id;
      marker.setIcon(createPriceIcon(pin.price, true));
      marker.openPopup();
    };

    MAP_PINS.forEach((pin) => {
      const marker = L.marker([pin.lat, pin.lng], {
        icon: createPriceIcon(pin.price, false),
        interactive: true,
        bubblingMouseEvents: false,
      }).addTo(map);

      marker.bindPopup(createPopupContent(pin), {
        closeButton: true,
        className: "demo-map-popup",
        offset: [0, 0],
        maxWidth: 272,
        minWidth: 220,
        autoPan: true,
        autoPanPaddingTopLeft: L.point(10, 10),
        autoPanPaddingBottomRight: L.point(10, 10),
      });

      marker.on("mouseover", () => {
        if (clickedRef.current !== pin.id) {
          marker.setIcon(createPriceIcon(pin.price, true));
        }
      });

      marker.on("mouseout", () => {
        if (clickedRef.current !== pin.id) {
          marker.setIcon(createPriceIcon(pin.price, false));
        }
      });

      marker.on("click", () => openPin(pin, marker));

      marker.on("popupclose", () => {
        if (clickedRef.current === pin.id) {
          clickedRef.current = null;
          marker.setIcon(createPriceIcon(pin.price, false));
        }
      });

      // Add direct touchend handler for mobile
      const el = marker.getElement();
      if (el) {
        el.addEventListener("touchend", (e) => {
          e.preventDefault();
          e.stopPropagation();
          openPin(pin, marker);
        }, { passive: false });
      }

      markersRef.current.push({ marker, pin });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
    };
  }, []);

  // Show/hide markers based on active category filter
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach(({ marker, pin }) => {
      const visible = !activeCategory || activeCategory === "All" || pin.category === activeCategory;
      if (visible && !map.hasLayer(marker)) {
        marker.addTo(map);
      } else if (!visible && map.hasLayer(marker)) {
        marker.closePopup();
        map.removeLayer(marker);
      }
    });

    clickedRef.current = null;
  }, [activeCategory]);

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

      {/* Pin + popup styles */}
      <style jsx global>{`
        .demo-price-pin {
          background: none !important;
          border: none !important;
          pointer-events: auto !important;
          touch-action: manipulation;
        }
        .demo-price-pin .demo-pin-inner {
          pointer-events: auto !important;
        }
        .demo-map-popup .leaflet-popup-content-wrapper {
          border-radius: 16px;
          padding: 0;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12),
            0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1px solid #e6d8cf;
          overflow: visible;
        }
        .demo-map-popup .leaflet-popup-content {
          margin: 16px;
          line-height: 1.4;
          overflow: visible;
        }
        .demo-map-popup .leaflet-popup-content p {
          margin: 0;
        }
        .demo-map-popup .leaflet-popup-tip-container {
          margin-top: -1px;
        }
        .demo-map-popup .leaflet-popup-tip {
          box-shadow: none;
          border: 1px solid #e6d8cf;
          border-top: none;
          border-left: none;
        }
        .demo-map-popup .leaflet-popup-close-button {
          top: 6px !important;
          right: 6px !important;
          width: 26px !important;
          height: 26px !important;
          font-size: 18px !important;
          line-height: 26px !important;
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(4px);
          border-radius: 50% !important;
          color: #3a1f10 !important;
          text-align: center;
          z-index: 10;
        }
        .demo-map-popup .leaflet-popup-close-button:hover {
          background: #ffffff !important;
        }
        @media (max-width: 640px) {
          .demo-map-popup {
            left: 50% !important;
            transform: translateX(-50%);
          }
          .demo-map-popup .leaflet-popup-content-wrapper {
            max-width: 90vw;
          }
        }
      `}</style>
    </div>
  );
}
