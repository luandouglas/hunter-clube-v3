/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
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

