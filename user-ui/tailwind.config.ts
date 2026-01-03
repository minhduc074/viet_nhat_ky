import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        mood: {
          1: '#ef4444', // Tệ - Red
          2: '#f97316', // Không tốt - Orange
          3: '#eab308', // Bình thường - Yellow
          4: '#22c55e', // Tốt - Green
          5: '#06b6d4', // Tuyệt vời - Cyan
        },
      },
    },
  },
  plugins: [],
}
export default config
