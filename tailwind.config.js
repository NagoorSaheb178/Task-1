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
          DEFAULT: '#4338ca',
          light: '#6366f1',
          dark: '#3730a3',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        surface: {
          DEFAULT: '#f8fafc',
          card: '#ffffff',
          hover: '#f1f5f9',
          dim: '#e2e8f0',
          border: '#e2e8f0',
        },
        'on-surface': {
          DEFAULT: '#0f172a',
          secondary: '#475569',
          muted: '#94a3b8',
        },
        success: {
          DEFAULT: '#059669',
          light: '#d1fae5',
          dark: '#047857',
        },
        warning: {
          DEFAULT: '#d97706',
          light: '#fef3c7',
          dark: '#b45309',
        },
        danger: {
          DEFAULT: '#dc2626',
          light: '#fee2e2',
          dark: '#b91c1c',
        },
        info: {
          DEFAULT: '#2563eb',
          light: '#dbeafe',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.25s ease-out forwards',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'toast-in': 'toastIn 0.35s ease-out forwards',
        'icon-bounce': 'iconBounce 2.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite',
        'icon-wiggle': 'iconWiggle 3s ease-in-out infinite',
        'icon-jelly': 'iconJelly 3.5s ease-in-out infinite',
        'icon-pop': 'iconPop 2.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        toastIn: {
          from: { opacity: '0', transform: 'translateY(16px) scale(0.95)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        iconBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        iconWiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-12deg)' },
          '75%': { transform: 'rotate(12deg)' },
        },
        iconJelly: {
          '0%, 100%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.15) translateY(-2px)' },
          '70%': { transform: 'scale(0.95)' },
        },
        iconPop: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
}
