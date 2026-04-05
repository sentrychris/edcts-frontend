/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'border-breathe': 'fx-border-breathe 8s ease-in-out infinite',
        'glitch': 'fx-glitch 12s ease-in-out infinite',
        'holo-shift': 'fx-holo-shift 10s ease-in-out infinite',
        'cursor-blink': 'fx-cursor-blink 1.2s step-end infinite',
        'data-flicker': 'fx-data-flicker 0.8s ease forwards',
        'dot-orange': 'fx-dot-pulse-orange 2s ease-in-out infinite',
        'dot-green': 'fx-dot-pulse-green 2s ease-in-out infinite',
        'scan': 'fx-scan-line 10s linear infinite',
        'sweep-in': 'fx-wipe-in-right 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
}
