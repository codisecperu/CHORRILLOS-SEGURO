/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'chorrillos': {
          blue: '#005fa8',
          white: '#ffffff',
          gold: '#e8b400',
          dark: '#1a365d',
          'light-blue': '#3182ce',
        }
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'chorrillos': '0 4px 6px -1px rgba(0, 95, 168, 0.1), 0 2px 4px -1px rgba(0, 95, 168, 0.06)',
      }
    },
  },
  plugins: [],
}
