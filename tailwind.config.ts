import type { Config } from "tailwindcss";

// Design tokens repris fidèlement du prototype HTML (washi / vermillon / or).
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        card: "var(--card)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        "ink-faint": "var(--ink-faint)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        vermilion: "var(--vermilion)",
        "vermilion-deep": "var(--vermilion-deep)",
        "vermilion-soft": "var(--vermilion-soft)",
        gold: "var(--gold)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        jp: ["var(--font-jp)"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(34,32,29,.04), 0 12px 32px rgba(34,32,29,.06)",
        lg: "0 4px 12px rgba(34,32,29,.08), 0 30px 60px rgba(34,32,29,.14)",
      },
    },
  },
  plugins: [],
};
export default config;
