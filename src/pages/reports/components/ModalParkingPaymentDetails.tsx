import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ParkingDateRangePayment } from '../../../interfaces/interfaces';
import dayjs from 'dayjs';

interface ModalParkingPaymentDetailsProps {
  open: boolean;
  onClose: () => void;
  payments: ParkingDateRangePayment[];
  vehiclePlate: string;
  parkingType: string;
}

export const ModalParkingPaymentDetails: React.FC<ModalParkingPaymentDetailsProps> = ({
  open,
  onClose,
  payments,
  vehiclePlate,
  parkingType,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const totalValue = payments.reduce((sum, payment) => sum + payment.value, 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            Detalle de Pagos - Vehículo {vehiclePlate} ({parkingType})
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {payments.length === 0 ? (
          <Typography variant="body1" textAlign="center" py={4}>
            No hay pagos registrados para este parqueo
          </Typography>
        ) : (
          <>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Fecha</strong></TableCell>
                    <TableCell><strong>Detalle</strong></TableCell>
                    <TableCell align="right"><strong>Valor</strong></TableCell>
                    <TableCell align="center"><strong>Fecha Registro</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment, index) => (
                    <TableRow key={`${payment.id}-${index}`} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {dayjs(payment.date).format('DD/MM/YYYY')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {payment.detail}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium" color="success.main">
                          {formatPrice(payment.value)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {dayjs(payment.createAt).format('DD/MM/YYYY HH:mm')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box mt={2} p={2} bgcolor="primary.main" color="white" borderRadius={1}>
              <Typography variant="h6" textAlign="center">
                Total Pagado: {formatPrice(totalValue)}
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
