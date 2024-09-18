import { Fragment } from 'react'
import { format } from 'date-fns'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'


export default function PaymentsBreakdown ({ fees, payments, governmentFiling }) {
  const { t } = useTranslation()

  return (<>
    <Paper
      variant='outlined'
      sx={{ p: 2 }}
    >
      <Grid container spacing={1}>
        {!!fees.totalFees && <>
          <Grid xs={9} sx={{ mb: 1 }}>
            <Typography variant='h6'>
              {t('totalFees')}
            </Typography>
          </Grid>
          <Grid xs={3}>
            <Typography variant='h6' align='right'>
              ${fees.totalFees}
            </Typography>
          </Grid>
        </>}
        {!!fees.attorneysFees && <>
          <Grid xs={1}></Grid>
          <Grid xs={8}>
            <Typography variant='h6' sx={{ fontWeight: 400 }}>
              {t('attorneysFees')}
            </Typography>
          </Grid>
          <Grid xs={3}>
            <Typography variant='h6' align='right' sx={{ fontWeight: 400 }}>
              ${fees.attorneysFees}
            </Typography>
          </Grid>
        </>}
        {!!fees.adminFees && <>
          <Grid xs={1}></Grid>
          <Grid xs={8}>
            <Typography variant='h6' sx={{ fontWeight: 400 }}>
              {t('adminFees')}
            </Typography>
          </Grid>
          <Grid xs={3}>
            <Typography variant='h6' align='right' sx={{ fontWeight: 400 }}>
              ${fees.adminFees}
            </Typography>
          </Grid>
        </>}
      </Grid>

      {payments &&
        <TableContainer
          component={Paper}
          variant='outlined'
          sx={{ mt: 3 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='left'>{t('paymentPlan')}</TableCell>
                <TableCell align='right'>{`${payments.length} ${t('payments')}`}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align='left'>
                    {index + 1}
                    <span>.&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    {format(new Date(row.dueDate.replaceAll('-', '/')), 'MM/dd/yyyy')}
                  </TableCell>
                  <TableCell align='right'>${row.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>}
    </Paper>

    {!!governmentFiling &&
      <Paper
        variant='outlined'
        sx={{ p: 2, my: 2 }}
      >
        <Grid container spacing={1}>
          <Grid xs={9}>
            <Typography variant='h6' sx={{ fontWeight: 400 }}>
              {t('governmentFiling')}
            </Typography>
          </Grid>
          <Grid xs={3}>
            <Typography variant='h6' align='right' sx={{ fontWeight: 400 }}>
              ${governmentFiling}
            </Typography>
          </Grid>
        </Grid>
      </Paper>}
  </>)
}