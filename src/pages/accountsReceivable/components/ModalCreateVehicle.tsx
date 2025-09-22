import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useState, useEffect } from "react";
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

interface ModalCreateVehicleProps {
  openModal: boolean;
  handleClose: () => void;
  onVehicleCreated: (newVehicle: { id: string; name: string; plate: string; client: string; phone: string }) => void;
}

const ModalCreateVehicle: React.FC<ModalCreateVehicleProps> = ({
  openModal,
  handleClose,
  onVehicleCreated,
}) => {
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [vehicleData, setVehicleData] = useState({
    plate: "",
    client: "",
    phone: "",
    typeVehicleId: 0,
  });

  useEffect(() => {
    if (openModal) {
      // Load vehicle types from localStorage
      const staticData = localStorage.getItem("staticData");
      if (staticData) {
        const parsedStaticData = JSON.parse(staticData);
        if (parsedStaticData.typeVehicles) {
          setVehicleTypes(parsedStaticData.typeVehicles);
        }
      }
      // Reset form
      setVehicleData({
        plate: "",
        client: "",
        phone: "",
        typeVehicleId: 0,
      });
    }
  }, [openModal]);

  const handleChangeTypeVehicle = (event: SelectChangeEvent<number>) => {
    setVehicleData({ ...vehicleData, typeVehicleId: event.target.value as number });
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      
      const payload = {
        plate: vehicleData.plate,
        client: vehicleData.client,
        phone: vehicleData.phone,
        typeVehicleId: vehicleData.typeVehicleId,
      };

      // Import the service function dynamically to avoid circular dependencies
      const { queryCreateVehicleById } = await import("../../vehicles/services/Vehicle.services");
      const response = await queryCreateVehicleById(payload);
      
      if (response?.data) {
        const newVehicle = {
          id: response.data.id,
          name: `${vehicleData.plate} - ${vehicleData.client}`,
          plate: vehicleData.plate,
          client: vehicleData.client,
          phone: vehicleData.phone,
        };
        
        onVehicleCreated(newVehicle);
        showSnackbar("Vehículo creado exitosamente", "success");
        handleClose();
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al crear el vehículo", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateButton = () => {
    return (
      vehicleData.plate === "" ||
      vehicleData.client === "" ||
      vehicleData.typeVehicleId === 0
    );
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
          Nuevo Vehículo
        </Typography>
        <Box display="flex" flexDirection="column" gap={2} mt={3}>
          <TextField
            id="plate"
            label="Placa"
            variant="outlined"
            value={vehicleData.plate}
            onChange={(e) =>
              setVehicleData({ ...vehicleData, plate: e.target.value })
            }
            required
          />
          <FormControl fullWidth required>
            <InputLabel id="typeVehicleLabel">Tipo Vehículo</InputLabel>
            <Select
              labelId="typeVehicleLabel"
              id="typeVehicle"
              value={vehicleData.typeVehicleId}
              label="Tipo Vehículo"
              onChange={handleChangeTypeVehicle}
            >
              {vehicleTypes.map((vehicleType) => (
                <MenuItem key={vehicleType.id} value={vehicleType.id}>
                  {vehicleType.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            id="client"
            label="Cliente"
            variant="outlined"
            value={vehicleData.client}
            onChange={(e) =>
              setVehicleData({ ...vehicleData, client: e.target.value })
            }
            required
          />
          <TextField
            id="phone"
            label="Teléfono"
            variant="outlined"
            value={vehicleData.phone}
            onChange={(e) =>
              setVehicleData({ ...vehicleData, phone: e.target.value })
            }
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
            disabled={validateButton() || loading}
            onClick={handleCreate}
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalCreateVehicle;
