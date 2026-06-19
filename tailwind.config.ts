import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./providers/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F7F2E7",
          dark: "#152019",
        },
        ink: {
          DEFAULT: "#20241F",
          dark: "#F1ECDD",
        },
        forest: {
          50: "#E9F0EC",
          100: "#C9DBD0",
          300: "#5E8C76",
          500: "#1F4D3D",
          600: "#193E32",
          700: "#102A21",
        },
        mustard: {
          100: "#F6E2B8",
          300: "#E5B564",
          500: "#D89B3C",
          600: "#B97E27",
        },
        clay: {
          300: "#D69680",
          500: "#B5573A",
          600: "#94432A",
        },
        moss: {
          100: "#E2E9E2",
          300: "#A9BCAB",
          500: "#7C9885",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        card: "0.875rem",
        stamp: "9999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(32, 36, 31, 0.06), 0 8px 24px -12px rgba(32, 36, 31, 0.18)",
        "card-hover": "0 4px 8px rgba(32, 36, 31, 0.08), 0 16px 32px -12px rgba(32, 36, 31, 0.24)",
      },
      maxWidth: {
        content: "1240px",
      },
    },
  },
  plugins: [],
};

export default config;
