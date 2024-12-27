import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { formatPrice, removeFormatPrice } from "../../../utils/utils";

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

interface ModalEditServiceProps {
  isEditing: boolean;
  openModal: boolean;
  handleCreate: () => void;
  handleClose: () => void;
  handleEdit: () => void;
  services: any;
}

const ModalEditService: React.FC<ModalEditServiceProps> = ({
  isEditing,
  openModal,
  handleCreate,
  handleClose,
  handleEdit,
  services,
}) => {
  const { dataService, setDataService } = services;

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
            {isEditing ? "Editar" : "Nuevo"} Servicio
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <TextField
              id="service"
              label="Servicio"
              variant="outlined"
              value={dataService.service}
              onChange={(e) =>
                setDataService({ ...dataService, service: e.target.value })
              }
            />
            <TextField
              id="value"
              label="Valor"
              variant="outlined"
              value={dataService.value}
              onChange={(e) =>
                setDataService({
                  ...dataService,
                  value: formatPrice(removeFormatPrice(e.target.value)),
                })
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
              disabled={dataService.service === "" || dataService.value === 0}
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

export default ModalEditService;
