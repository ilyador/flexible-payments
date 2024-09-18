import axios from 'axios'
import { addMonths, format } from 'date-fns'
import { date_format } from '../../../utils/date'


const jotformAPI = {
  form_id: process.env.JOTFORM_FORM_ID,
  key: process.env.JOTFORM_KEY
}

const base_URL = 'https://api.jotform.com/'


export async function getCustomer (submissionId) {
  try {
    const customers = await axios.get(`${base_URL}form/${jotformAPI.form_id}/submissions?apiKey=${jotformAPI.key}`)

    const customer = customers.data.content.find(client => client.id === submissionId)
    if (!customer) throw new Error('Customer does not exist')

    const answers = Object.values(customer.answers).map(answer => answer)
    const getField = fieldName => answers.find(field => field.name === fieldName)?.answer || ''


    const schedulePayments = getField('schedulePayments').toLowerCase() === 'yes'
    const optionalContact = getField('optionalContact')

    const customerData = {
      schedulePayments,
      language: getField('language'),
      clientFirst: getField('clientFirst'),
      clientLast: getField('clientLast'),
      payorFirst: getField('payorFirst'),
      payorLast: getField('payorLast'),
      clientFull: getField('clientlastfirst'),
      payorFull: getField('payorFull'),
      email: getField('payorEmail'),
      phone: {
        area: getField('payorPhoneArea'),
        number: getField('payorPhoneNumber')
      },
      cashPayment: getField('paymentMethod').toLowerCase() === 'cash/check',
      existingInvoices: getField('existing').toLowerCase() === 'yes',
      revenueCategory: getField('revenueCategoryhidden'),
      description: getField('service'),
      adminFees: Number(getField('adminFees')),
      totalFees: Number(getField('totalFees')),
      downPayment: Number(getField('downPayment')),
      attorneysFees: Number(getField('attorneysFees')),
      firstAttorneyFee: Number(getField('firstAttorneyfee')),
      governmentFiling: getField('governmentFiling'),
      service: getField('service'),
      xeroCustomer: getField('payorId'),
      stripeCustomer: getField('stripeCustomer'),
      xeroFieldIndex: Object.keys(customer.answers).find(key => customer.answers[key].name === 'payorId'),
      stripeFieldIndex: Object.keys(customer.answers).find(key => customer.answers[key].name === 'stripeCustomer'),
      specialNote: getField('specialNote')
    }


    if (optionalContact) {
      customerData.optionalContact = optionalContact
    }


    const today = format(new Date(), date_format)

    const firstPayment = { dueDate: today, amount: customerData.adminFees + customerData.firstAttorneyFee }

    let _payments = []


    if (schedulePayments) {
      const monthlyPayment = Number(getField('monthlyPayment'))
      const numberOfPayments = Number(getField('number10'))

      for (let i = 0; i < numberOfPayments; i++) {
        const dueDate = format(addMonths(new Date(), i + 1), date_format)

        _payments[i] = {
          dueDate,
          amount: monthlyPayment
        }
      }
    }

    else {
      const paymentDates = answers
        .filter(field =>
          field.answer &&
          typeof field.answer === 'object' &&
          'datetime' in field.answer &&
          field?.name?.includes('payment')
        )
        .map(date => format(new Date(date.answer.datetime), date_format))

      const paymentAmounts = answers
        .filter(field => field.answer && field?.name?.includes('paymentAmount'))
        .map(amount => Number(amount.answer))

      _payments = paymentDates.map((date, index) => {
        return {
          dueDate: date,
          amount: paymentAmounts[index]
        }
      })
    }


    customerData.payments = [firstPayment, ..._payments]


    customerData.xeroPayments = customerData.payments.map((payment, index) => {
      return {
        dueDate: payment.dueDate,
        lineItems: !index ? [
          {
            'AccountCode': '4101',
            'UnitAmount': customerData.adminFees,
            'Description': customerData.description
          }, {
            'AccountCode': customerData.revenueCategory,
            'UnitAmount': customerData.firstAttorneyFee,
            'Description': `${customerData.description} for ${customerData.clientFull}`
          }
        ] : [
          {
            'AccountCode': customerData.revenueCategory,
            'UnitAmount': payment.amount,
            'Description': `${customerData.description} for ${customerData.clientFull}`
          }
        ]
      }
    })


    return customerData
  }

  catch (error) {
    console.log('Jotform error: ', error)
  }
}


export function updateFields (submissionId, field, value) {
  const data = new URLSearchParams()
  data.append(field, value)

  return axios.post(`${base_URL}submission/${submissionId}?apiKey=${jotformAPI.key}`, data)
}
