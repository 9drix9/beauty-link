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
        // Brand accent — blush pink / coral
        accent: {
          DEFAULT: "#D06A4E",
          hover: "#5A2F1A",
          light: "#F4DDE5",
          muted: "#DFA3A6",
        },
        // CTA — deep espresso buttons
        cta: {
          DEFAULT: "#4B2615",
          hover: "#5A2F1A",
          light: "#F4DDE5",
        },
        // Blush tones
        blush: {
          DEFAULT: "#F4DDE5",
          accent: "#DFA3A6",
          coral: "#D06A4E",
        },
        // Neutrals — warm espresso backbone
        dark: "#3A1F10",
        body: "#3A1F10",
        muted: "#9a7b6a",
        background: "#F6EDE6",
        surface: "#FFF8F4",
        border: "#E6D8CF",
        // Semantic colors
        success: {
          DEFAULT: "#10B981",
          light: "#ECFDF5",
        },
        error: {
          DEFAULT: "#EF4444",
          light: "#FEF2F2",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FFFBEB",
        },
        info: {
          DEFAULT: "#3B82F6",
          light: "#EFF6FF",
        },
        // Legacy aliases
        purple: {
          primary: "#D06A4E",
          mid: "#5A2F1A",
          light: "#F4DDE5",
        },
        orange: {
          primary: "#D06A4E",
          mid: "#5A2F1A",
          light: "#F4DDE5",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        serif: ["Georgia", "'Times New Roman'", "serif"],
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
        card: "0 1px 2px rgba(0,0,0,0.03), 0 1px 6px rgba(0,0,0,0.02)",
        cardHover: "0 8px 30px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03)",
        soft: "0 2px 8px rgba(0,0,0,0.04)",
        elevated: "0 4px 20px rgba(0,0,0,0.06)",
        glow: "0 0 0 1px rgba(208,106,78,0.1), 0 4px 16px rgba(223,163,166,0.12)",
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
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
        "slide-in": "slideIn 0.3s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
