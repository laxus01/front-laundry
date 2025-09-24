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
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { FinancialReport as FinancialReportType } from '../../interfaces/interfaces';
import { getFinancialReport } from './services/FinancialReport.services';
import { IncomeCard } from './components/IncomeCard';
import { CostsCard } from './components/CostsCard';
import { SummaryCard } from './components/SummaryCard';
import dayjs from 'dayjs';
import DatePickerComponent from '../../components/DatePickerComponent';

export const FinancialReport: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(dayjs().toDate());
  const [endDate, setEndDate] = useState<Date | null>(dayjs().toDate());
  const [reportData, setReportData] = useState<FinancialReportType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const response = await getFinancialReport(formattedStartDate, formattedEndDate);
      
      if (response && response.data) {
        setReportData(response.data);
      } else {
        setError('No se encontraron datos para el período seleccionado');
      }
    } catch (error) {
      console.error('Error fetching financial report:', error);
      setError('Error al obtener el reporte general. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container maxWidth="lg" sx={{ paddingY: 3 }}>
        <Box display="flex" alignItems="center" marginBottom={3}>
          <AssessmentIcon sx={{ marginRight: 2, fontSize: 32, color: '#9FB404' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Reporte General
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
                value={startDate ? dayjs(startDate).toDate() : null}
                onChange={(date) =>
                  setStartDate(date ? dayjs(date).toDate() : null)
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
                {loading ? 'Generando...' : 'Generar Reporte'}
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
              sx={{ marginBottom: 3 }}
            >
              <Box sx={{ flex: 1 }}>
                <IncomeCard income={reportData.income} />
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <CostsCard costs={reportData.costs} />
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <SummaryCard summary={reportData.summary} />
              </Box>
            </Stack>

            <Paper elevation={2} sx={{ padding: 3, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" marginBottom={2} fontWeight="medium">
                Detalles del Período
              </Typography>
              <Typography variant="body2" color="text.secondary" marginBottom={2}>
                {format(new Date(reportData.period.startDate), 'dd/MM/yyyy', { locale: es })} - {format(new Date(reportData.period.endDate), 'dd/MM/yyyy', { locale: es })}
              </Typography>
              
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
              >
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {reportData.details.salesCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ventas de Productos
                  </Typography>
                </Box>
                
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {reportData.details.serviceSalesCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ventas de Servicios
                  </Typography>
                </Box>
                
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {reportData.details.parkingPaymentsCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pagos de Parqueos
                  </Typography>
                </Box>
                
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {reportData.details.accountsReceivablePaymentsCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pagos Cuentas por Cobrar
                  </Typography>
                </Box>
                
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="error.main">
                    {reportData.details.shoppingCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Compras Realizadas
                  </Typography>
                </Box>
                
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="error.main">
                    {reportData.details.expensesCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gastos Registrados
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
