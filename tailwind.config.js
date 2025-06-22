/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(to top right, #f3e8ff, #e0f2fe)',
        'gradient-dark': 'linear-gradient(to top right, #1e1b4b, #1e293b)',
      },
    },
  },
  plugins: [],
} 