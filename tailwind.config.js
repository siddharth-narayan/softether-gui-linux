/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js}", "./*.{html,js}"],
  darkMode: "class",
  theme: {
    extend: {
      width: {
        128: "32rem",
        192: "48rem"

      },

      height: {
        256: "64rem",
        192: "48rem"
      }
    },
  },
  plugins: [],
};
