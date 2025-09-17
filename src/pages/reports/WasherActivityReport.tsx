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
    if (!selectedDate || !selectedWasher) {
      setError('Por favor selecciona una fecha y un lavador');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await getWasherActivityReport(formattedDate, selectedWasher.id);
      
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
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
                disabled={loading || !selectedDate || !selectedWasher}
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
                <SaleServicesCard 
                  saleServices={(() => {
                    // Debug: log the structure
                    console.log('reportData.attentions:', reportData.attentions);
                    
                    // Extract all saleServices from all attentions with vehicle information
                    const allSaleServices = reportData.attentions.flatMap(attention => {
                      console.log('attention.saleServices:', attention.saleServices);
                      
                      // Map each service to include vehicle plate
                      return (attention.saleServices || []).map(service => ({
                        ...service,
                        vehiclePlate: attention.vehicleId.plate
                      }));
                    });
                    
                    console.log('allSaleServices:', allSaleServices);
                    return allSaleServices;
                  })()}
                />
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
                    {(() => {
                      // Calculate total sale services from nested structure
                      const totalSaleServices = reportData.attentions.reduce((total, attention) => {
                        return total + (attention.saleServices?.length || 0);
                      }, 0);
                      return totalSaleServices;
                    })()}
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
                    {(() => {
                      // Calculate total washer profit from all attentions
                      const totalProfit = reportData.attentions.reduce((total, attention) => {
                        return total + (attention.washerProfit || 0);
                      }, 0);
                      
                      // Calculate total sales value to subtract (saleValue * quantity for each sale)
                      const totalSalesValue = reportData.sales.reduce((total, sale) => {
                        const saleTotal = (sale.productId?.saleValue || 0) * (sale.quantity || 0);
                        return total + saleTotal;
                      }, 0);
                      
                      // Return profit minus total sales value
                      return formatPrice(totalProfit - totalSalesValue);
                    })()}
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
