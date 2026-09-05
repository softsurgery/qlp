export default {
  presets: [require('../../packages/ui/tailwind.preset.cjs')],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/form-builder/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/datatable-builder/src/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [require('tailwindcss-animate')],
};
