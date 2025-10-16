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
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useState, useEffect } from "react";

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

interface ModalEditVehicleProps {
  isEditing: boolean;
  openModal: boolean;
  handleCreate: () => void;
  handleClose: () => void;
  handleEdit: () => void;
  vehicles: any;
}

const ModalEditVehicle: React.FC<ModalEditVehicleProps> = ({
  isEditing,
  openModal,
  handleCreate,
  handleClose,
  handleEdit,
  vehicles,
}) => {
  const { dataVehicle, setDataVehicle } = vehicles;
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);

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
    }
  }, [openModal]);
  const handleChangeTypeVehicle = (event: SelectChangeEvent<number>) => {
    setDataVehicle({ ...dataVehicle, typeVehicleId: event.target.value });
  };

  const validateButtonCreate = () => {
    if (
      dataVehicle.plate === "" ||
      dataVehicle.typeVehicleId === 0
    ) {
      return true;
    }
    return false;
  };

  const validateButtonEdit = () => {
    if (dataVehicle.plate === "" || dataVehicle.typeVehicleId === 0) {
      return true;
    }
    return false;
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            {isEditing ? "Editar" : "Nuevo"} Vehículo
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <TextField
              id="plate"
              label="Placa"
              variant="outlined"
              value={dataVehicle.plate}
              onChange={(e) =>
                setDataVehicle({ ...dataVehicle, plate: e.target.value })
              }
            />
            <FormControl fullWidth>
              <InputLabel id="typeVehicleLabel">Tipo Vehículo</InputLabel>
              <Select
                labelId="typeVehicleLabel"
                id="typeVehicle"
                value={dataVehicle.typeVehicleId}
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
              value={dataVehicle.client}
              onChange={(e) =>
                setDataVehicle({ ...dataVehicle, client: e.target.value })
              }
            />
            <TextField
              id="phone"
              label="Teléfono"
              variant="outlined"
              value={dataVehicle.phone}
              onChange={(e) =>
                setDataVehicle({ ...dataVehicle, phone: e.target.value })
              }
            />
          </Box>
          <Box display="flex" justifyContent="space-around" mt={3}>
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{ bgcolor: "#FF3040", "&:hover": { bgcolor: "#d02636" } }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={isEditing ? <EditIcon /> : <SaveIcon />}
              disabled={
                isEditing ? validateButtonEdit() : validateButtonCreate()
              }
              onClick={() => {
                if (isEditing) {
                  handleEdit();
                } else {
                  handleCreate();
                }
                handleClose();
              }}
            >
              {isEditing ? "Editar" : "Guardar"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalEditVehicle;
