import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useState, useEffect } from "react";
import { queryCreateClient } from "../services/AccountsReceivable.services";
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

interface ModalCreateClientProps {
  openModal: boolean;
  handleClose: () => void;
  onClientCreated: (client: { id: string; name: string }) => void;
}

interface ClientData {
  client: string;
  phone: string;
}

const ModalCreateClient: React.FC<ModalCreateClientProps> = ({
  openModal,
  handleClose,
  onClientCreated,
}) => {
  const [clientData, setClientData] = useState<ClientData>({
    client: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (openModal) {
      // Reset form when modal opens
      setClientData({
        client: "",
        phone: "",
      });
    }
  }, [openModal]);

  const handleCreate = async () => {
    if (!clientData.client.trim()) {
      showSnackbar("El nombre del cliente es requerido", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await queryCreateClient(clientData);
      if (response?.data) {
        showSnackbar("Cliente creado exitosamente", "success");
        // Call the callback with the new client data
        onClientCreated({
          id: response.data.id,
          name: response.data.client,
        });
        handleClose();
      }
    } catch (error) {
      console.error("Error creating client:", error);
      showSnackbar("Error al crear el cliente", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateButton = () => {
    return !clientData.client.trim() || loading;
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
          Nuevo Cliente
        </Typography>
        <Box display="flex" flexDirection="column" gap={2} mt={3}>
          <TextField
            id="client"
            label="Nombre del Cliente"
            variant="outlined"
            value={clientData.client}
            onChange={(e) =>
              setClientData({ ...clientData, client: e.target.value })
            }
            required
            fullWidth
          />
          <TextField
            id="phone"
            label="Teléfono"
            variant="outlined"
            value={clientData.phone}
            onChange={(e) =>
              setClientData({ ...clientData, phone: e.target.value })
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

export default ModalCreateClient;
