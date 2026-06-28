import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          primary: "rgb(var(--accent-primary-rgb) / <alpha-value>)",
          secondary: "rgb(var(--accent-secondary-rgb) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "var(--bg-surface)",
          elevated: "var(--bg-surface-elevated)",
        },
        risk: {
          low: "rgb(var(--risk-low-rgb) / <alpha-value>)",
          moderate: "rgb(var(--risk-moderate-rgb) / <alpha-value>)",
          high: "rgb(var(--risk-high-rgb) / <alpha-value>)",
        },
        border: {
          subtle: "var(--border-subtle)",
        },
      },
      fontFamily: {
        sans: ["Noto Sans Thai", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
      },
      maxWidth: {
        app: "430px",
      },
    },
  },
  plugins: [],
};

export default config;
