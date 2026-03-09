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
      {/* Orbiting ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[380px] lg:h-[380px]">
        <div
          className="w-full h-full rounded-full border border-brand-200/25 animate-spin-slow"
          style={{ transform: "rotateX(70deg)" }}
        />
      </div>

      {/* Center logo */}
      <FloatingElement
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        duration={6}
        delay={0}
        distance={8}
        rotation={2}
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-glow-lg flex items-center justify-center">
          <span className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">B</span>
        </div>
      </FloatingElement>

      {/* 4 icons in corners - well spaced */}
      <FloatingElement
        className="absolute top-[6%] right-[10%] sm:top-[4%] sm:right-[8%]"
        duration={7}
        delay={0}
        distance={12}
        rotation={3}
      >
        <div className="w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-white shadow-premium-lg flex items-center justify-center">
          <span className="text-lg sm:text-xl lg:text-2xl">✂️</span>
        </div>
      </FloatingElement>

      <FloatingElement
        className="absolute top-[6%] left-[10%] sm:top-[4%] sm:left-[8%]"
        duration={8}
        delay={1.5}
        distance={10}
        rotation={3}
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-white shadow-premium-lg flex items-center justify-center">
          <span className="text-base sm:text-lg lg:text-xl">💅</span>
        </div>
      </FloatingElement>

      <FloatingElement
        className="absolute bottom-[6%] right-[10%] sm:bottom-[4%] sm:right-[8%]"
        duration={6.5}
        delay={0.8}
        distance={14}
        rotation={4}
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-white shadow-premium-lg flex items-center justify-center">
          <span className="text-base sm:text-lg lg:text-xl">💄</span>
        </div>
      </FloatingElement>

      <FloatingElement
        className="absolute bottom-[6%] left-[10%] sm:bottom-[4%] sm:left-[8%]"
        duration={9}
        delay={2}
        distance={10}
        rotation={3}
      >
        <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl bg-white shadow-premium-lg flex items-center justify-center">
          <span className="text-sm sm:text-base lg:text-lg">✨</span>
        </div>
      </FloatingElement>
    </div>
  );
}
