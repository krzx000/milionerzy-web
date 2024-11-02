/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "text-glowing": "glowing 3s infinite linear",
      },
    },
  },
  plugins: [],
};
