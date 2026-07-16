import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { DefaulterWasherItem } from '../../../interfaces/interfaces';

interface DefaulterWashersCardProps {
  defaulterWashers: DefaulterWasherItem[];
}

export const DefaulterWashersCard: React.FC<DefaulterWashersCardProps> = ({ defaulterWashers }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    const d = new Date(date + 'T12:00:00');
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const totalDebt = defaulterWashers.reduce((sum, dw) => sum + (dw.amount || 0), 0);

  if (!defaulterWashers || defaulterWashers.length === 0) {
    return null;
  }

  return (
    <Card elevation={3} sx={{ borderRadius: 2, marginTop: 3 }}>
      <CardContent sx={{ padding: 3 }}>
        <Box display="flex" alignItems="center" marginBottom={2}>
          <WarningAmberIcon sx={{ marginRight: 1, color: '#ff9800', fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold" color="#ff9800">
            Lavadores en Mora ({defaulterWashers.length})
          </Typography>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fff3e0' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Lavador</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Monto</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {defaulterWashers.map((dw) => (
                <TableRow key={dw.id} hover>
                  <TableCell>{dw.washerName}</TableCell>
                  <TableCell>{dw.description || '-'}</TableCell>
                  <TableCell>{formatDate(dw.date)}</TableCell>
                  <TableCell align="right" sx={{ color: '#f44336', fontWeight: 'medium' }}>
                    {formatPrice(dw.amount)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} sx={{ fontWeight: 'bold', borderTop: '2px solid #ff9800' }}>
                  Total Deuda
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#f44336', borderTop: '2px solid #ff9800' }}>
                  {formatPrice(totalDebt)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
