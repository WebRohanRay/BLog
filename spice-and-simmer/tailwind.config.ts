import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",   // primary orange
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        spice: {
          red:    "#dc2626",
          turmeric: "#d97706",
          cardamom: "#16a34a",
          saffron: "#f59e0b",
          clay:   "#92400e",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body:    ["var(--font-lato)", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#374151",
            a: { color: "#f97316", "&:hover": { color: "#ea580c" } },
            h1: { fontFamily: "var(--font-playfair)" },
            h2: { fontFamily: "var(--font-playfair)" },
            h3: { fontFamily: "var(--font-playfair)" },
          },
        },
      },
      animation: {
        "fade-in":      "fadeIn 0.5s ease-out",
        "slide-up":     "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        shimmer:        "shimmer 1.5s infinite",
        "spin-slow":    "spin 3s linear infinite",
        "bounce-light": "bounceLt 1s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:       { from: { opacity: "0" },                     to: { opacity: "1" } },
        slideUp:      { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideInRight: { from: { opacity: "0", transform: "translateX(24px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        shimmer:      { "0%": { backgroundPosition: "-200% 0" },    "100%": { backgroundPosition: "200% 0" } },
        bounceLt:     { "0%,100%": { transform: "translateY(0)" },  "50%": { transform: "translateY(-4px)" } },
      },
      backgroundImage: {
        "hero-pattern": "url('/images/hero-pattern.svg')",
        "grain":        "url('/images/grain.png')",
      },
      boxShadow: {
        card:  "0 2px 8px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(249,115,22,0.2)",
        "inner-orange": "inset 0 0 0 2px #f97316",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;
