import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Trading app color palette
        dark: {
          50: '#f5f7fb',
          100: '#eef2f9',
          200: '#d9e2f0',
          300: '#c4d2e8',
          400: '#a8b8d9',
          500: '#8d9ec9',
          600: '#6b7f9e',
          700: '#4a5f7f',
          800: '#2a3f5f',
          900: '#1a2f3f',
          950: '#0d1017',
        },
        light: {
          950: '#f5f7fb',
          900: '#eef2f9',
          800: '#e8eef5',
          700: '#d9e2f0',
          600: '#c4d2e8',
          500: '#a8b8d9',
        },
        primary: '#00d4ff',
        success: '#00ff88',
        danger: '#ff6b6b',
        warning: '#ffb800',
      },
      fontFamily: {
        mono: ["'Space Mono'", 'monospace'],
        heading: ["'Syne'", 'sans-serif'],
      },
      fontSize: {
        xs: ['9px', { lineHeight: '12px' }],
        sm: ['10px', { lineHeight: '14px' }],
        base: ['12px', { lineHeight: '16px' }],
        lg: ['13px', { lineHeight: '16px' }],
        xl: ['16px', { lineHeight: '20px' }],
        '2xl': ['20px', { lineHeight: '24px' }],
        '3xl': ['28px', { lineHeight: '32px' }],
      },
      spacing: {
        nav: '52px',
      },
      boxShadow: {
        glow: '0 0 6px rgba(0, 212, 255, 0.3)',
        'glow-success': '0 0 6px rgba(0, 255, 136, 0.3)',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
