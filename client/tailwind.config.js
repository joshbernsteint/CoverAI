/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#070F2B",
        secondary: "#1B1A55",
        greyishPurple: "#535C91",
        lightPurple: "#9290C3",
        lightGray: "#F7F7F7",
        coverLetterBlue: "#214ad0",
        background_dark: "#201F1F",
      },
      fontFamily: {
        body: ["Poppins"],
        jockey: ["Jockey One"],
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
