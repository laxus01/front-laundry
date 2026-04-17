import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import DatePickerComponent from './DatePickerComponent';
import ComboBoxAutoComplete from './ComboBoxAutoComplete';
import { getVehicles } from '../pages/vehicles/services/Vehicle.services';
import dayjs from 'dayjs';

export type ParkingFilter = 
  | { field: 'vehicleId'; value: string; label: string }
  | { field: 'state'; value: number; label: string }
  | { field: 'paymentStatus'; value: number; label: string }
  | { field: 'dateInitialFrom'; value: string; label: string }
  | { field: 'dateInitialTo'; value: string; label: string }
  | { field: 'dateFinalFrom'; value: string; label: string }
  | { field: 'dateFinalTo'; value: string; label: string }
  | { field: 'creationDateFrom'; value: string; label: string }
  | { field: 'creationDateTo'; value: string; label: string };

interface FilterParkingsModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: ParkingFilter[]) => void;
  initialFilters?: ParkingFilter[];
}

const FilterParkingsModal: React.FC<FilterParkingsModalProps> = ({
  open,
  onClose,
  onApply,
  initialFilters = [],
}) => {
  const [filterType, setFilterType] = useState<string>('');
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [activeFilters, setActiveFilters] = useState<ParkingFilter[]>(initialFilters);
  
  // Current filter values
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedState, setSelectedState] = useState<number | ''>('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<number | ''>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    if (open) {
      setActiveFilters(initialFilters);
      loadVehicles();
    }
  }, [open]);

  const loadVehicles = async () => {
    try {
      const response = await getVehicles();
      if (response?.data) {
        const vehicleOptions = response.data.map((vehicle: any) => ({
          id: vehicle.id,
          name: vehicle.plate,
          plate: vehicle.plate,
        }));
        setVehicles(vehicleOptions);
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  const handleFilterTypeChange = (event: SelectChangeEvent<string>) => {
    setFilterType(event.target.value);
    // Reset current values
    setSelectedVehicleId('');
    setSelectedState('');
    setSelectedPaymentStatus('');
    setSelectedDate('');
  };

  const getFilterLabel = (filter: ParkingFilter): string => {
    return filter.label;
  };

  const handleAddFilter = () => {
    let newFilter: ParkingFilter | null = null;

    switch (filterType) {
      case 'vehicleId':
        if (selectedVehicleId) {
          const vehicle = vehicles.find(v => v.id === selectedVehicleId);
          newFilter = {
            field: 'vehicleId',
            value: selectedVehicleId,
            label: `Vehículo: ${vehicle?.plate || selectedVehicleId}`,
          };
        }
        break;
      case 'state':
        if (selectedState !== '') {
          newFilter = {
            field: 'state',
            value: selectedState as number,
            label: `Estado: ${selectedState === 1 ? 'Activo' : 'Inactivo'}`,
          };
        }
        break;
      case 'paymentStatus':
        if (selectedPaymentStatus !== '') {
          newFilter = {
            field: 'paymentStatus',
            value: selectedPaymentStatus as number,
            label: `Pago: ${selectedPaymentStatus === 0 ? 'Pagado' : 'Pendiente'}`,
          };
        }
        break;
      case 'dateInitialFrom':
        if (selectedDate) {
          newFilter = {
            field: 'dateInitialFrom',
            value: selectedDate,
            label: `Fecha inicial desde: ${dayjs(selectedDate).format('DD/MM/YYYY')}`,
          };
        }
        break;
      case 'dateInitialTo':
        if (selectedDate) {
          newFilter = {
            field: 'dateInitialTo',
            value: selectedDate,
            label: `Fecha inicial hasta: ${dayjs(selectedDate).format('DD/MM/YYYY')}`,
          };
        }
        break;
      case 'dateFinalFrom':
        if (selectedDate) {
          newFilter = {
            field: 'dateFinalFrom',
            value: selectedDate,
            label: `Fecha final desde: ${dayjs(selectedDate).format('DD/MM/YYYY')}`,
          };
        }
        break;
      case 'dateFinalTo':
        if (selectedDate) {
          newFilter = {
            field: 'dateFinalTo',
            value: selectedDate,
            label: `Fecha final hasta: ${dayjs(selectedDate).format('DD/MM/YYYY')}`,
          };
        }
        break;
      case 'creationDateFrom':
        if (selectedDate) {
          newFilter = {
            field: 'creationDateFrom',
            value: selectedDate,
            label: `Creación desde: ${dayjs(selectedDate).format('DD/MM/YYYY')}`,
          };
        }
        break;
      case 'creationDateTo':
        if (selectedDate) {
          newFilter = {
            field: 'creationDateTo',
            value: selectedDate,
            label: `Creación hasta: ${dayjs(selectedDate).format('DD/MM/YYYY')}`,
          };
        }
        break;
    }

    if (newFilter) {
      setActiveFilters([...activeFilters, newFilter]);
      // Reset current selection
      setFilterType('');
      setSelectedVehicleId('');
      setSelectedState('');
      setSelectedPaymentStatus('');
      setSelectedDate('');
    }
  };

  const handleRemoveFilter = (index: number) => {
    setActiveFilters(activeFilters.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setActiveFilters([]);
  };

  const handleApply = () => {
    onApply(activeFilters);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const renderFilterInput = () => {
    switch (filterType) {
      case 'vehicleId':
        return (
          <ComboBoxAutoComplete
            title="Seleccionar Vehículo"
            options={vehicles}
            onSelect={setSelectedVehicleId}
            value={selectedVehicleId}
          />
        );
      case 'state':
        return (
          <FormControl fullWidth>
            <InputLabel>Estado del Parqueo</InputLabel>
            <Select
              value={selectedState}
              label="Estado del Parqueo"
              onChange={(e) => setSelectedState(e.target.value as number)}
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        );
      case 'paymentStatus':
        return (
          <FormControl fullWidth>
            <InputLabel>Estado de Pago</InputLabel>
            <Select
              value={selectedPaymentStatus}
              label="Estado de Pago"
              onChange={(e) => setSelectedPaymentStatus(e.target.value as number)}
            >
              <MenuItem value={0}>Pagado</MenuItem>
              <MenuItem value={1}>Pendiente</MenuItem>
            </Select>
          </FormControl>
        );
      case 'dateInitialFrom':
      case 'dateInitialTo':
      case 'dateFinalFrom':
      case 'dateFinalTo':
      case 'creationDateFrom':
      case 'creationDateTo':
        return (
          <DatePickerComponent
            label="Seleccionar Fecha"
            value={selectedDate ? dayjs(selectedDate).toDate() : null}
            onChange={(date) => setSelectedDate(date ? dayjs(date).format('YYYY-MM-DD') : '')}
            required
          />
        );
      default:
        return null;
    }
  };

  const canAddFilter = () => {
    if (!filterType) return false;
    
    switch (filterType) {
      case 'vehicleId':
        return !!selectedVehicleId;
      case 'state':
      case 'paymentStatus':
        return selectedState !== '' || selectedPaymentStatus !== '';
      case 'dateInitialFrom':
      case 'dateInitialTo':
      case 'dateFinalFrom':
      case 'dateFinalTo':
      case 'creationDateFrom':
      case 'creationDateTo':
        return !!selectedDate;
      default:
        return false;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 15,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div" style={{ color: '#9FB404' }}>
            Filtrar Parqueos
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} sx={{ mt: 2 }}>
          {/* Filter Type Selection */}
          <FormControl fullWidth>
            <InputLabel>Tipo de Filtro</InputLabel>
            <Select
              value={filterType}
              label="Tipo de Filtro"
              onChange={handleFilterTypeChange}
            >
              <MenuItem value="vehicleId">Vehículo</MenuItem>
              <MenuItem value="paymentStatus">Estado de Pago</MenuItem>
            </Select>
          </FormControl>

          {/* Dynamic Filter Input */}
          {filterType && (
            <Box>
              {renderFilterInput()}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddFilter}
                disabled={!canAddFilter()}
                sx={{ mt: 2 }}
                fullWidth
              >
                Agregar Filtro
              </Button>
            </Box>
          )}

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" color="textSecondary">
                  Filtros Activos ({activeFilters.length})
                </Typography>
                <Button size="small" onClick={handleClearAll}>
                  Limpiar Todo
                </Button>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {activeFilters.map((filter, index) => (
                  <Chip
                    key={index}
                    label={getFilterLabel(filter)}
                    onDelete={() => handleRemoveFilter(index)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          startIcon={<FilterListIcon />}
          sx={{
            backgroundColor: '#9FB404',
            '&:hover': {
              backgroundColor: '#8BA003',
            },
          }}
        >
          Aplicar Filtros
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterParkingsModal;
