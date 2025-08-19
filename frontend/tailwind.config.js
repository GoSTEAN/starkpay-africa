/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        customSpin: {
          "0%": { transform: "rotate(137.29deg)" },
          "100%": { transform: "rotate(497.29deg)" },
        },
      },
      colors: {
         background: "var(--background)",
        text: "var(--text-color)",
        primary: "var(--primary-color)",
      },
      animation: {
        customSpin: "customSpin 10s linear infinite",
      },
    },
  },
};
