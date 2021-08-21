import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

const fonts = { mono: `'Menlo', monospace` }

const breakpoints = createBreakpoints({
  xxs: '21em', // Iphone SE
  xs: '30em', // Iphone SE
  sm: '40em', // Iphone 6 typ
  md: '52em',
  lg: '64em',
  xl: '80em',
  xxl: '120em', // 1920px
  xxxl: '160em', // 2560px
})

const theme = extendTheme({
  useSystemColorMode: false,
  initialColorMode: 'dark',
  colors: {
    black: '#16161D',
    offwhite: '#f8f8ff',
    brand: {
      100: '#2d3748',
      200: '#93D0CC',
      300: '#3CAB70',
      400: '#fab7bf',
      500: '#f1b2a5',
      600: '#e8ae8b',
      700: '#dfaa72',
    },
  },
  fonts,
  breakpoints,
  icons: {
    logo: {
      path: (
        <svg
          width="3000"
          height="3163"
          viewBox="0 0 3000 3163"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="3000" height="3162.95" fill="none" />
          <path
            d="M1470.89 1448.81L2170 2488.19H820V706.392H2170L1470.89 1448.81ZM1408.21 1515.37L909.196 2045.3V2393.46H1998.84L1408.21 1515.37Z"
            fill="currentColor"
          />
        </svg>
      ),
      viewBox: '0 0 3000 3163',
    },
  },
})

export default theme
