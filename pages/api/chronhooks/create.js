import { format, subDays } from 'date-fns'
import { payInvoice } from '../stripe/payment'
import { createInvoices } from '../xero'
import { getInvoices } from '../xero'
import addChronhook from './index'
import { date_format } from '../../../utils/date'


export default async function createHooks (req, res) {

  const {
    clientFull,
    payorFull,
    xeroCustomer,
    stripeCustomer,
    existingInvoices,
    cashPayment,
    submissionId,
    payments,
    phone,
    language
  } = req.body.customer


  let futurePayments = []
  let _xeroInvoices
  let _payments
  let _hooks

  if (existingInvoices) {
    const _res = await getInvoices(xeroCustomer)

    _xeroInvoices = _res.xeroInvoices
    _payments = _res.payments
  }

  else {
    _xeroInvoices = await createInvoices(submissionId, req.body.customer)
    _payments = payments

    if (!cashPayment) {
      const paidInvoice = await payInvoice(
        clientFull,
        _xeroInvoices[0].InvoiceID,
        _xeroInvoices[0].InvoiceNumber,
        stripeCustomer,
        _payments[0].amount
      )
      console.log(paidInvoice)
    }

    _xeroInvoices.shift()
    _payments.shift()
  }


  for (let i = 0; i < _payments.length; i++) {
    futurePayments[i] = {
      xeroInvoiceID: _xeroInvoices[i].InvoiceID,
      xeroInvoiceNumber: _xeroInvoices[i].InvoiceNumber,
      dueDate: _payments[i].dueDate,
      amount: _payments[i].amount
    }
  }


  try {
    const _reminderHooks = futurePayments.map(({ xeroInvoiceID, xeroInvoiceNumber, dueDate, amount }) => {
      return addChronhook(
        `reminder-${xeroInvoiceID}-dueDate`,
        '/api/twilio/reminder',
        {
          clientFull,
          payorFull,
          xeroInvoiceID,
          xeroInvoiceNumber,
          to: `+1-${phone.area}-${phone.number}`,
          language,
          amount,
          dueDate: format(new Date(dueDate), 'PPP')
        },
        format(subDays(new Date(dueDate), 7), date_format))
    })

    _hooks = _reminderHooks

    if (!cashPayment) {
      const _paymentHooks = futurePayments.map(({ xeroInvoiceID, xeroInvoiceNumber, dueDate, amount }) => {
        return addChronhook(
          `payment-${xeroInvoiceID}-${dueDate}`,
          '/api/stripe/payment',
          {
            clientFull,
            payorFull,
            xeroInvoiceID,
            xeroInvoiceNumber,
            stripeCustomer,
            amount
          },
          dueDate)
      })

      _hooks = [..._paymentHooks, ..._reminderHooks]
    }

    const response = await Promise.all(_hooks)
    response.map(item => console.log(item.data.jobId))

    res.send({ xeroInvoices: _xeroInvoices })
  }

  catch (error) {
    console.log(error)
    res.status(500).json({ message: error })
  }
}
