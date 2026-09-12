/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        fmo: {
          bg: "#0a0a0f",
          card: "#15151f",
          border: "#2a2a3a",
          pink: "#ff2e88",
          purple: "#8b5cf6",
          cyan: "#22d3ee",
          yellow: "#facc15",
          green: "#34d399",
        },
      },
      backgroundImage: {
        "fmo-gradient":
          "linear-gradient(135deg, #ff2e88 0%, #8b5cf6 45%, #22d3ee 100%)",
      },
      fontFamily: {
        display: ["'Poppins'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
