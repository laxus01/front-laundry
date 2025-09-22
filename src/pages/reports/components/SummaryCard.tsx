import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Stack,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { FinancialReportSummary } from '../../../interfaces/interfaces';

interface SummaryCardProps {
  summary: FinancialReportSummary;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getProfitColor = (profit: number) => {
    return profit >= 0 ? '#4caf50' : '#f44336';
  };

  return (
    <Card elevation={3} sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent sx={{ padding: 3 }}>
        <Box display="flex" alignItems="center" marginBottom={2}>
          <AccountBalanceIcon sx={{ marginRight: 1, color: '#2196f3', fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold" color="#2196f3">
            Resumen General
          </Typography>
        </Box>
        
        <Stack spacing={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Ganancia Neta
            </Typography>
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              color={getProfitColor(summary.netProfit)}
            >
              {formatPrice(summary.netProfit)}
            </Typography>
          </Box>
          
          <Divider />
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Margen de Ganancia
            </Typography>
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              color={getProfitColor(summary.netProfit)}
            >
              {summary.profitMargin}%
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
