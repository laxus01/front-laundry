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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  TextField,
  Grid,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import DateRangeIcon from '@mui/icons-material/DateRange';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { es } from 'date-fns/locale';

import { AttentionDateRange, OptionsComboBoxAutoComplete, Vehicle } from '../../interfaces/interfaces';
import { getAttentionsByDateRange, getAttentionsByVehicle, deleteAttention, updateAttention } from './services/AttentionDateRangeSearch.services';
import { getVehicles } from '../vehicles/services/Vehicle.services';
import { getWashers } from '../washers/services/Washer.services';
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
  const [washers, setWashers] = useState<any[]>([]);
  const [attentions, setAttentions] = useState<AttentionDateRange[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedAttention, setSelectedAttention] = useState<AttentionDateRange | null>(null);
  
  // Delete confirmation states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attentionToDelete, setAttentionToDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Edit dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [attentionToEdit, setAttentionToEdit] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    percentage: 0,
    washerId: '',
  });
  const [formErrors, setFormErrors] = useState<any>({});
  
  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    loadVehicles();
    loadWashers();
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

  const loadWashers = async () => {
    try {
      const response = await getWashers();
      if (response && response.data) {
        setWashers(response.data);
      }
    } catch (error) {
      console.error('Error loading washers:', error);
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

  const handleDeleteClick = (row: any) => {
    setAttentionToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAttentionToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!attentionToDelete) return;

    setDeleting(true);
    try {
      await deleteAttention(attentionToDelete.id);
      
      setSnackbarMessage(`Atención eliminada exitosamente (Placa: ${attentionToDelete.plate})`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      setDeleteDialogOpen(false);
      setAttentionToDelete(null);
      
      await handleSearch();
    } catch (error: any) {
      console.error('Error deleting attention:', error);
      setSnackbarMessage(error.message || 'Error al eliminar la atención. Por favor intenta nuevamente.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleEditClick = (row: any) => {
    setAttentionToEdit(row);
    
    const attention = row.rawAttention;
    setFormData({
      percentage: attention.percentage || 0,
      washerId: attention.washerId?.id || '',
    });
    setFormErrors({});
    setEditDialogOpen(true);
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setAttentionToEdit(null);
    setFormData({
      percentage: 0,
      washerId: '',
    });
    setFormErrors({});
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: any = {};
    
    if (formData.percentage === undefined || formData.percentage === null || formData.percentage < 0 || formData.percentage > 100) {
      errors.percentage = 'El porcentaje debe estar entre 0 y 100';
    }
    
    if (!formData.washerId) {
      errors.washerId = 'Debes seleccionar un lavador';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!attentionToEdit) return;

    setUpdating(true);
    try {
      const attention = attentionToEdit.rawAttention;
      const payload = {
        percentage: formData.percentage,
        washerId: { id: formData.washerId },
        vehicleId: { id: attention.vehicleId.id },
        finishDate: attention.finishDate,
        paymentStatus: attention.paymentStatus,
        paymentDate: attention.paymentDate,
        totalAmount: attention.totalAmount,
        notes: attention.notes,
      };

      await updateAttention(attentionToEdit.id, payload);
      
      setSnackbarMessage(`Atención actualizada exitosamente (Placa: ${attentionToEdit.plate})`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      setEditDialogOpen(false);
      setAttentionToEdit(null);
      
      await handleSearch();
    } catch (error: any) {
      console.error('Error updating attention:', error);
      setSnackbarMessage(error.message || 'Error al actualizar la atención. Por favor intenta nuevamente.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setUpdating(false);
    }
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
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                edit={true}
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

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="error" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              {attentionToDelete && (
                <>
                  ¿Estás seguro que deseas eliminar esta atención?
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Placa: {attentionToDelete.plate}
                    </Typography>
                    <Typography variant="body2">
                      Cliente: {attentionToDelete.client}
                    </Typography>
                    <Typography variant="body2">
                      Lavador: {attentionToDelete.washer}
                    </Typography>
                    <Typography variant="body2">
                      Fecha: {attentionToDelete.date}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    Esta acción no se puede deshacer.
                  </Typography>
                </>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={handleDeleteCancel} 
              disabled={deleting}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={deleting}
              startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
              autoFocus
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Attention Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={handleEditCancel}
          maxWidth="sm"
          fullWidth
          aria-labelledby="edit-dialog-title"
        >
          <DialogTitle id="edit-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon color="primary" />
            Editar Atención
          </DialogTitle>
          <DialogContent>
            {attentionToEdit && (
              <>
                <Box sx={{ mb: 3, mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Placa: {attentionToEdit.plate}
                  </Typography>
                  <Typography variant="body2">
                    Cliente: {attentionToEdit.client}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lavador actual: {attentionToEdit.washer}
                  </Typography>
                </Box>

                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Porcentaje (%)"
                    type="number"
                    value={formData.percentage}
                    onChange={(e) => handleFormChange('percentage', Number(e.target.value))}
                    error={!!formErrors.percentage}
                    helperText={formErrors.percentage || 'Porcentaje de comisión para el lavador'}
                    inputProps={{ min: 0, max: 100 }}
                    required
                  />

                  <FormControl fullWidth error={!!formErrors.washerId} required>
                    <InputLabel>Lavador</InputLabel>
                    <Select
                      value={formData.washerId}
                      label="Lavador"
                      onChange={(e) => handleFormChange('washerId', e.target.value)}
                    >
                      {washers.map((washer) => (
                        <MenuItem key={washer.id} value={washer.id}>
                          {washer.washer}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.washerId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                        {formErrors.washerId}
                      </Typography>
                    )}
                  </FormControl>
                </Stack>
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={handleEditCancel} 
              disabled={updating}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEditSave}
              color="primary"
              variant="contained"
              disabled={updating}
              startIcon={updating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            >
              {updating ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbarSeverity} 
            sx={{ width: '100%' }}
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};
