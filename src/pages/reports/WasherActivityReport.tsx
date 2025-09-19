import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  Paper,
  CircularProgress,
  Alert,
  Autocomplete,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { WasherActivityReport as WasherActivityReportType, OptionsComboBoxAutoComplete, Washer } from '../../interfaces/interfaces';
import { getWasherActivityReport } from './services/WasherActivityReport.services';
import { getWashers } from '../washers/services/Washer.services';
import { AttentionsCard } from './components/AttentionsCard';
import { SaleServicesCard } from './components/SaleServicesCard';
import { SalesCard } from './components/SalesCard';
import dayjs from 'dayjs';
import DatePickerComponent from '../../components/DatePickerComponent';

export const WasherActivityReport: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedWasher, setSelectedWasher] = useState<OptionsComboBoxAutoComplete | null>(null);
  const [washers, setWashers] = useState<OptionsComboBoxAutoComplete[]>([]);
  const [reportData, setReportData] = useState<WasherActivityReportType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWashers();
  }, []);

  const loadWashers = async () => {
    try {
      const response = await getWashers();
      if (response && response.data) {
        const washerOptions = response.data.map((washer: Washer) => ({
          id: washer.id,
          name: washer.washer,
        }));
        setWashers(washerOptions);
      }
    } catch (error) {
      console.error('Error loading washers:', error);
      setError('Error al cargar la lista de lavadores');
    }
  };

  const handleSearch = async () => {
    if (!selectedDate || !endDate || !selectedWasher) {
      setError('Por favor selecciona ambas fechas y un lavador');
      return;
    }

    if (selectedDate > endDate) {
      setError('La fecha inicial no puede ser mayor que la fecha final');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formattedStartDate = format(selectedDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      const response = await getWasherActivityReport(formattedStartDate, formattedEndDate, selectedWasher.id);
      
      if (response && response.data) {
        setReportData(response.data);
      } else {
        setError('No se encontraron datos para los criterios seleccionados');
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('Error al obtener el reporte. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | undefined | null) => {
    const numPrice = Number(price) || 0;
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container maxWidth="lg" sx={{ paddingY: 3 }}>
        <Box display="flex" alignItems="center" marginBottom={3}>
          <AssessmentIcon sx={{ marginRight: 2, fontSize: 32, color: '#9FB404' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Actividad de Lavadores
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
              value={selectedDate ? dayjs(selectedDate).toDate() : null}
              onChange={(date) =>
                setSelectedDate(date ? dayjs(date).toDate() : null)
              }
              required
            />
            </Box>
            
            <Box sx={{ flex: 1 }}>
            <DatePickerComponent
              label="Fecha Final"
              value={endDate ? dayjs(endDate).toDate() : null}
              onChange={(date) =>
                setEndDate(date ? dayjs(date).toDate() : null)
              }
              required
            />
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Autocomplete
                options={washers}
                getOptionLabel={(option) => option.name}
                value={selectedWasher}
                onChange={(_event, newValue) => setSelectedWasher(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Lavador"
                    variant="outlined"
                    fullWidth
                  />
                )}
                noOptionsText="No hay lavadores disponibles"
              />
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                onClick={handleSearch}
                disabled={loading || !selectedDate || !endDate || !selectedWasher}
                fullWidth
                sx={{
                  height: 56,
                  backgroundColor: '#9FB404',
                  '&:hover': {
                    backgroundColor: '#8BA003',
                  },
                }}
              >
                {loading ? 'Buscando...' : 'Generar Reporte'}
              </Button>
            </Box>
          </Stack>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 3 }}>
            {error}
          </Alert>
        )}

        {reportData && (
          <Box>
            
            <Stack 
              direction={{ xs: 'column', lg: 'row' }} 
              spacing={3}
              sx={{
                overflowY: 'auto',
                maxHeight: '30vh',
                overflowX: 'hidden',
              }}
            >
              <Box sx={{ flex: 1 }}>
                <AttentionsCard attentions={reportData.attentions} />
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <SaleServicesCard saleServices={reportData.saleServices} />
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <SalesCard sales={reportData.sales} />
              </Box>
            </Stack>

            <Paper elevation={2} sx={{ padding: 3, marginTop: 3, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" marginBottom={2} fontWeight="medium">
                Resumen
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
              >
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {reportData.summary.totalAttentions}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Total Atenciones
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {reportData.attentions.reduce((total, attention) => {
                      return total + attention.saleServices.length;
                    }, 0)}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Servicios Vendidos
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {reportData.summary.totalSales}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Productos Vendidos
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {formatPrice(
                      // Sumar ganancia del lavador por atenciones
                      reportData.attentions.reduce((total, attention) => total + attention.washerProfit, 0) -
                      // Restar el valor total de productos vendidos (saleValue * quantity)
                      reportData.sales.reduce((total, sale) => {
                        const productSaleValue = sale.productId.saleValue * sale.quantity;
                        return total + productSaleValue;
                      }, 0)
                    )}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Total Ganancia
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        )}
      </Container>
    </LocalizationProvider>
  );
};
