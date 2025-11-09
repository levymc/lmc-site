import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        foreground: "var(--foreground)",
        "foreground-muted": "var(--foreground-muted)",
        background: "var(--background)",
        "background-accent": "var(--background-accent)",
        surface: "var(--surface)",
        border: "var(--border)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        "card-soft": "0 25px 60px rgba(23, 15, 9, 0.35)",
        "card-strong": "0 40px 80px rgba(26, 18, 12, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
