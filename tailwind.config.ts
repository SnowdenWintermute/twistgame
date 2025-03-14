import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        light: {
          primary: "oklch(0.87 0.065 274.039)",
          accent: "oklch(0.437 0.078 188.216)",
          background: "oklch(0.372 0.044 257.287)",
          text: "oklch(0.871 0.006 286.286)",
          border: "oklch(0.871 0.006 286.286)",
          fill: "oklch(0.871 0.006 286.286)",
          stroke: "oklch(0.871 0.006 286.286)",
        },
        dark: {
          primary: "oklch(0.92 0.004 286.32)",
          accent: "oklch(0.442 0.017 285.786)",
          background: "oklch(0.21 0.006 285.885)",
          text: "oklch(0.871 0.006 286.286)",
          border: "oklch(0.552 0.016 285.938)",
          fill: "oklch(0.552 0.016 285.938)",
          stroke: "oklch(0.552 0.016 285.938)",
        },
      },
    },
  },
};
export default config;
