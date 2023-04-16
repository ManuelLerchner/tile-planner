/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: ['light'],
  }
};
