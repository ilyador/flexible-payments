import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Cormorant_Garamond } from 'next/font/google'


const cormorant = Cormorant_Garamond({
  weight: '400',
  subsets: ['latin']
})



export default function Footer () {
  return (
    <footer className={cormorant.className}>
      <Box sx={{
        position: 'relative',
        mt: 4,
        p: 2,
        bgcolor: '#c1c9d6'
      }}>
        <Typography variant='overline' align='center' display='block'>
          The Vinesh Patel Law Firm PLLC | 2023
        </Typography>
        <Box
          component='a'
          href='https://www.codeforhumans.dev'
          sx={{
            height: 22,
            display: 'inline-block',
            position: {
              xs: 'static',
              sm: 'absolute'
            },
            right: 30,
            top: '27%',
            pr: 4,
            ml: {
              xs: 8,
              sm: 0
            },
            mt: {
              xs: 1,
              sm: 0
            },
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '100% 50%',
            backgroundImage: 'url(/CFH-logo.png)'
          }}>
          <Typography variant='overline' align='center'>
            Built by&nbsp;&nbsp;
          </Typography>
          <Box sx={{ fontSize: 23, display: 'inline', lineHeight: 1 }}>
            Code For Humans
          </Box>
        </Box>
      </Box>
    </footer>
  )
}
