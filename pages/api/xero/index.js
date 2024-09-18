import axios from 'axios'
import { format } from 'date-fns'
import { updateFields } from '../jotform'
import getHeaders from './_refresh-token'
import { date_format } from '../../../utils/date'


const xero_base_URL = 'https://api.xero.com/api.xro/2.0/'


export async function createInvoices (submissionId, customer) {
  const {
    payorFirst,
    payorLast,
    clientFull,
    email,
    phone,
    xeroCustomer,
    xeroPayments,
    optionalContact,
    xeroFieldIndex
  } = customer


  try {
    const _xeroCustomer = xeroCustomer ||
      await createXeroCustomer(submissionId, payorFirst, payorLast, email, phone, optionalContact, xeroFieldIndex)

    const headers = await getHeaders()
    if (!headers) throw new Error('no token!')

    const url = xero_base_URL + 'Invoices'

    const invoices = xeroPayments.map(({ dueDate, lineItems }) => ({
      'Type': 'ACCREC',
      'Status': 'AUTHORISED',
      'Reference': clientFull,
      'Contact': {
        'ContactID': _xeroCustomer
      },
      'DueDate': dueDate,
      'LineItems': lineItems
    }))

    const response = await axios.post(url, { invoices }, { headers })

    const _invoices =  response.data.Invoices.map(({ InvoiceID,InvoiceNumber }) => ({
      InvoiceID,
      InvoiceNumber
    }))

    return _invoices
  }

  catch (error) {
    console.log(error)
    throw new Error('Create invoices failed ' + error)
  }
}


export async function createXeroCustomer (submissionId, payorFirst, payorLast, email, phone, optionalContact, xeroFieldIndex) {
  try {
    const headers = await getHeaders()
    if (!headers) throw new Error('No Xero token!')

    const data = {
      'Name': payorFirst + ' ' + payorLast,
      'FirstName': payorFirst,
      'LastName': payorLast,
      'EmailAddress': email,
      'PhoneAreaCode': phone.area,
      'PhoneNumber': phone.number
    }

    if (optionalContact) data['ContactPersons'] = optionalContact

    const contact = await axios.post(xero_base_URL + 'Contacts', data, { headers })
    const xeroCustomer = contact.data.Contacts[0].ContactID

    await updateFields(submissionId, `submission[${xeroFieldIndex}]`, xeroCustomer)

    return xeroCustomer
  }

  catch (error) {
    throw new Error('Creating contact failed: ' + error)
  }
}

export async function getInvoices(xeroCustomer){
  try {
    const url = xero_base_URL + 'Invoices?ContactIDs=' + xeroCustomer
    const headers = await getHeaders()

    const response = await axios.get(url, { headers })
    const xeroInvoices = response.data.Invoices

    const payments = xeroInvoices
      .filter(invoice => invoice.Status === 'AUTHORISED')
      .map(invoice => ({
        dueDate: format(new Date(invoice.DueDateString), date_format),
        amount: invoice.AmountDue
      }))

    return { xeroInvoices, payments }
  }

  catch (error) {
    throw new Error('Error getting invoices: ' + error)
  }
}


export async function getInvoice (xeroInvoice) {
  try {
    const url = xero_base_URL + 'Invoices/' + xeroInvoice
    const headers = await getHeaders()

    const response = await axios.get(url, { headers })

    return response.data.Invoices[0]
  }

  catch (error) {
    console.log(error)
    throw new Error('Getting invoice failed: ' + error)
  }
}


export async function isInvoiceValid (xeroInvoiceID) {
  try {
    const headers = await getHeaders()
    if (!headers) throw new Error('No Xero token!')

    const url = xero_base_URL + 'Invoices/' + xeroInvoiceID

    const contact = await axios.get(url, { headers })

    return contact.data.Invoices[0].Status === 'AUTHORISED'
  }

  catch (error) {
    console.log('Is-invoice-valid failed: ' + error)
    throw new Error('Is-invoice-valid failed: ' + error)
  }
}


export async function markInvoicePaid (xeroInvoiceID, amount) {
  try {
    const headers = await getHeaders()
    if (!headers) throw new Error('No Xero token!')

    const url = xero_base_URL + 'Payments/'

    const data = {
      Invoice: { InvoiceID: xeroInvoiceID },
      Account: { AccountID: process.env.XERO_ACCOUNT_ID },
      Date: format(new Date(), date_format),
      Amount: amount
    }

    const contact = await axios.post(url, data, { headers })

    return contact.data
  }

  catch (error) {
    console.log(error?.response?.data.Elements[0])
    throw new Error('Marking invoice paid failed: ' + error)
  }
}


export async function getContact (contactId) {
  try {
    const headers = await getHeaders()
    if (!headers) throw new Error('no token!')

    const url = xero_base_URL + 'Contacts/' + contactId

    const contact = await axios.get(url, { headers })

    return contact.data.Contacts
  }

  catch (error) {
    throw new Error('get contact failed ' + error)
  }
}
