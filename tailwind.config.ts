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
        // Brand accent — warm brown / copper
        accent: {
          DEFAULT: "#b05a2a",
          hover: "#6b3020",
          light: "#f5e8da",
          muted: "#c4a98c",
        },
        // CTA — deep brand brown buttons
        cta: {
          DEFAULT: "#3d1a0f",
          hover: "#6b3020",
          light: "#f5e8da",
        },
        // Warm tones
        blush: {
          DEFAULT: "#f5e8da",
          accent: "#c4a98c",
          coral: "#b05a2a",
        },
        // Neutrals — warm brown backbone
        dark: "#3d1a0f",
        body: "#3d1a0f",
        muted: "#9a7b6a",
        background: "#faf5f0",
        surface: "#ffffff",
        border: "#e0d3c8",
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
          primary: "#b05a2a",
          mid: "#6b3020",
          light: "#f5e8da",
        },
        orange: {
          primary: "#b05a2a",
          mid: "#6b3020",
          light: "#f5e8da",
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", ...defaultTheme.fontFamily.sans],
        serif: ["'Playfair Display'", "Georgia", "serif"],
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
        glow: "0 0 0 1px rgba(176,90,42,0.1), 0 4px 16px rgba(196,169,140,0.12)",
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
