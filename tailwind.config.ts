import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2d5a9e', // Primary Stitch Slate Blue
          600: '#094285', // Darker Healthcare Blue
          700: '#1d3557',
          800: '#0b1c30', // Deep Navy text
          900: '#071220',
        },
        teal: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#006a63', // Secondary Teal Stitch
          600: '#005751',
          700: '#004641',
        },
        glacier: {
          bg: '#f8f9ff',
          card: '#ffffff',
          subtle: '#e5eeff',
          border: '#d7e3ff',
          accent: '#4db6ac',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glacier': '0 4px 20px -2px rgba(11, 28, 48, 0.05), 0 2px 6px -1px rgba(11, 28, 48, 0.03)',
        'glacier-lg': '0 12px 32px -4px rgba(9, 66, 133, 0.08), 0 4px 12px -2px rgba(9, 66, 133, 0.04)',
        'card-hover': '0 20px 40px -8px rgba(9, 66, 133, 0.12)',
      },
    },
  },
  plugins: [],
};
export default config;
