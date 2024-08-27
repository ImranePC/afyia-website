/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '480px',
          md: '768px',
          lg: '976px',
          xl: '1440px',
        }
      }
    },
  },
  plugins: [],
}

