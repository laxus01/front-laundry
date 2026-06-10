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
import dayjs from 'dayjs';
import { es } from 'date-fns/locale';

import { AttentionDateRange, OptionsComboBoxAutoComplete, Vehicle } from '../../interfaces/interfaces';
import { getAttentionsByDateRange, getAttentionsByVehicle } from './services/AttentionDateRangeSearch.services';
import { getVehicles } from '../vehicles/services/Vehicle.services';
import DatePickerComponent from '../../components/DatePickerComponent';
import ComboBoxAutoComplete from '../../components/ComboBoxAutoComplete';
import { ModalServiceDetails } from './components/ModalServiceDetails';
import { ModalProductDetails } from './components/ModalProductDetails';
import TableComponent from '../../components/TableComponent';

type SearchType = 'date' | 'vehicle';

export const AttentionSearch: React.FC = () => {
  const [searchType, setSearchType] = useState<SearchType>('date');
  const [startDate, setStartDate] = useState<Date | null>(dayjs().toDate());
  const [endDate, setEndDate] = useState<Date | null>(dayjs().toDate());
  const [selectedVehicle, setSelectedVehicle] = useState<OptionsComboBoxAutoComplete | null>(null);
  const [vehicles, setVehicles] = useState<OptionsComboBoxAutoComplete[]>([]);
  const [attentions, setAttentions] = useState<AttentionDateRange[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedAttention, setSelectedAttention] = useState<AttentionDateRange | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

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
        setTotalItems(response.data.length);
        
        if (response.data.length === 0) {
          const searchCriteria = searchType === 'date' 
            ? 'el rango de fechas seleccionado' 
            : `el vehículo ${selectedVehicle?.name}`;
          setError(`No se encontraron atenciones para ${searchCriteria}`);
          setData([]);
        } else {
          mapAttentionsToTableData(response.data);
        }
      } else {
        setError('No se encontraron datos para los criterios seleccionados');
        setData([]);
        setTotalItems(0);
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

  const mapAttentionsToTableData = (attentionsData: AttentionDateRange[]) => {
    const mappedData = attentionsData.map((attention) => {
      const serviceTotal = calculateServiceTotal(attention);
      const productTotal = calculateProductTotal(attention);
      
      return {
        id: attention.id,
        plate: attention.vehicleId.plate,
        client: attention.vehicleId.client,
        washer: attention.washerId.washer,
        percentage: (
          <Chip 
            label={`${attention.percentage}%`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        ),
        serviceTotal: (
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
        ),
        productTotal: (
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
        ),
        date: formatDate(attention.createAt),
        rawAttention: attention,
      };
    });
    setData(mappedData);
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  useEffect(() => {
    if (attentions.length > 0) {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedAttentions = attentions.slice(startIndex, endIndex);
      mapAttentionsToTableData(paginatedAttentions);
    }
  }, [page, limit]);

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
          <>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', justifyContent: 'flex-end' }}>
              <Chip 
                label={`${totalItems} registro${totalItems !== 1 ? 's' : ''}`} 
                color="primary" 
                size="small" 
              />
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableComponent
                columns={[
                  { id: 'plate', label: 'Placa', minWidth: 120 },
                  { id: 'client', label: 'Cliente', minWidth: 150 },
                  { id: 'washer', label: 'Lavador', minWidth: 150 },
                  { id: 'percentage', label: 'Porcentaje', minWidth: 100, align: 'center' },
                  { id: 'serviceTotal', label: 'Total Servicios', minWidth: 150, align: 'right' },
                  { id: 'productTotal', label: 'Total Productos', minWidth: 150, align: 'right' },
                  { id: 'date', label: 'Fecha', minWidth: 120, align: 'center' },
                ]}
                data={data}
                onEdit={() => {}}
                onDelete={() => {}}
                edit={false}
                emptyDataMessage="No se encontraron atenciones"
                serverSidePagination={false}
                totalCount={totalItems}
                page={page - 1}
                rowsPerPage={limit}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            )}
          </>
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
