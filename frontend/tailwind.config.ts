import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FAF9F7',
        surface: '#FFFFFF',
        border: '#E8E4DE',
        accent: {
          DEFAULT: '#C17B4E',
          hover: '#A8663E',
          light: '#FDF3EC',
          muted: '#F0E6DC',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          secondary: '#6B6560',
          muted: '#9E9890',
        },
        primary: {
          DEFAULT: '#C17B4E',
          50: '#FDF3EC',
          100: '#F9E3CC',
          600: '#C17B4E',
          700: '#A8663E',
        },
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.05', fontWeight: '600', letterSpacing: '-0.03em' }],
        'heading-1': ['2.5rem', { lineHeight: '1.1', fontWeight: '600', letterSpacing: '-0.025em' }],
        'heading-2': ['1.875rem', { lineHeight: '1.15', fontWeight: '600', letterSpacing: '-0.02em' }],
        'heading-3': ['1.375rem', { lineHeight: '1.25', fontWeight: '600' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.65', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.65', fontWeight: '400' }],
        'caption': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        'card': '12px',
        'btn': '8px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};
export default config;
