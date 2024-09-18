import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'


export default function Home () {
  const [submissionId, setSubmissionId] = useState('')
  const router = useRouter()

  function handleSubmit (event) {
    event.preventDefault()
    router.push('signature/' + submissionId)
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 6, mb: 40 }}>
      <Box
        component='form'
        onSubmit={handleSubmit}
        noValidate
        autoComplete='off'
      >
        <Typography variant='h5' gutterBottom>
          Enter Jotform submission ID
        </Typography>
        <TextField
          sx={{ bgcolor: 'background.paper' }}
          label='Submission ID'
          variant='outlined'
          fullWidth
          value={submissionId}
          onChange={(event) => { setSubmissionId(event.target.value)}}
        />
        <Button
          sx={{ mt: 4 }}
          fullWidth
          variant='contained'
          color='primary'
          type='submit'
        >
          Start
        </Button>
      </Box>
    </Container>
  )
}
