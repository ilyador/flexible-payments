import Alert from '@mui/material/Alert'


export default function Response ({ response, severity }) {
  if (!response) return null

  return (
    <Alert sx={{ mt: 4 }} variant='filled' severity={severity}>
      {response}
    </Alert>
  )
}
