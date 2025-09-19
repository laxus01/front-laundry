import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import DateRangeIcon from '@mui/icons-material/DateRange';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { AttentionDateRange, OptionsComboBoxAutoComplete, Vehicle } from '../../interfaces/interfaces';
import { getAttentionsByDateRange, getAttentionsByVehicle } from './services/AttentionDateRangeSearch.services';
import { getVehicles } from '../vehicles/services/Vehicle.services';
import DatePickerComponent from '../../components/DatePickerComponent';
import ComboBoxAutoComplete from '../../components/ComboBoxAutoComplete';
import { ModalServiceDetails } from './components/ModalServiceDetails';
import { ModalProductDetails } from './components/ModalProductDetails';

type SearchType = 'date' | 'vehicle';

export const AttentionSearch: React.FC = () => {
  const [searchType, setSearchType] = useState<SearchType>('date');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedVehicle, setSelectedVehicle] = useState<OptionsComboBoxAutoComplete | null>(null);
  const [vehicles, setVehicles] = useState<OptionsComboBoxAutoComplete[]>([]);
  const [attentions, setAttentions] = useState<AttentionDateRange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedAttention, setSelectedAttention] = useState<AttentionDateRange | null>(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const response = await getVehicles();
      if (response && response.data) {
        const vehicleOptions = response.data.map((vehicle: Vehicle) => ({
          id: vehicle.id,
          name: vehicle.plate,
          client: vehicle.client,
        }));
        setVehicles(vehicleOptions);
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setError('Error al cargar la lista de vehículos');
    }
  };

  const handleSearchTypeChange = (event: SelectChangeEvent<SearchType>) => {
    setSearchType(event.target.value as SearchType);
    setError(null);
    setAttentions([]);
  };

  const handleVehicleSelect = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    setSelectedVehicle(vehicle || null);
  };

  const handleSearch = async () => {
    if (searchType === 'date') {
      if (!startDate || !endDate) {
        setError('Por favor selecciona ambas fechas');
        return;
      }

      if (startDate > endDate) {
        setError('La fecha inicial no puede ser mayor que la fecha final');
        return;
      }
    } else {
      if (!selectedVehicle) {
        setError('Por favor selecciona un vehículo');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      
      if (searchType === 'date') {
        const formattedStartDate = format(startDate!, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate!, 'yyyy-MM-dd');
        response = await getAttentionsByDateRange(formattedStartDate, formattedEndDate);
      } else {
        response = await getAttentionsByVehicle(selectedVehicle!.id);
      }
      
      if (response && response.data) {
        setAttentions(response.data);
        if (response.data.length === 0) {
          const searchCriteria = searchType === 'date' 
            ? 'el rango de fechas seleccionado' 
            : `el vehículo ${selectedVehicle?.name}`;
          setError(`No se encontraron atenciones para ${searchCriteria}`);
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

  const isSearchDisabled = () => {
    if (searchType === 'date') {
      return loading || !startDate || !endDate;
    } else {
      return loading || !selectedVehicle;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container maxWidth="lg" sx={{ paddingY: 3 }}>
        <Box display="flex" alignItems="center" marginBottom={3}>
          <DirectionsCarIcon sx={{ marginRight: 2, fontSize: 32, color: '#9FB404' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Búsqueda de Atenciones
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3, borderRadius: 2 }}>
          <Stack spacing={3}>
            {/* Search Type Selector */}
            <Box>
              <FormControl fullWidth>
                <InputLabel id="search-type-label">Tipo de Búsqueda</InputLabel>
                <Select
                  labelId="search-type-label"
                  value={searchType}
                  label="Tipo de Búsqueda"
                  onChange={handleSearchTypeChange}
                >
                  <MenuItem value="date">
                    <Box display="flex" alignItems="center" gap={1}>
                      <DateRangeIcon fontSize="small" />
                      Por Fecha
                    </Box>
                  </MenuItem>
                  <MenuItem value="vehicle">
                    <Box display="flex" alignItems="center" gap={1}>
                      <DirectionsCarIcon fontSize="small" />
                      Por Vehículo
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Search Inputs */}
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={3} 
              alignItems="center"
            >
              {searchType === 'date' ? (
                <>
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
                </>
              ) : (
                <Box sx={{ flex: 2 }}>
                  <ComboBoxAutoComplete
                    title="Seleccionar Vehículo (Placa)"
                    options={vehicles}
                    onSelect={handleVehicleSelect}
                    value={selectedVehicle?.id}
                  />
                </Box>
              )}
              
              <Box sx={{ flex: 1 }}>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                  onClick={handleSearch}
                  disabled={isSearchDisabled()}
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
