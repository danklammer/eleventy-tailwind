module.exports = {
  content: ["./src/**/*.{html,js,liquid,md}"],
  prefixer: false,
  darkMode: 'media', // or 'class'
  theme: {
    fontFamily: {
      sans: ['Avenir Next', 'Avenir', 'Segoe UI', 'Helvetica', 'helvetica', 'sans-serif'],
    },
    extend: {
      colors: {
        blueberry: {
          light: '#85d7ff',
          DEFAULT: '#1fb6ff',
          dark: '#009eeb',
        }
      }
    }
  }
}