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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import DatePickerComponent from './DatePickerComponent';
import dayjs from 'dayjs';

interface ModalDateRangeSearchProps {
  open: boolean;
  onClose: () => void;
  onSearch: (startDate: string, endDate: string) => void;
  title?: string;
  initialStartDate?: string;
  initialEndDate?: string;
}

const ModalDateRangeSearch: React.FC<ModalDateRangeSearchProps> = ({
  open,
  onClose,
  onSearch,
  title = 'Buscar por Fecha',
  initialStartDate,
  initialEndDate,
}) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // Set initial dates when modal opens
      const currentMonth = dayjs().month();
      const currentYear = dayjs().year();
      const defaultStartDate = initialStartDate || dayjs(`${currentYear}-${currentMonth + 1}-01`).format('YYYY-MM-DD');
      const defaultEndDate = initialEndDate || dayjs(`${currentYear}-${currentMonth + 1}-${dayjs(`${currentYear}-${currentMonth + 1}-01`).daysInMonth()}`).format('YYYY-MM-DD');
      
      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
    }
  }, [open, initialStartDate, initialEndDate]);

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      return;
    }

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      alert('La fecha inicial no puede ser mayor que la fecha final');
      return;
    }

    setLoading(true);
    try {
      await onSearch(startDate, endDate);
      onClose();
    } catch (error) {
      console.error('Error searching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLoading(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
            {title}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} sx={{ mt: 2 }}>
          <DatePickerComponent
            label="Fecha Inicial"
            value={startDate ? dayjs(startDate).toDate() : null}
            onChange={(date) => setStartDate(date ? dayjs(date).format('YYYY-MM-DD') : '')}
            required
          />
          
          <DatePickerComponent
            label="Fecha Final"
            value={endDate ? dayjs(endDate).toDate() : null}
            onChange={(date) => setEndDate(date ? dayjs(date).format('YYYY-MM-DD') : '')}
            required
            minDate={startDate ? dayjs(startDate).toDate() : undefined}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSearch}
          variant="contained"
          disabled={loading || !startDate || !endDate}
          startIcon={<SearchIcon />}
          sx={{
            backgroundColor: '#9FB404',
            '&:hover': {
              backgroundColor: '#8BA003',
            },
          }}
        >
          {loading ? 'Consultando...' : 'Consultar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDateRangeSearch;
