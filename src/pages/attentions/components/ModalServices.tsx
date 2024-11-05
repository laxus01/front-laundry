import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ComboBoxAutoComplete from "../../../components/ComboBoxAutoComplete";
import { useEffect, useState } from "react";
import { useAttentions } from "../hooks/useAttentions";
import uuid from 'react-uuid';

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
  isEditing: boolean;
  openModal: boolean;
  handleClose: () => void;
  setService: (service: any) => void;
}

const ModalServices: React.FC<ModalServicesProps> = ({
  isEditing,
  openModal,
  handleClose,
  setService,
}) => {

  const { listServices, getListServices } = useAttentions();
  const [valueService, setValueService] = useState<number>(0);
  const [serviceId, setServiceId] = useState<number>(0);

  const getInfoService = (id: number) => {
    return listServices.find(service => service.id === id);
  };

  const handleSelectService = (id: number) => {   
    setServiceId(id); 
    const selectedService = getInfoService(id);
    setValueService(selectedService?.value || 0);  
  };

  const addToListServices = () => {
    const serviceSelected = listServices.find(
      (service) => service.id === serviceId
    );
    const service = {...serviceSelected, uuid: uuid()};
    setService(service);
  };

  useEffect(() => {
    getListServices();
  }, []);

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
              onSelect={handleSelectService}
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <TextField
              id="Valor"
              label="value"
              variant="outlined"
              value={valueService}
              onChange={(e) => setValueService(Number(e.target.value))}
            />
          </Box>
          <Box display="flex" justifyContent="space-around" mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={addToListServices}
              startIcon={isEditing ? <EditIcon /> : <SaveIcon />}
            >
              {isEditing ? "Editar" : "Guardar"}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleClose();
                setValueService(0);
              }}
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
