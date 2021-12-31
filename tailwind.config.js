const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        orange: '#ee6c34',
        blue: '#02779d',
        grey: '#626565',
      },
      padding: {
        large: '30px',
        small: '20px',
      },
      paddingBottom: {
        large: '30px',
        small: '20px',
      },
      fontFamily: {
        sans: ['Karla', 'Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/line-clamp')],
  important: true,
}
