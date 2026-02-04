import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { AttentionDateRange } from "../../../interfaces/interfaces";
import { formatPrice } from "../../../utils/utils";

interface ConfirmPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => void;
  attention: AttentionDateRange;
  totalAmount: number;
}

const ConfirmPaymentModal: React.FC<ConfirmPaymentModalProps> = ({
  open,
  onClose,
  onConfirm,
  attention,
  totalAmount,
}) => {
  const [notes, setNotes] = useState<string>("");

  const handleConfirm = () => {
    onConfirm(notes);
    setNotes("");
  };

  const handleClose = () => {
    onClose();
    setNotes("");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="confirm-payment-dialog"
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { padding: "10px" } }}
    >
      <DialogTitle id="confirm-payment-dialog">
        Confirmar Pago de Atención
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            <strong>Vehículo:</strong> {attention.vehicleId?.plate || "N/A"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Cliente:</strong> {attention.vehicleId?.client || "N/A"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Lavador:</strong> {attention.washerId?.washer || "N/A"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Fecha Atención:</strong>{" "}
            {new Date(attention.createAt).toLocaleDateString("es-CO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h6">Total a Pagar:</Typography>
          <Typography variant="h6" sx={{ color: "#9FB404", fontWeight: "bold" }}>
            ${formatPrice(totalAmount)}
          </Typography>
        </Box>

        <DialogContentText sx={{ mb: 1 }}>
          ¿Confirmar que el cliente ha realizado el pago?
        </DialogContentText>

        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Notas (opcional)"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Pago en efectivo, transferencia, etc."
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-around", p: 2 }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{ bgcolor: "#FF3040", "&:hover": { bgcolor: "#d02636" } }}
        >
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained">
          Confirmar Pago
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmPaymentModal;
