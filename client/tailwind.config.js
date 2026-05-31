/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0b0b0d',
          800: '#111111',
          700: '#141414',
          600: '#1f1f1f',
          500: '#272727',
          400: '#3a3a3a',
          orange: '#ff8a00',
          'orange-dark': '#ff6500'
        }
      }
    },
  },
  plugins: [],
}

