import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F0D060",
          dark: "#B8960C",
          muted: "#8B7513",
        },
        dark: {
          DEFAULT: "#0A0A0A",
          100: "#111111",
          200: "#1A1A1A",
          300: "#222222",
          400: "#2A2A2A",
        },
        crimson: {
          DEFAULT: "#8B0000",
          light: "#C41E3A",
          dark: "#5C0000",
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        cinzel: ["var(--font-cinzel)", "serif"],
        cormorant: ["var(--font-cormorant)", "serif"],
      },
      backgroundImage: {
        "luxury-gradient":
          "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0A0A0A 100%)",
        "gold-gradient":
          "linear-gradient(90deg, #8B7513 0%, #D4AF37 50%, #8B7513 100%)",
        "hero-pattern":
          "radial-gradient(ellipse at center, #1A1A1A 0%, #0A0A0A 70%)",
      },
      boxShadow: {
        gold: "0 0 20px rgba(212,175,55,0.3)",
        "gold-lg": "0 0 40px rgba(212,175,55,0.4)",
        "gold-inset": "inset 0 0 20px rgba(212,175,55,0.1)",
        luxury: "0 25px 50px rgba(0,0,0,0.8)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-in-out",
        "fade-up": "fadeUp 0.8s ease-out",
        "gold-pulse": "goldPulse 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        goldPulse: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(212,175,55,0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(212,175,55,0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
