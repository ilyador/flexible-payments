import { useState } from 'react'
import axios from 'axios'
import Button from '@mui/material/Button'
import SyncIcon from '@mui/icons-material/Sync'
import Response from './response'


export default function CashCheckoutForm ({ customer }) {
  const [processingState, setProcessingState] = useState(null)
  const [response, setResponse] = useState(null)
  const { t } = useTranslation()

  async function handleClick () {
    setResponse(null)
    setProcessingState('loading')

    try {
      const res = await axios.post('/api/chronhooks/create', { customer })
      setProcessingState('success')
      setResponse('Invoices created successfully')
    }

    catch (error) {
      console.log(error.message)
      setProcessingState('error')
      setResponse(error.message)
    }
  }


  return (<>
    <Button
      sx={{ mt: 4 }}
      fullWidth
      variant='contained'
      color='primary'
      type='submit'
      disabled={(processingState === 'success') || (processingState === 'loading')}
      onClick={handleClick}
      endIcon={(processingState === 'loading') &&
        <SyncIcon sx={{ animation: 'rotating 2s linear infinite' }}/>
      }
    >
      {t('payCash')}
    </Button>
    <Response response={response} severity={processingState}/>
  </>)
}