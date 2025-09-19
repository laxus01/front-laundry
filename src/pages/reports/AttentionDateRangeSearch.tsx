import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import DateRangeIcon from '@mui/icons-material/DateRange';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { AttentionDateRange } from '../../interfaces/interfaces';
import { getAttentionsByDateRange } from './services/AttentionDateRangeSearch.services';
import DatePickerComponent from '../../components/DatePickerComponent';
import { ModalServiceDetails } from './components/ModalServiceDetails';
import { ModalProductDetails } from './components/ModalProductDetails';

export const AttentionDateRangeSearch: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [attentions, setAttentions] = useState<AttentionDateRange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedAttention, setSelectedAttention] = useState<AttentionDateRange | null>(null);

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setError('Por favor selecciona ambas fechas');
      return;
    }

    if (startDate > endDate) {
      setError('La fecha inicial no puede ser mayor que la fecha final');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      const response = await getAttentionsByDateRange(formattedStartDate, formattedEndDate);
      
      if (response && response.data) {
        setAttentions(response.data);
        if (response.data.length === 0) {
          setError('No se encontraron atenciones para el rango de fechas seleccionado');
        }
      } else {
        setError('No se encontraron datos para los criterios seleccionados');
      }
    } catch (error) {
      console.error('Error fetching attentions:', error);
      setError('Error al obtener las atenciones. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const calculateServiceTotal = (attention: AttentionDateRange) => {
    return attention.saleServices.reduce((sum, service) => sum + service.value, 0);
  };

  const calculateProductTotal = (attention: AttentionDateRange) => {
    return attention.products.reduce((sum, product) => sum + (product.saleValue * product.quantity), 0);
  };

  const handleOpenServiceModal = (attention: AttentionDateRange) => {
    setSelectedAttention(attention);
    setServiceModalOpen(true);
  };

  const handleOpenProductModal = (attention: AttentionDateRange) => {
    setSelectedAttention(attention);
    setProductModalOpen(true);
  };

  const handleCloseServiceModal = () => {
    setServiceModalOpen(false);
    setSelectedAttention(null);
  };

  const handleCloseProductModal = () => {
    setProductModalOpen(false);
    setSelectedAttention(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container maxWidth="lg" sx={{ paddingY: 3 }}>
        <Box display="flex" alignItems="center" marginBottom={3}>
          <DateRangeIcon sx={{ marginRight: 2, fontSize: 32, color: '#9FB404' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Atenciones por Fecha
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3, borderRadius: 2 }}>
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={3} 
            alignItems="center"
          >
            <Box sx={{ flex: 1 }}>
              <DatePickerComponent
                label="Fecha Inicial"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                required
              />
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <DatePickerComponent
                label="Fecha Final"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                required
              />
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                onClick={handleSearch}
                disabled={loading || !startDate || !endDate}
                fullWidth
                sx={{
                  height: 56,
                  backgroundColor: '#9FB404',
                  '&:hover': {
                    backgroundColor: '#8BA003',
                  },
                }}
              >
                {loading ? 'Consultando...' : 'Consultar'}
              </Button>
            </Box>
          </Stack>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 3 }}>
            {error}
          </Alert>
        )}

        {attentions.length > 0 && (
          <Paper elevation={3} sx={{ borderRadius: 2 }}>
            <Box p={2}>              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Placa</strong></TableCell>
                      <TableCell><strong>Cliente</strong></TableCell>
                      <TableCell><strong>Lavador</strong></TableCell>
                      <TableCell align="center"><strong>Porcentaje</strong></TableCell>
                      <TableCell align="right"><strong>Total Servicios</strong></TableCell>
                      <TableCell align="right"><strong>Total Productos</strong></TableCell>
                      <TableCell align="center"><strong>Fecha</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attentions.map((attention) => {
                      const serviceTotal = calculateServiceTotal(attention);
                      const productTotal = calculateProductTotal(attention);
                      
                      return (
                        <TableRow key={attention.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {attention.vehicleId.plate}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {attention.vehicleId.client}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {attention.washerId.washer}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={`${attention.percentage}%`} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                              <Typography variant="body2" fontWeight="medium" color="success.main">
                                {formatPrice(serviceTotal)}
                              </Typography>
                              {attention.saleServices.length > 0 && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenServiceModal(attention)}
                                  sx={{ color: 'primary.main' }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                              <Typography variant="body2" fontWeight="medium" color="warning.main">
                                {formatPrice(productTotal)}
                              </Typography>
                              {attention.products.length > 0 && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenProductModal(attention)}
                                  sx={{ color: 'warning.main' }}
                                >
                                  <ShoppingCartIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(attention.createAt)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        )}

        {/* Service Details Modal */}
        {selectedAttention && (
          <ModalServiceDetails
            open={serviceModalOpen}
            onClose={handleCloseServiceModal}
            services={selectedAttention.saleServices}
            vehiclePlate={selectedAttention.vehicleId.plate}
          />
        )}

        {/* Product Details Modal */}
        {selectedAttention && (
          <ModalProductDetails
            open={productModalOpen}
            onClose={handleCloseProductModal}
            products={selectedAttention.products}
            vehiclePlate={selectedAttention.vehicleId.plate}
          />
        )}
      </Container>
    </LocalizationProvider>
  );
};
