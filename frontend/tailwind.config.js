/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'codisec': {
          blue: '#2b4896',
          red: '#ee3234',
          white: '#ffffff',
          'light-blue': '#639fb9',
        },
        'chorrillos': {
          blue: '#005fa8',
          dark: '#003b6f',
          gold: '#f2c94c',
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
