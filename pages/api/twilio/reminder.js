import NextCors from 'nextjs-cors'
import { isInvoiceValid } from '../xero'
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


const text = {
  English: (amount, dueDate) => `From The Vinesh Patel Law Firm: You have a payment of $${amount} due on ${dueDate}. If we have your card information on file, we will charge it automatically.  If you need any assistance, call 214-272-8523`,
  Spanish: (amount, dueDate) => `Del bufete de abogados Vinesh Patel: Tiene un pago de $${amount} que vence el ${dueDate}. Si tenemos la información de su tarjeta registrada, la cargaremos automáticamente. Si necesita ayuda, llame al 214-272-8523.`
}


export default async function handler (req, res) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200
  })

  const { to, language, amount, dueDate, xeroInvoiceID } = req.body

  const invoiceValid = await isInvoiceValid(xeroInvoiceID)

  if (!invoiceValid) {
    res.send({ status: 'invoice cancelled' })
    return
  }

  try {
    const _response = await client.messages.create({
      from: TWILIO_PHONE_NUMBER,
      to,
      body: text[language](amount, dueDate)
    })

    console.log(_response)
    res.send({ status: 'GREAT SUCCESS' })
  }

  catch (error) {
    console.log(error)
    res
      .status(error?.response?.status || 500)
      .json(error?.response?.data || error.message)
  }
}
