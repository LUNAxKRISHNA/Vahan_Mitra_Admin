/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#EEF2FF',
          100: '#E0E8F8',
          200: '#C1D1F1',
          300: '#93AFDE',
          400: '#5E86C7',
          500: '#3A65B0',
          600: '#2B4D94',
          700: '#1A3A6B',
          800: '#162F58',
          900: '#0F2044',
          950: '#081429',
        },
        teal: {
          50:  '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        surface: '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 4px 24px rgba(15, 32, 68, 0.08)',
        'glass-lg': '0 8px 40px rgba(15, 32, 68, 0.12)',
        card: '0 1px 3px rgba(15,32,68,0.06), 0 4px 12px rgba(15,32,68,0.06)',
      },
      backgroundImage: {
        'gradient-navy': 'linear-gradient(135deg, #0F2044 0%, #1A3A6B 100%)',
        'gradient-teal': 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'counter': 'counter 1s ease-out',
        'pulse-dot': 'pulseDot 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.4)' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
