/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {},
  },
  plugins: [],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  plugins: [require("daisyui")],
}

