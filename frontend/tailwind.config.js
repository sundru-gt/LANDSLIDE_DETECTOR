/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        mute: "var(--mute)",
        soft: "var(--soft)",
        red: "var(--red)",
        sal: "var(--sal)",
        hi: "var(--hi)",
        md: "var(--md)",
        lo: "var(--lo)",
      },
      fontFamily: {
        disp: ["var(--disp)"],
        mono: ["var(--mono)"],
        sans: ["var(--sans)"],
      },
    },
  },
  plugins: [],
};

