import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import LocalCarWashIcon from '@mui/icons-material/LocalCarWash';
import { WasherActivitySaleService } from '../../../interfaces/interfaces';
import { formatPrice } from '../../../utils/utils';

// Extended interface to include vehicle information
interface SaleServiceWithVehicle extends WasherActivitySaleService {
  vehiclePlate?: string;
}

interface SaleServicesCardProps {
  saleServices: SaleServiceWithVehicle[];
}

export const SaleServicesCard: React.FC<SaleServicesCardProps> = ({ saleServices }) => {
  return (
    <Card sx={{ marginBottom: 2, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" marginBottom={2}>
          <LocalCarWashIcon sx={{ marginRight: 1, color: '#9FB404' }} />
          <Typography variant="h6" component="h2" fontWeight="bold">
            Servicios Vendidos
          </Typography>
        </Box>
        
        {saleServices.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No hay servicios vendidos para esta fecha y lavador.
          </Typography>
        ) : (
          <Box>
            {saleServices.map((saleService) => (
              <Box
                key={saleService.id}
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
                    {saleService.serviceId.service}
                  </Typography>
                  {saleService.vehiclePlate && (
                    <Typography variant="body2" color="text.secondary">
                      Placa: {saleService.vehiclePlate}
                    </Typography>
                  )}
                </Box>
                <Chip
                  label={formatPrice(saleService.serviceId.value)}
                  color="success"
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
