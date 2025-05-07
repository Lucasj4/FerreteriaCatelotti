/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  safelist: [
    "table__cell",
    "budget__table",
    "budget__table__header",
    "table__deleteIcon",
    "table__editIcon",
    "paginations-and-controls",
    // agrega todas las necesarias
  ],
  plugins: [],
};

