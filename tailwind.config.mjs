/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFA500',
        'primary-light': '#FFB733', // A lighter shade of primary for hover states
        complementary: '#005B96',
        accent: '#89CFF0',
        neutral: {
          light: '#F5F5F5',
          DEFAULT: '#FFFFFF',
          dark: '#333333',
        },
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.6s ease-out",
      },
    },
  },
  plugins: [],
};
