import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { WasherActivitySale } from '../../../interfaces/interfaces';

interface SalesCardProps {
  sales: WasherActivitySale[];
}

export const SalesCard: React.FC<SalesCardProps> = ({ sales }) => {
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
    <Card sx={{ marginBottom: 2, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" marginBottom={2}>
          <ShoppingBasketIcon sx={{ marginRight: 1, color: '#9FB404' }} />
          <Typography variant="h6" component="h2" fontWeight="bold">
            Productos Vendidos
          </Typography>
        </Box>
        
        {sales.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No hay productos vendidos para este período y lavador.
          </Typography>
        ) : (
          <Box>
            {sales.map((sale) => (
              <Box
                key={sale.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 2,
                  marginBottom: 1,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: '#e8e8e8',
                  },
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {sale.productId.product}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cantidad: {sale.quantity} | Valor unitario: {formatPrice(sale.productId.saleValue)}
                  </Typography>
                </Box>
                <Chip
                  label={formatPrice(sale.productId.saleValue * sale.quantity)}
                  color="warning"
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
