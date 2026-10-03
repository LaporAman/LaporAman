/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0d1526',
          900: '#121b30',
          800: '#1b2740',
          700: '#2a3958'
        },
        paper: '#fbfaf6',
        offwhite: '#f6f4ee',
        teal: {
          DEFAULT: '#4f8b83',
          soft: '#e6efec'
        },
        clay: '#c97b5f',
        ink: {
          DEFAULT: '#182033',
          soft: '#5a6478'
        },
        line: '#e2ded3'
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        xl2: '14px'
      },
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
