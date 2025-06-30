/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        haas: ['"Neue Haas"', 'sans-serif'],
      },
      fontSize: {
        h1: ['4.22rem', { lineHeight: '6.4rem' }],
        h2: ['3.15rem'],
        h3: ['2.39rem'],
        h4: ['1.8rem'],
        h5: ['1.33rem'],
        h6: ['0.778rem'],
      },
    },
  },
  plugins: [],
};