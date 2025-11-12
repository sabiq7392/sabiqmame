import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#3b82f6',
          'blue-dark': '#2563eb',
          'blue-light': '#60a5fa',
        },
        dark: {
          bg: '#0a0e27',
          'bg-secondary': '#111827',
          'bg-tertiary': '#1e293b',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0a0e27 0%, #111827 50%, #1e293b 100%)',
        'gradient-light': 'linear-gradient(135deg, #ffffff 0%, #f9fafb 50%, #f3f4f6 100%)',
        'gradient-blue': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        'gradient-text': 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
      },
      backdropBlur: {
        glass: '20px',
        'glass-strong': '30px',
        'glass-soft': '10px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-strong': '0 8px 32px 0 rgba(31, 38, 135, 0.5)',
        blue: '0 4px 15px rgba(59, 130, 246, 0.4)',
        'blue-hover': '0 6px 20px rgba(59, 130, 246, 0.5)',
      },
    },
  },
  plugins: [],
}
export default config
