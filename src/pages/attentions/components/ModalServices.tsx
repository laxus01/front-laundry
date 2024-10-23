import { Button, Modal, Box, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ComboBoxAutoComplete from "../../../components/ComboBoxAutoComplete";

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

interface ModalServicesProps {
  listServices: any;
  isEditing: boolean;
  openModal: boolean;
  handleClose: () => void;
}

const ModalServices: React.FC<ModalServicesProps> = ({
  listServices,
  isEditing,
  openModal,
  handleClose,
}) => {
  const handleSelectVehicle = (id: number) => {
    console.log("Selected ID:", id);
  };

  

  return (
    <div>
      <Modal
        open={openModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            {isEditing ? "Editar Venta" : "Vender Servicio"}
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <ComboBoxAutoComplete
              title="Servicio"
              options={listServices}
              onSelect={handleSelectVehicle}
            />
          </Box>
          <Box display="flex" justifyContent="space-around" mt={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={isEditing ? <EditIcon /> : <SaveIcon />}
              
            >
              {isEditing ? "Editar" : "Guardar"}
            </Button>
            <Button
              variant="contained"
              onClick={() => {handleClose()}}
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

export default ModalServices;