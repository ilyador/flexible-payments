import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { getCustomer } from '../api/jotform/index'
import { useTranslation } from 'react-i18next'
import PaymentsBreakdown from '../../components/payments-breakdown'
import Link from 'next/link'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import axios from 'axios'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'


const eversignAPI = {
  access_key: process.env.EVERSIGN_ACCESS_KEY,
  business_id: process.env.EVERSIGN_BUSINESS_ID,
  sandbox: process.env.EVERSIGN_SANDBOX,
  template_id: {
    English: process.env.EVERSIGN_TEMPLATE_ENGLISH,
    Spanish: process.env.EVERSIGN_TEMPLATE_SPANISH
  }
}

const API_URL = 'https://api.eversign.com/api/document/'


export default function Signature ({ iframeUrl, submissionId, customer }) {
  const [docSigned, setDocSigned] = useState(false)
  const { t, i18n } = useTranslation()

  const {
    language,
    adminFees,
    attorneysFees,
    governmentFiling,
    totalFees,
    service,
    payments,
    specialNote
  } = customer

  useEffect(() => {
    if (language === 'Spanish') {
      i18n.changeLanguage('es')
    }
  }, [])


  useEffect(() => {
    const handleSign = (event) => {
      if (event.data === 'event_signed') {
        setDocSigned(true)
      }

      if (event.data === 'event_declined' || event.data === 'event_error') {
        console.log('error signing')
      }
    }

    window.addEventListener('message', handleSign, false)

    return () => {
      window.removeEventListener('message', handleSign)
    }
  }, [])


  return (
    <Container maxWidth='md'>
      <Box sx={{ my: 8 }}>
        {!!specialNote && <Paper
          variant='outlined'
          sx={{ p: 4, mb: 5 }}
        >
          <Typography variant='h5' align='center' display='block' gutterBottom>
            {t('specialNote')}
          </Typography>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{
              flex: {
                xs: '0 0 75px',
                sm: '0 0 150px'
              },
              mr: 2,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '0 0',
              backgroundImage: 'url(/VG_circle.svg)'
            }}></Box>
            <Typography
              sx={{
                flex: 1,
                pt: 4,
                fontStyle: 'oblique',
                backgroundSize: '90px',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '0 -6px',
                backgroundImage: 'url(/QuoteMark_1.svg)'
              }}
              variant='body1'
            >
              {specialNote}
            </Typography>
          </Box>
        </Paper>}
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          <Typography
            sx={{
              fontWeight: 300,
              fontSize: '1.25rem',
              lineHeight: 1.5
            }}
            align='center'
            variant='overline'
            display='block'
          >
            {t('services')}
          </Typography>
          <Typography
            sx={{ mb:3 }}
            variant='h4'
            display='block'
            align='center'
            gutterBottom
          >
            {service}
          </Typography>
          <PaymentsBreakdown
            payments={payments}
            fees={{ adminFees, attorneysFees, totalFees }}
            governmentFiling={governmentFiling}
          />
        </Box>
        <Box textAlign='center' sx={{ my: 6 }}>
          <Typography
            variant='body1'
            display='block'
            gutterBottom
          >
            {t('readyHire')}
          </Typography>
          <Button
            sx={{ mt: 1, mb: 4 }}
            component={Link}
            scroll={false}
            href='#contract'
            variant='contained'
          >
            {t('hireButton')}
          </Button>
          <Typography
            variant='h5'
            display='block'
            gutterBottom
          >
            {t('support')}
          </Typography>
          <Stack
            sx={{ mb: 4 }}
            direction='row'
            justifyContent='center'
            spacing={2}
          >
            <Button
              component={Link}
              href='tel:2142728523'
              variant='outlined'
            >
              {t('callUs')}
            </Button>
            <Button
              component={Link}
              href=''
              variant='outlined'
            >
              {t('watchVideo')}
            </Button>
          </Stack>
          <Typography
            variant='h5'
            display='block'
            gutterBottom
          >
            {t('review')}
          </Typography>
          <Typography
            variant='body1'
            display='block'
            gutterBottom
          >
            {t('reviewFull')}
          </Typography>
        </Box>
        {iframeUrl &&
          <Box id='contract' sx={{ mt: 4 }}>
            <iframe
              style={{
                margin: '0 auto',
                width: '100%'
              }}
              width='800'
              height='700'
              src={iframeUrl}
            />
          </Box>
        }
        <Stack
          sx={{ mt: 2, mb: 4 }}
          direction='row'
          justifyContent='center'
          spacing={1}
        >
          <Button
            component={Link}
            href={'/checkout/' + submissionId}
            variant='contained'
            disabled={!docSigned}
          >
            {t('setupPayment')}
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}


export async function getServerSideProps (context) {
  let iframeUrl
  let customer
  const { id: submissionId } = context.query

  try {
    customer = await getCustomer(submissionId)

    const {
      payorFull,
      email,
      payments,
      clientFull,
      attorneysFees,
      adminFees,
      governmentFiling,
      service,
      language
    } = customer

    if (customer.existingInvoices) {
      return {
        redirect: {
          permanent: false,
          destination: '/checkout/' + submissionId
        }
      }
    }

    const paymentAmountFields = payments.map((field, index) => ({
      identifier: 'paymentnumber' + (index + 1),
      value: '$' + field.amount
    }))
    const paymentDateFields = payments.map((field, index) => ({
      identifier: 'paymentdate' + (index + 1),
      value: ' due on ' + format(new Date(field.dueDate), 'MMMM d, yyyy')
    }))

    const data = {
      sandbox: eversignAPI.sandbox,
      use_hidden_tags: 1,
      embedded_signing_enabled: 1,
      template_id: eversignAPI.template_id[language],
      signers: [{
        role: 'Payor',
        name: payorFull,
        email: email
      }],
      fields: [{
        identifier: 'clientFull',
        value: clientFull
      }, {
        identifier: 'payorFull',
        value: payorFull
      }, {
        identifier: 'attorneysFees',
        value: attorneysFees
      }, {
        identifier: 'adminFees',
        value: adminFees
      }, {
        identifier: 'totalFees',
        value: attorneysFees + adminFees
      }, {
        identifier: 'governmentFiling',
        value: governmentFiling
      }, {
        identifier: 'service',
        value: service
      },
        ...paymentAmountFields,
        ...paymentDateFields
      ]
    }

    const response = await axios.post(API_URL, data, {
      params: {
        access_key: eversignAPI.access_key,
        business_id: eversignAPI.business_id
      }
    })

    console.log(response.data)

    iframeUrl = response.data.signers[0].embedded_signing_url
  }

  catch (error) {
    iframeUrl = null
    console.log(error)
  }

  return {
    props: { iframeUrl, submissionId, customer }
  }
}
