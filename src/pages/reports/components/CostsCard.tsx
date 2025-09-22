import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Stack,
} from '@mui/material';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { FinancialReportCosts } from '../../../interfaces/interfaces';

interface CostsCardProps {
  costs: FinancialReportCosts;
}

export const CostsCard: React.FC<CostsCardProps> = ({ costs }) => {
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
          <TrendingDownIcon sx={{ marginRight: 1, color: '#f44336', fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold" color="#f44336">
            Costos
          </Typography>
        </Box>
        
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Costos de Compras
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatPrice(costs.totalShoppingCosts)}
            </Typography>
          </Box>
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Gastos Operacionales
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatPrice(costs.totalExpenses)}
            </Typography>
          </Box>
          
          <Divider sx={{ marginY: 1 }} />
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold" color="#f44336">
              Total Costos
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="#f44336">
              {formatPrice(costs.totalCosts)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
