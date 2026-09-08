import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Huaming industrial OEM palette.
        navy: {
          DEFAULT: "#00428C",
          50: "#eef4fb",
          100: "#d6e4f4",
          700: "#00428C",
          800: "#003670",
          900: "#002a57",
        },
        steel: {
          DEFAULT: "#0071A9",
          50: "#eef7fc",
          100: "#d4ecf7",
        },
        ink: {
          DEFAULT: "#262626",
          soft: "#4b4b4b",
          muted: "#6b7280",
        },
      },
      fontFamily: {
        sans: [
          '"Noto Sans SC"',
          '"Noto Sans"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.10)",
        panel: "0 10px 30px -12px rgba(0, 66, 140, 0.25)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
