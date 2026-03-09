import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        purple: {
          primary: "#6A1B9A",
          mid: "#8E24AA",
          light: "#F3E5F5",
        },
        orange: {
          primary: "#E65100",
          mid: "#F57C00",
          light: "#FFF3E0",
        },
        dark: "#1A1A2E",
        body: "#333333",
        muted: "#888888",
        background: "#FAFAFA",
        white: "#FFFFFF",
        success: {
          DEFAULT: "#2E7D32",
          light: "#E8F5E9",
        },
        error: {
          DEFAULT: "#C62828",
          light: "#FFEBEE",
        },
        warning: {
          DEFAULT: "#F57F17",
          light: "#FFF8E1",
        },
        info: "#1565C0",
        border: "#E0E0E0",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        h1: ["48px", { lineHeight: "1.15", fontWeight: "700" }],
        h2: ["32px", { lineHeight: "1.25", fontWeight: "700" }],
        h3: ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        h4: ["18px", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["13px", { lineHeight: "1.4", fontWeight: "400" }],
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        full: "9999px",
        pill: "50px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.08)",
        cardHover: "0 6px 24px rgba(0,0,0,0.14)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
        "slide-in": "slideIn 0.3s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
