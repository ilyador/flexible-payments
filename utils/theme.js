import { Roboto } from 'next/font/google'
import { createTheme } from '@mui/material/styles'


export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif']
})

const theme = createTheme({
  palette: {
    primary: {
      main: '#8a6634'
    },
    secondary: {
      main: '#000d42'
    },
    background: {
      default: "#e9edf1"
    }
  },
  typography: {
    fontFamily: roboto.style.fontFamily
  }
})

export default theme