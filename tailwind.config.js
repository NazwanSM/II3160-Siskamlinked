/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        siskam: {
          green: '#2E7D32',    // Hijau Hansip
          lightGreen: '#4CAF50',
          brown: '#795548',    // Coklat Kayu/Pos Ronda
          lightBrown: '#D7CCC8',
          bg: '#F1F8E9'        // Background cerah kehijauan
        }
      }
    },
  },
  plugins: [],
}