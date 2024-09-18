import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'


export default function Header () {
  const { t } = useTranslation()

  return <Box sx={{
    px: 2,
    color: 'white',
    position: 'relative',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundImage: 'url(/justicestatue_bg.png)',
    height: 400,
  }}>
    <Box sx={{
      pt: 2,
      height: 150,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '30px 50%',
      backgroundImage: 'url(/Logo.png)'
    }}>

    </Box>
    <Typography
      sx={{
        my: 2,
        textAlign: 'center'
      }}
      variant='h4'
      gutterBottom
    >
      {t('siteHeader')}
    </Typography>
    <Typography
      sx={{
        my: 3,
        textAlign: 'center',
        fontStyle: 'oblique'
      }}
      variant='body1'
      gutterBottom
    >
      {t('siteSubHeader')}
    </Typography>
  </Box>
}
