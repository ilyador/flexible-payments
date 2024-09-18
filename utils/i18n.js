import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      siteHeader: 'You have an immigration issue\nWe want to help',
      siteSubHeader: 'Here\'s a snapshot of what we can do for you and what it will cost',
      specialNote: 'Special note from the attorney',
      services: 'Services',
      fees: 'Fees',
      firmFees: 'Fees to Law Firm ',
      attorneysFees: 'Attorney Fees',
      adminFees: 'Administrative Fee',
      totalFees: 'Total Fees Payable to Law Firm',
      paymentPlan: 'Payment Plan',
      payments: 'payments',
      governmentFiling: 'Government Filing Fee',
      readyHire: 'If you’re ready to hire, review the agreement by clicking below.',
      hireButton: 'Fee Agreement',
      support: 'Support',
      callUs: 'Call Us Now',
      watchVideo: 'Watch Video Tutorial',
      review: 'Review and sign the agreement',
      reviewFull: 'Review the agreement. Then press Start and Sign.',
      setupPayment: 'Set-up payment',
      payment: 'Make A Payment To Start The Case',
      paymentFull: 'Make your first payment and enroll in automatic card payments.',
      pay: 'Pay',
      payLater: 'Save for future invoices',
      payCash: 'Pay with cash'
    }
  },
  es: {
    translation: {
      siteHeader: 'Tienes un problema de inmigración\nQueremos ayudar',
      siteSubHeader: 'Estas son nuestras honorarios y servicios',
      specialNote: 'Nota especial del abogado',
      services: 'Servicios',
      fees: 'Pagos',
      firmFees: 'Honorarios a Nosotros',
      attorneysFees: 'Honorarios Del Abogado',
      adminFees: 'Honorario Administrativo',
      totalFees: 'Honorarios Totales a Pagarnos',
      paymentPlan: 'Plan de Pago',
      payments: 'pagos',
      governmentFiling: 'Tarifas de Presentación Del Gobierno',
      readyHire: 'Si está listo para contratar, revise el acuerdo haciendo clic a continuación.',
      hireButton: 'Contrato de Honorarios',
      support: 'Atención al cliente',
      callUs: 'Llamanos',
      watchVideo: 'Ver Videotutorial',
      review: 'Revise y firme el acuerdo',
      reviewFull: 'Revisa el acuerdo. Luego presione Iniciar y Firmar.',
      setupPayment: 'Hacer el pago',
      payment: 'Hacer Un Pago Para Iniciar El Caso',
      paymentFull: 'Realiza tu primer pago e inscríbete en pagos automáticos con tarjeta.',
      pay: 'Pagar',
      payLater: 'Guardar para futuras facturas',
      payCash: 'pagar en efectivo'
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
