import { useState } from 'react'
import axios from 'axios'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import SyncIcon from '@mui/icons-material/Sync'
import { useTranslation } from 'react-i18next'
import Response from './response'


export default function CheckoutForm ({ customer }) {
  const [processingState, setProcessingState] = useState(null)
  const [response, setResponse] = useState(null)
  const stripe = useStripe()
  const elements = useElements()
  const { t } = useTranslation()

  const {
    existingInvoices,
    downPayment
  } = customer

  async function subscribe (event) {
    event.preventDefault()
    if (!stripe || !elements) return

    setResponse(null)
    setProcessingState('loading')

    try {
      const { error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: process.env.NEXT_PUBLIC_DOMAIN_URL + '/checkout/success'
        },
        redirect: 'if_required'
      })

      if (error) {
        throw new Error('Stripe payment failed: ' + error.message)
      }

      const _invoices = await axios.post('/api/chronhooks/create', { customer })
      console.log(_invoices)

      setProcessingState('success')
      setResponse('Subscription was successful')
    }

    catch (error) {
      console.log(error.message)
      setProcessingState('error')
      setResponse(error.message)
    }
  }

  const stripeOptions = {
    style: {
      base: {
        fontSize: '16px',
        fontFamily: 'Roboto, sans-serif'
      }
    }
  }


  return (<>
    <Box sx={{ mt: 6 }} component='form' onSubmit={subscribe}>
      <PaymentElement/>
      <Button
        sx={{ mt: 4 }}
        fullWidth
        variant='contained'
        color='primary'
        type='submit'
        disabled={!stripe || !elements || (processingState === 'success') || (processingState === 'loading')}
        endIcon={(processingState === 'loading') &&
          <SyncIcon sx={{ animation: 'rotating 2s linear infinite' }}/>
        }
      >
        {existingInvoices ? t('payLater') : `${t('pay')} $${downPayment}`}
      </Button>
    </Box>
    <Response response={response} severity={processingState}/>
  </>)
}