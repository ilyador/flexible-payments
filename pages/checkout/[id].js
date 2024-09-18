import { useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useTranslation } from 'react-i18next'
import PaymentsBreakdown from '../../components/payments-breakdown'
import { getCustomer, updateFields } from '../api/jotform'
import { getInvoices } from '../api/xero'
import CheckoutForm from '../../components/checkout-form'
import CashCheckoutForm from '../../components/cash-checkout-form'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

export default function Checkout ({ customer, setupIntent, payments }) {
  const { t, i18n } = useTranslation()

  const {
    language,
    adminFees,
    attorneysFees,
    governmentFiling,
    totalFees
  } = customer

  useEffect(() => {
    if (language === 'Spanish') {
      i18n.changeLanguage('es')
    }
  }, [])

  return (
    customer ?
      <Container maxWidth='md' sx={{ my: 8 }}>
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant='h4'
              display='block'
              gutterBottom
            >
              {t('fees')}
            </Typography>
            <Typography
              variant='h5'
              display='block'
              gutterBottom
            >
              {t('payment')}
            </Typography>
            <Typography
              variant='body1'
              display='block'
              gutterBottom
            >
              {t('paymentFull')}
            </Typography>
          </Box>
          <PaymentsBreakdown
            payments={payments}
            fees={{ adminFees, attorneysFees, totalFees }}
            governmentFiling={governmentFiling}
          />
          {setupIntent ?
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: setupIntent.client_secret,
                locale: (language === 'Spanish') ? 'es-419' : 'en'
              }}>
              <CheckoutForm customer={customer}/>
            </Elements> : <CashCheckoutForm customer={customer}/>}
        </Box>
      </Container> :
      <Typography variant='h4' gutterBottom component='h4'>
        No Customer
      </Typography>
  )
}


async function createStripeCustomer (email, name, submissionId, stripeFieldIndex) {
  const customerResponse = await stripe.customers.create({ email, name })
  const customerId = customerResponse.id
  const _res = await updateFields(submissionId, `submission[${stripeFieldIndex}]`, customerId)

  return Promise.all([customerId, _res])
}


export async function getServerSideProps (context) {
  let customer
  const { id: submissionId } = context.query

  try {
    customer = await getCustomer(submissionId)
    const {
      email,
      payorFull,
      stripeFieldIndex,
      stripeCustomer,
      cashPayment,
      existingInvoices,
      xeroCustomer
    } = customer

    customer.submissionId = submissionId

    if (cashPayment) {
      return { props: { customer } }
    }

    if (!stripeCustomer) {
      const _stripeCustomer = await createStripeCustomer(email, payorFull, submissionId, stripeFieldIndex)
      customer.stripeCustomer = _stripeCustomer[0]
    }

    if (existingInvoices) {
      const _res = await getInvoices(xeroCustomer)
      customer.payments = _res.payments
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.stripeCustomer,
      payment_method_types: ['card']
    })

    return {
      props: { customer, setupIntent, payments: customer.payments }
    }
  }

  catch (error) {
    console.log(error)
  }
}
