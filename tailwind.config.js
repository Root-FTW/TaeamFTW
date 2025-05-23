/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'fortnite-blue': '#0078F2',
        'fortnite-purple': '#8B5CF6',
        'fortnite-yellow': '#FFD700',
        'fortnite-orange': '#FF6B35',
        'gaming-dark': '#0A0A0A',
        'gaming-gray': '#1A1A1A',
        'neon-cyan': '#00FFFF',
        'neon-pink': '#FF1493',
        'neon-green': '#39FF14',
      },
      fontFamily: {
        'gaming': ['Orbitron', 'monospace'],
        'display': ['Exo 2', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF' },
          '100%': { boxShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF' },
        },
      },
      backgroundImage: {
        'gradient-gaming': 'linear-gradient(135deg, #0078F2 0%, #8B5CF6 50%, #FF6B35 100%)',
        'gradient-neon': 'linear-gradient(45deg, #00FFFF 0%, #FF1493 50%, #39FF14 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

