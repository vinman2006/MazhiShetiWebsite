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
        brand: {
          primary: "#166534",
          dark: "#14532D",
          light: "#DCFCE7",
          lime: "#A3E635",
          cream: "#FAFAF0",
          text: "#17251B",
          muted: "#64748B",
        },
        agri: {
          green: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e",
            600: "#16a34a",
            700: "#166534",
            800: "#14532d",
            900: "#0f5a32",
            950: "#08331b",
          },
          lime: {
            DEFAULT: "#A3E635",
            hover: "#84cc16",
            light: "#d9f99d",
          },
          cream: {
            50: "#fdfbf7",
            100: "#FAFAF0",
            200: "#f5ebce",
            300: "#ecdfb3",
          },
          text: {
            main: "#17251B",
            muted: "#64748B",
          },
        },
      },
      fontFamily: {
        sans: ["Figtree", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(22, 101, 52, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)",
        "card-hover": "0 10px 25px -5px rgba(22, 101, 52, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
        modal: "0 20px 40px -10px rgba(23, 37, 27, 0.25)",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-out forwards",
        slideDown: "slideDown 0.2s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
