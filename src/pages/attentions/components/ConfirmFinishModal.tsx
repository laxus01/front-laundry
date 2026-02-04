import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Box,
} from "@mui/material";
import { PaymentStatus } from "../../../interfaces/interfaces";

interface ConfirmFinishModalProps {
  openModalFinish: boolean;
  handleCloseFinish: () => void;
  handleFinish: (paymentStatus: PaymentStatus, notes?: string) => void;
  title: string;
  message: string;
  totalValue: string;
}

const ConfirmFinishModal: React.FC<ConfirmFinishModalProps> = ({
  openModalFinish,
  handleCloseFinish,
  handleFinish,
  title,
  message,
  totalValue,
}) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PAID');
  const [notes, setNotes] = useState<string>('');

  const handleConfirm = () => {
    handleFinish(paymentStatus, notes);
    setPaymentStatus('PAID');
    setNotes('');
  };

  const handleClose = () => {
    handleCloseFinish();
    setPaymentStatus('PAID');
    setNotes('');
  };

  return (
    <Dialog
      open={openModalFinish}
      aria-labelledby="confirm-finish-dialog"
      PaperProps={{ sx: { padding: "20px" } }}
    >
      <DialogTitle id="confirm-finish-dialog">{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <DialogContentText>{message}</DialogContentText>
          <DialogTitle>${totalValue}</DialogTitle>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <DialogContentText sx={{ mb: 1, fontWeight: 'bold' }}>
            Estado de Pago:
          </DialogContentText>
          <RadioGroup
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
          >
            <FormControlLabel 
              value="PAID" 
              control={<Radio />} 
              label="Pagar ahora" 
            />
            <FormControlLabel 
              value="PENDING" 
              control={<Radio />} 
              label="Pago pendiente" 
            />
          </RadioGroup>
        </Box>

        {paymentStatus === 'PENDING' && (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Notas (opcional)"
              multiline
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Cliente pagará el viernes"
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{ bgcolor: "#FF3040", "&:hover": { bgcolor: "#d02636" } }}
        >
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="contained">
          Finalizar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmFinishModal;
