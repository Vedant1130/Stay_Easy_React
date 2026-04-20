/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        "colar-red": "#fe424d",
        "brand-primary": "#4F46E5", // Indigo 600
        "brand-secondary": "#7C3AED", // Violet 600
        "brand-dark": "#0F172A", // Slate 900
        "brand-light": "#F8FAFC", // Slate 50
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".rotate-y-180": {
          transform: "rotateY(180deg)",
        },
        ".preserve-3d": {
          transformStyle: "preserve-3d",
        },
        ".perspective-1000": {
          perspective: "1000px",
        },
        ".backface-hidden": {
          backfaceVisibility: "hidden",
        },
        ".glass": {
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.125)",
        },
        ".glass-dark": {
          background: "rgba(15, 23, 42, 0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }
      });
    }),
  ],
};
