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
        // ── Brand Palette: Warm Heritage Luxury ──
        obsidian: "#1A1208",
        charcoal: "#2A1F10",
        gold: {
          DEFAULT: "#C8963C",
          light: "#E8D5A0",
          dark: "#B07D2A",
        },
        brass: "#E8B84B",
        ivory: "#F5EDD8",
        terracotta: "#8B3A2A",
        pewter: "#4A4540",
        blush: "#D4956A",
        sage: "#A8B5A0",
        smoke: "#6B6B7B",
        pearl: "#F5F0E8",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
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
        "fade-in-up":
          "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-right":
          "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in":
          "scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        shimmer: "shimmer 2s ease-in-out infinite",
        "gold-pulse": "goldPulse 2.5s ease-in-out infinite",
        "bounce-gentle": "bounceGentle 1s ease-in-out infinite",
        "glow-gold": "glowGold 3s ease-in-out infinite",
        "text-shimmer": "textShimmer 3s ease-in-out infinite",
        "border-reveal": "borderReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        float: "float 6s ease-in-out infinite",
        "diamond-spin": "diamondSpin 8s linear infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
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
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(200, 150, 60, 0)" },
          "50%": { boxShadow: "0 0 20px 4px rgba(200, 150, 60, 0.15)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        glowGold: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(200, 150, 60, 0.1), 0 0 60px rgba(200, 150, 60, 0.05)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(200, 150, 60, 0.2), 0 0 80px rgba(200, 150, 60, 0.1)",
          },
        },
        textShimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        borderReveal: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        diamondSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      boxShadow: {
        gold: "0 4px 20px rgba(200, 150, 60, 0.25)",
        "gold-lg": "0 8px 40px rgba(200, 150, 60, 0.35)",
        "gold-glow": "0 0 30px rgba(200, 150, 60, 0.2), 0 0 60px rgba(200, 150, 60, 0.1)",
        warm: "0 10px 40px rgba(26, 18, 8, 0.5)",
        "warm-lg": "0 20px 60px rgba(26, 18, 8, 0.6)",
      },
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(135deg, #1A1208 0%, #2A1F10 40%, #1A1208 100%)",
        "gradient-gold":
          "linear-gradient(135deg, #C8963C 0%, #E8B84B 50%, #C8963C 100%)",
        "gradient-gold-subtle":
          "linear-gradient(135deg, #C8963C 0%, #E8D5A0 50%, #C8963C 100%)",
        "gradient-overlay":
          "linear-gradient(180deg, rgba(26,18,8,0) 0%, rgba(26,18,8,0.9) 100%)",
        "gradient-overlay-top":
          "linear-gradient(0deg, rgba(26,18,8,0) 0%, rgba(26,18,8,0.6) 100%)",
        "gradient-cta":
          "linear-gradient(135deg, #C8963C 0%, #B07D2A 100%)",
        "gradient-warm":
          "linear-gradient(180deg, #1A1208 0%, #2A1F10 100%)",
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
