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
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';

export type ProductFilter = 
  | { field: 'product'; value: string; label: string }
  | { field: 'valueBuysMin'; value: number; label: string }
  | { field: 'valueBuysMax'; value: number; label: string }
  | { field: 'saleValueMin'; value: number; label: string }
  | { field: 'saleValueMax'; value: number; label: string }
  | { field: 'existenceMin'; value: number; label: string }
  | { field: 'existenceMax'; value: number; label: string };

interface FilterProductsModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: ProductFilter[]) => void;
  initialFilters?: ProductFilter[];
}

const FilterProductsModal: React.FC<FilterProductsModalProps> = ({
  open,
  onClose,
  onApply,
  initialFilters = [],
}) => {
  const [filterType, setFilterType] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<ProductFilter[]>(initialFilters);
  
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<number | ''>('');

  useEffect(() => {
    if (open) {
      setActiveFilters(initialFilters);
    }
  }, [open]);

  const handleFilterTypeChange = (event: SelectChangeEvent<string>) => {
    setFilterType(event.target.value);
    setSelectedProduct('');
    setSelectedValue('');
  };

  const getFilterLabel = (filter: ProductFilter): string => {
    return filter.label;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleAddFilter = () => {
    let newFilter: ProductFilter | null = null;

    switch (filterType) {
      case 'product':
        if (selectedProduct.trim()) {
          newFilter = {
            field: 'product',
            value: selectedProduct.trim(),
            label: `Producto: ${selectedProduct.trim()}`,
          };
        }
        break;
      case 'valueBuysMin':
        if (selectedValue !== '' && selectedValue >= 0) {
          newFilter = {
            field: 'valueBuysMin',
            value: selectedValue as number,
            label: `Valor Compra desde: ${formatCurrency(selectedValue as number)}`,
          };
        }
        break;
      case 'valueBuysMax':
        if (selectedValue !== '' && selectedValue >= 0) {
          newFilter = {
            field: 'valueBuysMax',
            value: selectedValue as number,
            label: `Valor Compra hasta: ${formatCurrency(selectedValue as number)}`,
          };
        }
        break;
      case 'saleValueMin':
        if (selectedValue !== '' && selectedValue >= 0) {
          newFilter = {
            field: 'saleValueMin',
            value: selectedValue as number,
            label: `Valor Venta desde: ${formatCurrency(selectedValue as number)}`,
          };
        }
        break;
      case 'saleValueMax':
        if (selectedValue !== '' && selectedValue >= 0) {
          newFilter = {
            field: 'saleValueMax',
            value: selectedValue as number,
            label: `Valor Venta hasta: ${formatCurrency(selectedValue as number)}`,
          };
        }
        break;
      case 'existenceMin':
        if (selectedValue !== '' && selectedValue >= 0) {
          newFilter = {
            field: 'existenceMin',
            value: selectedValue as number,
            label: `Existencia desde: ${selectedValue}`,
          };
        }
        break;
      case 'existenceMax':
        if (selectedValue !== '' && selectedValue >= 0) {
          newFilter = {
            field: 'existenceMax',
            value: selectedValue as number,
            label: `Existencia hasta: ${selectedValue}`,
          };
        }
        break;
    }

    if (newFilter) {
      setActiveFilters([...activeFilters, newFilter]);
      setFilterType('');
      setSelectedProduct('');
      setSelectedValue('');
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
      case 'product':
        return (
          <TextField
            fullWidth
            label="Nombre del Producto"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            placeholder="Ingrese el nombre del producto"
          />
        );
      case 'valueBuysMin':
      case 'valueBuysMax':
      case 'saleValueMin':
      case 'saleValueMax':
      case 'existenceMin':
      case 'existenceMax':
        return (
          <TextField
            fullWidth
            label="Valor"
            type="number"
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="Ingrese el valor"
            inputProps={{ min: 0 }}
          />
        );
      default:
        return null;
    }
  };

  const canAddFilter = () => {
    if (!filterType) return false;
    
    switch (filterType) {
      case 'product':
        return selectedProduct.trim() !== '';
      case 'valueBuysMin':
      case 'valueBuysMax':
      case 'saleValueMin':
      case 'saleValueMax':
      case 'existenceMin':
      case 'existenceMax':
        return selectedValue !== '' && selectedValue >= 0;
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
            Filtrar Productos
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Filtro</InputLabel>
            <Select
              value={filterType}
              label="Tipo de Filtro"
              onChange={handleFilterTypeChange}
            >
              <MenuItem value="product">Nombre del Producto</MenuItem>
              <MenuItem value="valueBuysMin">Valor Compra Mínimo</MenuItem>
              <MenuItem value="valueBuysMax">Valor Compra Máximo</MenuItem>
              <MenuItem value="saleValueMin">Valor Venta Mínimo</MenuItem>
              <MenuItem value="saleValueMax">Valor Venta Máximo</MenuItem>
              <MenuItem value="existenceMin">Existencia Mínima</MenuItem>
              <MenuItem value="existenceMax">Existencia Máxima</MenuItem>
            </Select>
          </FormControl>

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

export default FilterProductsModal;
