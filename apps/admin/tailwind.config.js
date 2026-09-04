export default {
  presets: [require('../../packages/ui/tailwind.preset.cjs')],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/components/src/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [require('tailwindcss-animate')],
};
