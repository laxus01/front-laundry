import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Stack,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { FinancialReportIncome } from '../../../interfaces/interfaces';

interface IncomeCardProps {
  income: FinancialReportIncome;
}

export const IncomeCard: React.FC<IncomeCardProps> = ({ income }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card elevation={3} sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent sx={{ padding: 3 }}>
        <Box display="flex" alignItems="center" marginBottom={2}>
          <TrendingUpIcon sx={{ marginRight: 1, color: '#4caf50', fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold" color="#4caf50">
            Ingresos
          </Typography>
        </Box>
        
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Ventas de Productos
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatPrice(income.totalSales)}
            </Typography>
          </Box>
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Ventas de Servicios
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatPrice(income.totalServiceSales)}
            </Typography>
          </Box>
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Pagos de Parqueos
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatPrice(income.totalParkingPayments)}
            </Typography>
          </Box>
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Pagos Cuentas por Cobrar
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatPrice(income.totalAccountsReceivablePayments)}
            </Typography>
          </Box>
          
          <Divider sx={{ marginY: 1 }} />
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold" color="#4caf50">
              Total Ingresos
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="#4caf50">
              {formatPrice(income.totalIncome)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
