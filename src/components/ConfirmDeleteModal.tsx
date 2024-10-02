import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ConfirmDeleteModalProps {
  openModalDelete: boolean;
  handleCloseDelete: () => void;
  handleDelete: () => void;
  title?: string;
  message?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  openModalDelete,
  handleCloseDelete,
  handleDelete,
  title = "Eliminar Registro",
  message = "Esta seguro que desea eliminar este registro?",
}) => {
  return (
    <Dialog open={openModalDelete} aria-labelledby="confirm-delete-dialog">
      <DialogTitle id="confirm-delete-dialog">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
        <Button
          onClick={handleCloseDelete}
          variant="contained"
          sx={{ bgcolor: "#FF3040", "&:hover": { bgcolor: "#d02636" } }}
        >
          Cancelar
        </Button>
        <Button onClick={handleDelete} color="primary" variant="contained">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
