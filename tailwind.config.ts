import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#06172f",
        royal: "#1558d6",
        cyan: "#19c7e8",
        ice: "#f5f9fc",
        signal: "#e52f3f",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(21, 88, 214, 0.22)",
        lift: "0 18px 48px rgba(6, 23, 47, 0.14)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
