const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
import NextCors from 'nextjs-cors'
import { isInvoiceValid, markInvoicePaid } from '../xero'


const webhook_url = process.env.WEBHOOK_URL


export default async function payment (req, res) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200
  })

  const {
    xeroInvoiceID,
    xeroInvoiceNumber,
    stripeCustomer,
    clientFull,
    amount
  } = req.body

  try {
    const invoiceValid = await isInvoiceValid(xeroInvoiceID)

    if (!invoiceValid) {
      res.send({ status: 'invoice cancelled' })
      return
    }

    const paidInvoice = await payInvoice(
      clientFull,
      xeroInvoiceID,
      xeroInvoiceNumber,
      stripeCustomer,
      amount
    )
    console.log(paidInvoice)

    res.send({ status: 'GREAT SUCCESS' })
  }

  catch (error) {
    console.log('Stripe hook error: ', error)
    res.status(500).json({ message: error })
  }
}

export async function payInvoice(clientFull, xeroInvoiceID, xeroInvoiceNumber, stripeCustomer, amount){
  const paymentMethods = await stripe.paymentMethods.list({
    customer: stripeCustomer,
    type: 'card'
  })

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: 'usd',
    customer: stripeCustomer,
    payment_method: paymentMethods.data[0].id,
    off_session: true,
    confirm: true,
    metadata: {
      'Xero-invoice': xeroInvoiceNumber,
      'Client name': clientFull
    }
  })

  const paidInvoice = await markInvoicePaid(xeroInvoiceID, amount)

  return paidInvoice
}