/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#C8102E',
        'brand-gold': '#FFD700',
        'brand-navy': '#0A0F1E',
        'surface-dark': '#141929',
        'surface-card': '#1C2338',
        'surface-elevated': '#242D44',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
