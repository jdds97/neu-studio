/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2A2AEE',
          'blue-hover': '#1E1ECC',
          gray: '#B6B6B6',
          dark: '#1A1A1A',
          light: '#F5F5F0',
          border: '#E5E5E5',
        },
      },
      fontFamily: {
        display: ['Michroma', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
        accent: ['Space Grotesk', 'sans-serif'],
      },
      letterSpacing: {
        'tight-display': '-0.125rem',
        'wide-label': '0.25rem',
        'wider-label': '0.375rem',
      },
    },
  },
  plugins: [],
};
