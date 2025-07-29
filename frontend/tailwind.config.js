/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        quick: ["Quicksand", "Poppins", "sans-serif"],
      },
      colors: {
        pastelPink: '#FFD1E3',
        pastelPurple: '#E0BBFF',
        pastelBlue: '#B5E0FF',
        pastelYellow: '#FFF6B7',
        pastelMint: '#C1FFF3',
        shimmer: '#F9F6FF',
        pookiePink: '#FF8DC7',
        pookiePurple: '#B388FF',
        pookieGlow: '#FFB6F9',
      },
      backgroundImage: {
        'pookie-gradient': 'linear-gradient(135deg, #FFD1E3 0%, #E0BBFF 50%, #B5E0FF 100%)',
      },
      borderRadius: {
        pill: '9999px',
        super: '2rem',
      },
      boxShadow: {
        pookie: '0 4px 32px 0 #FFB6F9, 0 1.5px 6px 0 #E0BBFF',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        sparkle: 'sparkle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

