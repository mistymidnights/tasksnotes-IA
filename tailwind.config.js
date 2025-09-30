import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#e5c1ff",
          300: "#d698ff",
          500: "#7d3aae",
          700: "#2f0f44",
          DEFAULT: "#43175b",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#c2c2c2", // white
        },
        warning: {
          DEFAULT: "#f7a325", // naranja
        },
        success: {
          DEFAULT: "#c0d27e", // verde
        },
        danger: {
          DEFAULT: "#F21628", // rojo
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

module.exports = config;
