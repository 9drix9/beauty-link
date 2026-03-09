"use client";

import { FloatingElement } from "./floating-element";
import { useEffect, useState } from "react";

export function Hero3DScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full" />;

  return (
    <div className="relative w-full h-full perspective-2000 preserve-3d">
      {/* Main morphing blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px]">
        <div className="w-full h-full bg-gradient-to-br from-brand-300/40 via-purple-300/30 to-violet-300/40 animate-morph blur-sm" />
      </div>

      {/* Orbiting ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] sm:w-[500px] sm:h-[500px]">
        <div
          className="w-full h-full rounded-full border border-brand-200/30 animate-spin-slow"
          style={{ transform: "rotateX(70deg)" }}
        />
      </div>

      {/* Second orbiting ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]">
        <div
          className="w-full h-full rounded-full border border-purple-200/20 animate-spin-slow"
          style={{
            transform: "rotateX(70deg) rotateZ(60deg)",
            animationDuration: "25s",
            animationDirection: "reverse",
          }}
        />
      </div>

      {/* Floating service icons */}
      <FloatingElement
        className="absolute top-[10%] right-[15%]"
        duration={7}
        delay={0}
        distance={25}
        rotation={8}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-premium-lg flex items-center justify-center backface-hidden">
          <span className="text-2xl sm:text-3xl">✂️</span>
        </div>
      </FloatingElement>

      <FloatingElement
        className="absolute top-[25%] left-[10%]"
        duration={8}
        delay={1}
        distance={18}
        rotation={6}
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-premium-lg flex items-center justify-center backface-hidden">
          <span className="text-xl sm:text-2xl">💅</span>
        </div>
      </FloatingElement>

      <FloatingElement
        className="absolute bottom-[20%] right-[10%]"
        duration={6}
        delay={2}
        distance={22}
        rotation={10}
      >
        <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-white shadow-premium-lg flex items-center justify-center backface-hidden">
          <span className="text-xl sm:text-2xl">💄</span>
        </div>
      </FloatingElement>

      <FloatingElement
        className="absolute bottom-[30%] left-[15%]"
        duration={9}
        delay={0.5}
        distance={15}
        rotation={4}
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-premium-lg flex items-center justify-center backface-hidden">
          <span className="text-lg sm:text-xl">✨</span>
        </div>
      </FloatingElement>

      <FloatingElement
        className="absolute top-[55%] right-[30%]"
        duration={7.5}
        delay={1.5}
        distance={20}
        rotation={7}
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-premium-lg flex items-center justify-center backface-hidden">
          <span className="text-lg sm:text-2xl">👁️</span>
        </div>
      </FloatingElement>

      {/* Glowing dots on orbit */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] sm:w-[500px] sm:h-[500px]">
        <div
          className="w-full h-full animate-spin-slow"
          style={{ transform: "rotateX(70deg)" }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-400 shadow-glow animate-pulse-ring" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-glow animate-pulse-ring" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-violet-400 shadow-glow animate-pulse-ring" style={{ animationDelay: "1s" }} />
        </div>
      </div>

      {/* Center icon */}
      <FloatingElement
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        duration={5}
        delay={0}
        distance={10}
        rotation={3}
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-glow-lg flex items-center justify-center">
          <span className="text-white text-3xl sm:text-4xl font-bold">B</span>
        </div>
      </FloatingElement>
    </div>
  );
}
