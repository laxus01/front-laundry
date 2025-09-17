import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { WasherActivityAttention } from '../../../interfaces/interfaces';
import { formatPrice } from '../../../utils/utils';

interface AttentionsCardProps {
  attentions: WasherActivityAttention[];
}

export const AttentionsCard: React.FC<AttentionsCardProps> = ({ attentions }) => {
  return (
    <Card sx={{ marginBottom: 2, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" marginBottom={2}>
          <DirectionsCarIcon sx={{ marginRight: 1, color: '#9FB404' }} />
          <Typography variant="h6" component="h2" fontWeight="bold">
            Atenciones de Vehículos
          </Typography>
        </Box>
        
        {attentions.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No hay atenciones registradas para esta fecha y lavador.
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
                    Ganancia lavador: 
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
      </CardContent>
    </Card>
  );
};
