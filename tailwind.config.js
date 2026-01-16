/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // deep blue/charcoal
        surface: '#1e293b', 
        primary: '#06b6d4', // cyan-500
        secondary: '#3b82f6', // blue-500
        accent: '#22d3ee', // cyan-400
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
