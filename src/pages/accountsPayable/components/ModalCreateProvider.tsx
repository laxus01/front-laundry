import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useState, useEffect } from "react";
import { queryCreateProvider } from "../services/AccountsPayable.services";
import { useSnackbar } from "../../../contexts/SnackbarContext";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface ModalCreateProviderProps {
  openModal: boolean;
  handleClose: () => void;
  onProviderCreated: (provider: { id: string; name: string }) => void;
}

interface ProviderData {
  name: string;
  phone: string;
}

const ModalCreateProvider: React.FC<ModalCreateProviderProps> = ({
  openModal,
  handleClose,
  onProviderCreated,
}) => {
  const [providerData, setProviderData] = useState<ProviderData>({
    name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (openModal) {
      // Reset form when modal opens
      setProviderData({
        name: "",
        phone: "",
      });
    }
  }, [openModal]);

  const handleCreate = async () => {
    if (!providerData.name.trim()) {
      showSnackbar("El nombre del proveedor es requerido", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await queryCreateProvider(providerData);
      if (response?.data) {
        showSnackbar("Proveedor creado exitosamente", "success");
        // Call the callback with the new provider data
        onProviderCreated({
          id: response.data.id,
          name: response.data.name || response.data.provider,
        });
        handleClose();
      }
    } catch (error) {
      console.error("Error creating provider:", error);
      showSnackbar("Error al crear el proveedor", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateButton = () => {
    return !providerData.name.trim() || loading;
  };

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          Nuevo Proveedor
        </Typography>
        <Box display="flex" flexDirection="column" gap={2} mt={3}>
          <TextField
            id="name"
            label="Nombre del Proveedor"
            variant="outlined"
            value={providerData.name}
            onChange={(e) =>
              setProviderData({ ...providerData, name: e.target.value })
            }
            required
            fullWidth
          />
          <TextField
            id="phone"
            label="Teléfono"
            variant="outlined"
            value={providerData.phone}
            onChange={(e) =>
              setProviderData({ ...providerData, phone: e.target.value })
            }
            fullWidth
          />
        </Box>
        <Box display="flex" justifyContent="space-around" mt={3}>
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{ bgcolor: "#FF3040", "&:hover": { bgcolor: "#d02636" } }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={validateButton()}
            onClick={handleCreate}
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalCreateProvider;
