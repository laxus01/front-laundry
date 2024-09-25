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
  openModal: boolean;
  handleClose: () => void;
  handleEdit: () => void;
  vehicles: any
}

const ModalEditVehicle: React.FC<ModalEditVehicleProps> = ({
  openModal,
  handleClose,
  handleEdit,
  vehicles,
}) => {

  const { dataVehicle, setDataVehicle } = vehicles;

  const handleChangeTypeVehicle = (event: SelectChangeEvent<number>) => {
    console.log(event.target.value);
    
    setDataVehicle({ ...dataVehicle, typeVehicleId: event.target.value });
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
            Editar Vehículo
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <FormControl fullWidth>
              <InputLabel id="typeVehicleLabel">Tipo Vehículo</InputLabel>
              <Select
                labelId="typeVehicleLabel"
                id="typeVehicle"
                value={dataVehicle.typeVehicleId}
                label="Tipo Vehículo"
                onChange={handleChangeTypeVehicle}
              >
                <MenuItem value={1}>MOTOCICLETA</MenuItem>
                <MenuItem value={2}>AUTOMOVIL</MenuItem>
                <MenuItem value={3}>CAMIONETA</MenuItem>
                <MenuItem value={4}>CAMIÓN PEQUEÑO</MenuItem>
                <MenuItem value={5}>CAMIÓN GRANDE</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="client"
              label="Cliente"
              variant="outlined"
              value={dataVehicle.client}
              onChange={(e) => setDataVehicle({ ...dataVehicle, client: e.target.value })}
            />
            <TextField
              id="phone"
              label="Teléfono"
              variant="outlined"
              value={dataVehicle.phone}
              onChange={(e) => setDataVehicle({ ...dataVehicle, phone: e.target.value })}
            />
          </Box>
          <Box display="flex" justifyContent="space-around" mt={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => {
                handleEdit();
                handleClose();
              }}
            >
              Editar
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

export default ModalEditVehicle;
