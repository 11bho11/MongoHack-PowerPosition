import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        space: {
          base: '#0a0a1a',
          card: '#0f0f2a',
          border: '#1a1a3e',
        },
        accent: {
          indigo: '#6366f1',
          purple: '#8b5cf6',
          glow: '#4f46e5',
        },
      },
    },
  },
  plugins: [],
}

export default config
