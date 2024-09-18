import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Footer from '../components/footer'
import Header from '../components/header'
import theme from '../utils/theme'
import '../utils/i18n'
import '../styles/globals.css'


export default function MyApp ({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Header/>
      <Component {...pageProps} />
      <Footer/>
    </ThemeProvider>
  )
}
