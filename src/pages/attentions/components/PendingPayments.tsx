import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { AttentionDateRange } from "../../../interfaces/interfaces";
import {
  getPendingPaymentAttentions,
  updateAttentionPaymentStatus,
} from "../services/Attentions.services";
import { formatPrice } from "../../../utils/utils";
import ConfirmPaymentModal from "./ConfirmPaymentModal";

export const PendingPayments = () => {
  const [pendingAttentions, setPendingAttentions] = useState<AttentionDateRange[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAttention, setSelectedAttention] = useState<AttentionDateRange | null>(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const fetchPendingAttentions = async () => {
    setLoading(true);
    try {
      const response = await getPendingPaymentAttentions();
      if (response?.data) {
        setPendingAttentions(response.data);
      }
    } catch (error) {
      console.error("Error fetching pending attentions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPaymentModal = (attention: AttentionDateRange) => {
    setSelectedAttention(attention);
    setOpenPaymentModal(true);
  };

  const handleConfirmPayment = async (notes?: string) => {
    if (!selectedAttention) return;

    try {
      const payload = {
        paymentStatus: "PAID",
        paymentDate: new Date().toISOString(),
        notes: notes || null,
      };

      await updateAttentionPaymentStatus(selectedAttention.id, payload);
      setOpenPaymentModal(false);
      setSelectedAttention(null);
      await fetchPendingAttentions();
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const calculateTotal = (attention: AttentionDateRange) => {
    let total = 0;
    
    attention.saleServices?.forEach((service) => {
      total += service.value || 0;
    });

    attention.products?.forEach((product) => {
      total += (product.saleValue || 0) * (product.quantity || 0);
    });

    return total;
  };

  useEffect(() => {
    fetchPendingAttentions();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ color: "#9FB404", flexGrow: 1 }}>
          Atenciones Pendientes
        </Typography>
        <Chip
          label={`${pendingAttentions.length} pendiente(s)`}
          color="warning"
          sx={{ fontWeight: "bold" }}
        />
      </Box>

      {pendingAttentions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            No hay atenciones pendientes de pago
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Fecha Atención</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Vehículo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Cliente</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Lavador</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">
                  Total
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Estado
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">
                  Acción
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingAttentions.map((attention) => (
                <TableRow key={attention.id} hover>
                  <TableCell>
                    {new Date(attention.createAt).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{attention.vehicleId?.plate || "N/A"}</TableCell>
                  <TableCell>{attention.vehicleId?.client || "N/A"}</TableCell>
                  <TableCell>{attention.washerId?.washer || "N/A"}</TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: "bold", color: "#9FB404" }}>
                      ${formatPrice(calculateTotal(attention))}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label="Pendiente" color="warning" size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenPaymentModal(attention)}
                    >
                      Registrar Pago
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedAttention && (
        <ConfirmPaymentModal
          open={openPaymentModal}
          onClose={() => {
            setOpenPaymentModal(false);
            setSelectedAttention(null);
          }}
          onConfirm={handleConfirmPayment}
          attention={selectedAttention}
          totalAmount={calculateTotal(selectedAttention)}
        />
      )}
    </Box>
  );
};
