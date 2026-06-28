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
          primary: "#2563EB",
          secondary: "#7DD3FC",
        },
        surface: "#F5F5F7",
        risk: {
          low: "#60A5FA",
          moderate: "#3B82F6",
          high: "#1E3A8A",
        },
        border: {
          subtle: "#E5E5EA",
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
        card: "0 2px 8px rgba(0, 0, 0, 0.06)",
      },
      maxWidth: {
        app: "430px",
      },
    },
  },
  plugins: [],
};

export default config;
