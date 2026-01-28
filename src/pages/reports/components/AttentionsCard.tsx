import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Collapse } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { WasherActivityAttention } from '../../../interfaces/interfaces';

interface AttentionsCardProps {
  attentions: WasherActivityAttention[];
}

export const AttentionsCard: React.FC<AttentionsCardProps> = ({ attentions }) => {
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
            <DirectionsCarIcon sx={{ marginRight: 1, color: '#9FB404' }} />
            <Typography variant="h6" component="h2" fontWeight="bold">
              Atenciones de Vehículos
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
          {attentions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay atenciones registradas para este período y lavador.
            </Typography>
          ) : (
            <Box>
            {attentions.map((attention) => (
              <Box
                key={attention.id}
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
                    {attention.vehicleId.plate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cliente: {attention.vehicleId.client}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Servicios: {attention.saleServices.length}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Chip
                    label={`${attention.percentage}%`}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                  <Chip
                    label={formatPrice(attention.washerProfit)}
                    color="success"
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              </Box>
            ))}
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};
