/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#050505',
          dark: '#020302',
          light: '#0a0d0b',
        },
        surface: {
          DEFAULT: '#0F1412',
          card: '#0F1412',
          muted: '#131a17',
        },
        cyber: {
          border: '#1F2924',
          'border-hover': '#10B981',
          emerald: '#10B981',
          neon: '#34D399',
          glow: 'rgba(16, 185, 129, 0.15)',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'dot-matrix': 'radial-gradient(rgba(16, 185, 129, 0.15) 1px, transparent 1px)',
        'cyber-gradient': 'linear-gradient(to bottom right, rgba(16, 185, 129, 0.08), transparent 40%)',
      },
      boxShadow: {
        'emerald-glow': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'emerald-glow-lg': '0 0 50px -10px rgba(16, 185, 129, 0.35)',
        'emerald-glow-sm': '0 0 15px -3px rgba(16, 185, 129, 0.25)',
      },
    },
  },
  plugins: [],
}
