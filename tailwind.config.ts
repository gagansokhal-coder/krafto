import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        obsidian: "#1A1A2E",
        charcoal: "#16213E",
        gold: {
          DEFAULT: "#C9A96E",
          light: "#E8D5B7",
          dark: "#B8956A",
        },
        ivory: "#FAF6F0",
        blush: "#E8B4B8",
        sage: "#A8B5A0",
        burgundy: "#8B2252",
        smoke: "#6B6B7B",
        pearl: "#F5F5F0",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        accent: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "400ms",
        entrance: "800ms",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-right": "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        shimmer: "shimmer 1.5s infinite",
        "gold-pulse": "goldPulse 2s ease-in-out infinite",
        "bounce-gentle": "bounceGentle 1s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        goldPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201, 169, 110, 0)" },
          "50%": { boxShadow: "0 0 0 8px rgba(201, 169, 110, 0.15)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      boxShadow: {
        gold: "0 4px 20px rgba(201, 169, 110, 0.3)",
        "gold-lg": "0 8px 40px rgba(201, 169, 110, 0.4)",
      },
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)",
        "gradient-gold":
          "linear-gradient(135deg, #C9A96E 0%, #E8D5B7 50%, #C9A96E 100%)",
        "gradient-overlay":
          "linear-gradient(180deg, rgba(26,26,46,0) 0%, rgba(26,26,46,0.85) 100%)",
      },
    },
  },
  plugins: [
    // scrollbar-hide utility
    function ({ addUtilities }: { addUtilities: (utils: Record<string, Record<string, string>>) => void }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none",
        },
      });
    },
  ],
};

export default config;
