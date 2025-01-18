/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Inter Display', 'sans-serif'],
        mono: ['Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'monospace'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        code: {
          bg: '#1e1e1e',
          text: '#d4d4d4',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            p: {
              color: 'inherit',
            },
            strong: {
              color: 'inherit',
            },
            a: {
              color: '#0ea5e9',
              '&:hover': {
                color: '#0284c7',
              },
            },
            h1: {
              color: 'inherit',
            },
            h2: {
              color: 'inherit',
            },
            h3: {
              color: 'inherit',
            },
            h4: {
              color: 'inherit',
            },
            pre: {
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              borderRadius: '0.5rem',
              padding: '1rem',
              code: {
                backgroundColor: 'transparent',
                color: 'inherit',
                fontFamily: 'Monaco, Menlo, Ubuntu Mono, Consolas, monospace',
                fontSize: '0.875rem',
                lineHeight: '1.5',
              },
            },
            'ul[data-type="taskList"]': {
              listStyle: 'none',
              padding: 0,
            },
            'ul[data-type="taskList"] li': {
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 