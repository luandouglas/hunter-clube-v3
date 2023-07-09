/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'gold': "#DAA520",
      'silver': "#BAB8B5",
      'bronze': "#CD7F32",
    },
    extend: {},
  },
  plugins: [],

})

