import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101D28",
        "ink-soft": "#1C2E3D",
        paper: "#F4EDE0",
        cream: "#FBF7EC",
        line: "#DCD2BF",
        gold: "#E8A33D",
        "gold-deep": "#A96F12",
        flare: "#E4572E",
        "flare-deep": "#B03A17",
        sea: "#14586C",
        glow: "#9BE7FF"
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        soft: "0 20px 60px -24px rgba(16, 29, 40, 0.28)",
        lift: "0 40px 90px -32px rgba(16, 29, 40, 0.45)"
      },
      transitionTimingFunction: {
        swift: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    }
  },
  plugins: []
};

export default config;
