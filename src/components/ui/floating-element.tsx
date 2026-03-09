"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  distance?: number;
  rotation?: number;
}

export function FloatingElement({
  children,
  className,
  duration = 6,
  delay = 0,
  distance = 20,
  rotation = 5,
}: FloatingElementProps) {
  return (
    <div
      className={cn("will-change-transform", className)}
      style={{
        animation: `float3d ${duration}s ease-in-out ${delay}s infinite`,
        ["--float-distance" as string]: `${distance}px`,
        ["--float-rotation" as string]: `${rotation}deg`,
      }}
    >
      {children}
    </div>
  );
}

interface Orbit3DProps {
  children: ReactNode;
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
}

export function Orbit3D({
  children,
  className,
  size = 300,
  duration = 20,
  delay = 0,
}: Orbit3DProps) {
  return (
    <div
      className={cn("absolute", className)}
      style={{
        width: size,
        height: size,
        animation: `orbit3d ${duration}s linear ${delay}s infinite`,
        transformStyle: "preserve-3d",
        perspective: "800px",
      }}
    >
      {children}
    </div>
  );
}
