import { Button, Modal, Box, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ComboBoxAutoComplete from "../../../components/ComboBoxAutoComplete";

const percentage = [
  { id: 1, name: "40" },
  { id: 2, name: "35" },
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
  handleCreate: () => void;
  handleClose: () => void;
  handleEdit: () => void;
}

const ModalAttentions: React.FC<ModalAttentionsProps> = ({
  listVehicles,
  listWashers,
  isEditing,
  openModal,
  handleCreate,
  handleClose,
  handleEdit,
}) => {
  const handleSelectVehicle = (id: number) => {
    console.log("Selected ID:", id);
  };

  const handleSelectWasher = (id: number) => {
    console.log("Selected ID:", id);
  };

  const handleSelectPercentage = (id: number) => {
    console.log("Selected ID:", id);
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
