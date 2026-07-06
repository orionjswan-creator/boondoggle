import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171411",
        paper: "#f7f3ec",
        panel: "#fffaf1",
        line: "#d8cbbd",
        forest: "#1f5f4b",
        oxide: "#b9462f",
        gold: "#c09034",
        steel: "#54717c"
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(36, 31, 26, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
