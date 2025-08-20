/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        linkedin: '#0077b5',
        twitter: '#1da1f2',
        instagram: '#e4405f',
        youtube: '#ff0000',
        tiktok: '#000000',
        reddit: '#ff4500',
        threads: '#8b5cf6',
        facebook: '#1877f2',
            weibo: '#e6162d',
    x: '#000000',
    rednote: '#ff2442',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
