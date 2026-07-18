// ================================================================
// Shreedha Vastra — Tailwind CSS Configuration
// ================================================================
// Custom brand theme: peach, light pink, royal gold, ivory, beige.
// Elegant serif for headings, clean sans-serif for body text.
// ================================================================
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // toggled via a "dark" class on <html>, controlled by ThemeContext
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        peach: {
          light: '#FBE4D2',
          DEFAULT: '#F5C6A5',
          dark: '#E8A67B',
        },
        blush: {
          light: '#FCEAEA',
          DEFAULT: '#F7D6D6',
          dark: '#EFC0C0',
        },
        gold: {
          light: '#D4AF7A',
          DEFAULT: '#B08D57',
          dark: '#8B6F3E',
        },
        ivory: '#FFFFF0',
        beige: '#F5F0E6',
        charcoal: '#2B2420',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px rgba(176, 141, 87, 0.12)',
        gold: '0 4px 20px rgba(176, 141, 87, 0.25)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        slideUp: 'slideUp 0.6s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
