import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-light':
          'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.12) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};

export default config;
