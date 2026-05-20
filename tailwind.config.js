/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        qd: {
          bg: '#f2f2f2',
          surface: '#ffffff',
          dark: '#1c1c1e',
          darker: '#111111',
          mid: '#3d3d3d',
          gray: '#6e6e73',
          light: '#aeaeb2',
          border: '#d2d2d7',
          accent: '#0071e3',
          'accent-hover': '#0077ed',
          red: '#ff3b30',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
