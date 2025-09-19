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
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import dayjs from 'dayjs';

import { ParkingDateRange } from '../../interfaces/interfaces';
import { getParkingsByDateRange } from './services/ParkingDateRangeSearch.services';
import DatePickerComponent from '../../components/DatePickerComponent';
import { ModalParkingPaymentDetails } from './components/ModalParkingPaymentDetails';

export const ParkingDateRangeSearch: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [parkings, setParkings] = useState<ParkingDateRange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedParking, setSelectedParking] = useState<ParkingDateRange | null>(null);

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
      
      const response = await getParkingsByDateRange(formattedStartDate, formattedEndDate);
      
      if (response && response.data) {
        setParkings(response.data);
        if (response.data.length === 0) {
          setError('No se encontraron parqueos para el rango de fechas seleccionado');
        }
      } else {
        setError('No se encontraron datos para los criterios seleccionados');
      }
    } catch (error) {
      console.error('Error fetching parkings:', error);
      setError('Error al obtener los parqueos. Por favor intenta nuevamente.');
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
    return dayjs(dateString).format('DD/MM/YYYY');
  };

  const getStateText = (state: number) => {
    switch (state) {
      case 0:
        return { text: 'Pagado', color: 'success' as const };
      case 1:
        return { text: 'Por pagar', color: 'warning' as const };
      default:
        return { text: 'Desconocido', color: 'default' as const };
    }
  };

  const calculateBalance = (parking: ParkingDateRange) => {
    const totalPaid = parking.parkingPayments.reduce((sum, payment) => sum + payment.value, 0);
    return parking.value - totalPaid;
  };

  const handleOpenPaymentModal = (parking: ParkingDateRange) => {
    setSelectedParking(parking);
    setPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false);
    setSelectedParking(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container maxWidth="lg" sx={{ paddingY: 3 }}>
        <Box display="flex" alignItems="center" marginBottom={3}>
          <LocalParkingIcon sx={{ marginRight: 2, fontSize: 32, color: '#9FB404' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Parqueos por Fecha
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

        {parkings.length > 0 && (
          <Paper elevation={3} sx={{ borderRadius: 2 }}>
            <Box p={2}>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Placa</strong></TableCell>
                      <TableCell><strong>Cliente</strong></TableCell>
                      <TableCell><strong>Tipo Vehículo</strong></TableCell>
                      <TableCell><strong>Tipo Parqueo</strong></TableCell>
                      <TableCell align="center"><strong>Fecha Inicial</strong></TableCell>
                      <TableCell align="center"><strong>Fecha Final</strong></TableCell>
                      <TableCell align="right"><strong>Valor</strong></TableCell>
                      <TableCell align="right"><strong>Saldo</strong></TableCell>
                      <TableCell align="center"><strong>Estado</strong></TableCell>
                      <TableCell align="center"><strong>Pagos</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parkings.map((parking) => {
                      const balance = calculateBalance(parking);
                      const state = getStateText(parking.state);
                      
                      return (
                        <TableRow key={parking.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {parking.vehicle.plate}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {parking.vehicle.client}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {parking.vehicle.typeVehicle.type}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {parking.typeParking.type}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {formatDate(parking.dateInitial)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2">
                              {formatDate(parking.dateFinal)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="medium" color="primary.main">
                              {formatPrice(parking.value)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography 
                              variant="body2" 
                              fontWeight="medium" 
                              color={balance > 0 ? 'error.main' : 'success.main'}
                            >
                              {formatPrice(balance)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={state.text} 
                              size="small" 
                              color={state.color} 
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                              <Typography variant="body2" fontWeight="medium">
                                {parking.parkingPayments.length}
                              </Typography>
                              {parking.parkingPayments.length > 0 && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenPaymentModal(parking)}
                                  sx={{ color: 'primary.main' }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
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

        {/* Payment Details Modal */}
        {selectedParking && (
          <ModalParkingPaymentDetails
            open={paymentModalOpen}
            onClose={handleClosePaymentModal}
            payments={selectedParking.parkingPayments}
            vehiclePlate={selectedParking.vehicle.plate}
            parkingType={selectedParking.typeParking.type}
          />
        )}
      </Container>
    </LocalizationProvider>
  );
};
