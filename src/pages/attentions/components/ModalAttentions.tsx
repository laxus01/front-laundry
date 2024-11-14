import { Button, Modal, Box, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ComboBoxAutoComplete from "../../../components/ComboBoxAutoComplete";
import { Vehicle, Washer } from "../../../interfaces/interfaces";
import { useState } from "react";
import uuid from "react-uuid";

const percentage = [
  { id: 40, name: "40" },
  { id: 35, name: "35" },
];

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

interface ModalAttentionsProps {
  listVehicles: any;
  listWashers: any;
  isEditing: boolean;
  openModal: boolean;
  handleClose: () => void;
  handleEdit: () => void;
  setAttention: (attention: any) => void;
}

const ModalAttentions: React.FC<ModalAttentionsProps> = ({
  listVehicles,
  listWashers,
  isEditing,
  openModal,
  handleClose,
  handleEdit,
  setAttention,
}) => {
  
  const [vehicleSelected, setVehicleSelected] = useState<Vehicle | null>(null);
  const [washerSelected, setWasherSelected] = useState<Washer | null>(null);
  const [percentageValue, setPercentageValue] = useState<number>(0);

  const getInfoVehicle = (id: number) => {
    return listVehicles.find((vehicle: Vehicle) => vehicle.id === id);
  };

  const getInfoWasher = (id: number) => {
    return listWashers.find((washer: Washer) => washer.id === id);
  };

  const getInfoAttentions = () => {
    const payload = {
      attentionId: uuid(),
      vehicle: vehicleSelected,
      washer: washerSelected,
      percentage: percentageValue,
      services: [],
      products: [],
    };
    return payload;
  }

  const handleSelectVehicle = (id: number) => {   
    const selectedVehicle = getInfoVehicle(id);
    setVehicleSelected(selectedVehicle);  
  };
  
  const handleSelectWasher = (id: number) => {
    const selectedWasher = getInfoWasher(id);
    setWasherSelected(selectedWasher);
  };

  const handleSelectPercentage = (value: number) => {
    setPercentageValue(value);  
  };

  const handleCreate = () => {
    setAttention(getInfoAttentions());
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
            {isEditing ? "Editar" : "Nueva"} Atención
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <ComboBoxAutoComplete
              title="Vehiculo"
              options={listVehicles}
              onSelect={handleSelectVehicle}
            />
            <ComboBoxAutoComplete
              title="Lavador"
              options={listWashers}
              onSelect={handleSelectWasher}
            />
            <ComboBoxAutoComplete
              title="Porcentaje"
              options={percentage}
              onSelect={handleSelectPercentage}
            />
          </Box>
          <Box display="flex" justifyContent="space-around" mt={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={isEditing ? <EditIcon /> : <SaveIcon />}
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
            <Button
              variant="contained"
              onClick={handleClose}
              sx={{ bgcolor: "#FF3040", "&:hover": { bgcolor: "#d02636" } }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalAttentions;
