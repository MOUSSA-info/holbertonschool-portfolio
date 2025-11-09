// generate-tailwind.js
const fs = require('fs');
const path = require('path');

const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`;

const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;

fs.writeFileSync(path.join(__dirname, 'tailwind.config.js'), tailwindConfig);
fs.writeFileSync(path.join(__dirname, 'postcss.config.js'), postcssConfig);
console.log('✅ tailwind.config.js et postcss.config.js créés !');

// Crée le CSS source
const cssSource = `@tailwind base;\n@tailwind components;\n@tailwind utilities;`;
fs.writeFileSync(path.join(__dirname, 'src', 'tailwind.css'), cssSource);
console.log('✅ src/tailwind.css créé !');
