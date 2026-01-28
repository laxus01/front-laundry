import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Collapse } from '@mui/material';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Advance } from '../../../interfaces/interfaces';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AdvancesCardProps {
  advances: Advance[];
}

export const AdvancesCard: React.FC<AdvancesCardProps> = ({ advances }) => {
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

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm", { locale: es });
    } catch (error) {
      return dateString;
    }
  };

  const totalAdvances = advances.reduce((sum, advance) => sum + (advance.value || 0), 0);

  return (
    <Card sx={{ marginBottom: 2, borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <TrendingDownIcon sx={{ marginRight: 1, color: '#9FB404' }} />
            <Typography variant="h6" component="h2" fontWeight="bold">
              Avances
            </Typography>
            {expanded && (
              <Chip
                label={`Total: ${formatPrice(totalAdvances)}`}
                color="error"
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            )}
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
          {advances.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay avances para este período y lavador.
            </Typography>
          ) : (
            <Box>
            {advances.map((advance) => (
              <Box
                key={advance.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 2,
                  marginBottom: 1,
                  backgroundColor: '#fff3f3',
                  borderRadius: 1,
                  border: '1px solid #ffcdd2',
                  '&:hover': {
                    backgroundColor: '#ffe8e8',
                  },
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="medium" color="error.main">
                    Avance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDateTime(advance.createAt || advance.date)}
                  </Typography>
                </Box>
                <Chip
                  label={formatPrice(advance.value)}
                  color="error"
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
