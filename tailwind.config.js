// @type {import('tailwindcss').Config} 
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  content: [
  './public/*.html',
  './node_modules/flowbite/**/*.js'
],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}