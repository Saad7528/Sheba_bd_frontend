/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#e6f4f1',
          DEFAULT: '#0d9488', // Teal 600
          dark: '#115e59',   // Teal 800
        },
        secondary: {
          light: '#e0e7ff',
          DEFAULT: '#4f46e5', // Indigo 600
          dark: '#3730a3',   // Indigo 800
        },
        accent: {
          light: '#ffe4e6',
          DEFAULT: '#f43f5e', // Rose 500
          dark: '#be123c',   // Rose 700
        },
        neutral: {
          slate: '#0f172a',  // Slate 900
          charcoal: '#334155', // Slate 700
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'premium': '1rem',
      }
    },
  },
  plugins: [],
}
