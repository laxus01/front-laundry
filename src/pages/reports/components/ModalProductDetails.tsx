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
import { AttentionDateRangeProduct } from '../../../interfaces/interfaces';
import dayjs from 'dayjs';

interface ModalProductDetailsProps {
  open: boolean;
  onClose: () => void;
  products: AttentionDateRangeProduct[];
  vehiclePlate: string;
}

export const ModalProductDetails: React.FC<ModalProductDetailsProps> = ({
  open,
  onClose,
  products,
  vehiclePlate,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const totalValue = products.reduce((sum, product) => sum + (product.saleValue * product.quantity), 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            Detalle de Productos - Vehículo {vehiclePlate}
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
        {products.length === 0 ? (
          <Typography variant="body1" textAlign="center" py={4}>
            No hay productos registrados para este vehículo
          </Typography>
        ) : (
          <>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Producto</strong></TableCell>
                    <TableCell align="center"><strong>Cantidad</strong></TableCell>
                    <TableCell align="right"><strong>Precio Unitario</strong></TableCell>
                    <TableCell align="right"><strong>Total</strong></TableCell>
                    <TableCell align="center"><strong>Fecha</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow key={`${product.id}-${index}`} hover>
                      <TableCell>{product.product}</TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="medium">
                          {product.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {formatPrice(product.saleValue)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium" color="success.main">
                          {formatPrice(product.saleValue * product.quantity)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" color="text.secondary">
                          {dayjs(product.saleCreateAt).format('DD/MM/YYYY')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box mt={2} p={2} bgcolor="primary.main" color="white" borderRadius={1}>
              <Typography variant="h6" textAlign="center">
                Total: {formatPrice(totalValue)}
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
