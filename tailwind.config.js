/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Soft blush / lavender cream — backgrounds & warm neutrals
        // (keeps the existing `sand-*` class names site-wide)
        sand: {
          50: "#fdfafb",
          100: "#faf2f4",
          200: "#f3e3e8",
          300: "#e9cdd6",
          400: "#dab1bf",
          500: "#c595a8",
          600: "#ad7a8e",
          700: "#8e6275",
          800: "#6f4e5d",
          900: "#534048",
        },
        // Plum / mauve — primary brand color drawn from the logo heart
        // (keeps the existing `sage-*` class names site-wide)
        sage: {
          50: "#faf5f9",
          100: "#f1e4ee",
          200: "#e1c6dc",
          300: "#c89cc1",
          400: "#ad75a4",
          500: "#8e5a8a",
          600: "#6e3f73",
          700: "#5a3360",
          800: "#4a2a55",
          900: "#361f3f",
        },
        // Leaf green accent — from the sprout in the logo
        leaf: {
          50: "#f3f7f0",
          100: "#e2ebda",
          200: "#c5d7b6",
          300: "#a3bf8e",
          400: "#8fb07a",
          500: "#6f985f",
          600: "#4f7a4a",
          700: "#3f6139",
          800: "#314a2d",
          900: "#243722",
        },
        // Warm copper/gold accent — from the signature & dotted aura
        gold: {
          50: "#fbf6ec",
          100: "#f5e9cf",
          200: "#ecd29c",
          300: "#dfb56b",
          400: "#d29a4a",
          500: "#c78a4b",
          600: "#a8703a",
          700: "#85572d",
          800: "#634123",
          900: "#412c18",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "serif"],
      },
    },
  },
  plugins: [],
};
