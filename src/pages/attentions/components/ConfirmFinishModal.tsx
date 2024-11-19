import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ConfirmFinishModalProps {
  openModalFinish: boolean;
  handleCloseFinish: () => void;
  handleFinish: () => void;
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
  return (
    <Dialog
      open={openModalFinish}
      aria-labelledby="confirm-finish-dialog"
      PaperProps={{ sx: { padding: "20px" } }}
    >
      <DialogTitle id="confirm-finish-dialog">{title}</DialogTitle>
      <DialogContent sx={{ display: "flex", alignItems: "center" }}>
        <DialogContentText>{message}</DialogContentText>
        <DialogTitle>${totalValue}</DialogTitle>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
        <Button
          onClick={handleCloseFinish}
          variant="contained"
          sx={{ bgcolor: "#FF3040", "&:hover": { bgcolor: "#d02636" } }}
        >
          Cancelar
        </Button>
        <Button onClick={handleFinish} color="primary" variant="contained">
          Finalizar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmFinishModal;
