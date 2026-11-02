/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070707',
          900: '#0d0d0d', // Base background
          850: '#111111',
          800: '#161618',
          700: '#1f1f23',
          600: '#2a2a30',
          500: '#383842',
        },
        gold: {
          50: '#fdfbf5',
          100: '#faf4e4',
          200: '#f4e5c0',
          300: '#ecd295',
          400: '#e1bc63',
          500: '#d4a831', // primary gold accent
          600: '#c29224',
          700: '#9e7019',
          800: '#7f5716',
          900: '#684515',
        },
        brand: {
          50: '#faf4e4',
          100: '#f4e5c0',
          200: '#ecd295',
          300: '#e1bc63',
          400: '#d4a831',
          500: '#d4a831',
          600: '#c29224',
          700: '#9e7019',
          800: '#161618',
          900: '#0d0d0d',
          accent: '#d4a831',
        }
      },
      fontFamily: {
        script: ['"Dancing Script"', 'cursive', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 4px 20px -2px rgba(0, 0, 0, 0.7)',
        'luxury-hover': '0 10px 30px -4px rgba(212, 168, 49, 0.25)',
        'gold-glow': '0 0 25px -2px rgba(212, 168, 49, 0.4)',
        'gold-border': '0 0 0 1px rgba(212, 168, 49, 0.3)',
      }
    },
  },
  plugins: [],
}
