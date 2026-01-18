/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '.dark-mode'],
  theme: {
    extend: {
      colors: {
        pizza: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Primary brand color (vibrant amber)
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        stone: {
          50: '#fafaf9',
          900: '#1c1917',
        },
        white:{}
      },
      height: {
        screen: '100dvh',
      },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
    },
  },
  plugins: [],
};
