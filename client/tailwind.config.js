/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1a56db',
          'blue-dark': '#1e429f',
          'blue-light': '#ebf5ff',
          orange: '#f97316',
          'orange-dark': '#ea580c',
          navy: '#0b1329',
          'navy-light': '#111c44',
          bg: '#f8f9fb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
