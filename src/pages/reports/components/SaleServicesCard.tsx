import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Collapse } from '@mui/material';
import LocalCarWashIcon from '@mui/icons-material/LocalCarWash';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { WasherActivitySaleService } from '../../../interfaces/interfaces';

interface SaleServicesCardProps {
  saleServices: WasherActivitySaleService[];
}

export const SaleServicesCard: React.FC<SaleServicesCardProps> = ({ saleServices }) => {
  const [expanded, setExpanded] = useState(true);

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
        <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom={2}>
          <Box display="flex" alignItems="center">
            <LocalCarWashIcon sx={{ marginRight: 1, color: '#9FB404' }} />
            <Typography variant="h6" component="h2" fontWeight="bold">
              Servicios Vendidos
            </Typography>
          </Box>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
            size="small"
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
        
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {saleServices.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay servicios vendidos para este período y lavador.
            </Typography>
          ) : (
            <Box>
            {saleServices.map((service, index) => (
              <Box
                key={`${service.id}-${index}`}
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
                    {service.serviceId.service}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Porcentaje: {service.attentionId.percentage}%
                  </Typography>
                </Box>
                <Chip
                  label={formatPrice(service.value)}
                  color="success"
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            ))}
          </Box>
        )}
        </Collapse>
      </CardContent>
    </Card>
  );
};
