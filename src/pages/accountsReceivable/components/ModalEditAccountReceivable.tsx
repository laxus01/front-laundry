import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DatePickerComponent from "../../../components/DatePickerComponent";
import ComboBoxAutoComplete from "../../../components/ComboBoxAutoComplete";
import ModalCreateVehicle from "./ModalCreateVehicle";
import { getVehicles } from "../services/AccountsReceivable.services";
import { formatMoneyInput, moneyToInteger } from "../../../utils/utils";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface ModalEditAccountReceivableProps {
  isEditing: boolean;
  openModal: boolean;
  handleCreate: () => void;
  handleClose: () => void;
  handleEdit: () => void;
  accountsReceivable: any;
}

const ModalEditAccountReceivable: React.FC<ModalEditAccountReceivableProps> = ({
  isEditing,
  openModal,
  handleCreate,
  handleClose,
  handleEdit,
  accountsReceivable,
}) => {
  const { dataAccountReceivable, setDataAccountReceivable } = accountsReceivable;
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [valueFormatted, setValueFormatted] = useState<string>("");
  const [openVehicleModal, setOpenVehicleModal] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('LoadData called - isEditing:', isEditing, 'openModal:', openModal);
        console.log('dataAccountReceivable:', dataAccountReceivable);
        
        // Always load all vehicles (both for create and edit mode)
        const vehiclesResponse = await getVehicles();
        if (vehiclesResponse?.data) {
          const vehicleOptions = vehiclesResponse.data.map((vehicle: any) => ({
            id: vehicle.id,
            name: `${vehicle.plate} - ${vehicle.client}`,
            plate: vehicle.plate,
            client: vehicle.client,
            phone: vehicle.phone,
          }));
          
          console.log('All vehicles loaded:', vehicleOptions);
          setVehicles(vehicleOptions);
          
          if (isEditing) {
            console.log('Edit mode - looking for vehicleId:', dataAccountReceivable.vehicleId);
            const currentVehicle = vehicleOptions.find((v: any) => v.id === dataAccountReceivable.vehicleId);
            console.log('Found current vehicle:', currentVehicle);
            
            if (!currentVehicle && dataAccountReceivable.vehicleId) {
              console.warn('Vehicle not found in options, vehicleId:', dataAccountReceivable.vehicleId);
            }
          } else {
            console.log('Create mode - vehicles loaded');
          }
        }
      } catch (error) {
        console.error('Error loading vehicles:', error);
      }
    };

    if (openModal) {
      loadData();
      // Initialize formatted value when modal opens
      if (dataAccountReceivable.value) {
        setValueFormatted(formatMoneyInput(dataAccountReceivable.value.toString()));
      } else {
        setValueFormatted("");
      }
    }
  }, [openModal, isEditing, dataAccountReceivable.vehicleId, dataAccountReceivable.vehicleName, dataAccountReceivable.value]);

  const handleSelectVehicle = (vehicleId: string) => {
    const selectedVehicle = vehicles.find(v => v.id === vehicleId);
    if (selectedVehicle) {
      setDataAccountReceivable({
        ...dataAccountReceivable,
        vehicleId: vehicleId,
        vehicleName: selectedVehicle.name,
        plate: selectedVehicle.plate,
        clientName: selectedVehicle.client,
        phone: selectedVehicle.phone,
      });
    }
  };

  const handleVehicleCreated = (newVehicle: { id: string; name: string; plate: string; client: string; phone: string }) => {
    // Add the new vehicle to the vehicles list
    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    
    // Auto-select the newly created vehicle
    setDataAccountReceivable({
      ...dataAccountReceivable,
      vehicleId: newVehicle.id,
      vehicleName: newVehicle.name,
      plate: newVehicle.plate,
      clientName: newVehicle.client,
      phone: newVehicle.phone,
    });
  };

  const handleOpenVehicleModal = () => {
    if (!isEditing) {
      setOpenVehicleModal(true);
    }
  };

  const handleCloseVehicleModal = () => {
    setOpenVehicleModal(false);
  };

  const validateButton = () => {
    if (
      !dataAccountReceivable.vehicleId ||
      !dataAccountReceivable.value ||
      dataAccountReceivable.date === "" ||
      dataAccountReceivable.detail === ""
    ) {
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
            {isEditing ? "Editar" : "Nueva"} Cuenta por Cobrar
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <Box display="flex" alignItems="center" gap={1} width="100%">
              <Box flexGrow={1}>
                <ComboBoxAutoComplete
                  title="Vehículo"
                  options={vehicles}
                  onSelect={handleSelectVehicle}
                  value={dataAccountReceivable.vehicleId}
                  disabled={isEditing}
                />
              </Box>
              {!isEditing && (
                <IconButton 
                  onClick={handleOpenVehicleModal}
                  color="primary"
                  title="Agregar nuevo vehículo"
                  sx={{ flexShrink: 0 }}
                >
                  <DirectionsCarIcon />
                </IconButton>
              )}
            </Box>
            <ModalCreateVehicle 
              openModal={openVehicleModal} 
              handleClose={handleCloseVehicleModal} 
              onVehicleCreated={handleVehicleCreated} 
            />
            <DatePickerComponent
              label="Fecha"
              value={dataAccountReceivable.date ? dayjs(dataAccountReceivable.date).toDate() : null}
              onChange={(date) =>
                setDataAccountReceivable({ 
                  ...dataAccountReceivable, 
                  date: date ? dayjs(date).format('YYYY-MM-DD') : '' 
                })
              }
              required
            />
            <TextField
              id="value"
              label="Valor"
              variant="outlined"
              value={valueFormatted}
              onChange={(e) => {
                const formatted = formatMoneyInput(e.target.value);
                setValueFormatted(formatted);
                setDataAccountReceivable({ 
                  ...dataAccountReceivable, 
                  value: moneyToInteger(formatted) 
                });
              }}
            />
            <TextField
              id="detail"
              label="Detalle"
              variant="outlined"
              multiline
              rows={3}
              value={dataAccountReceivable.detail}
              onChange={(e) =>
                setDataAccountReceivable({ 
                  ...dataAccountReceivable, 
                  detail: e.target.value 
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
              disabled={validateButton()}
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

export default ModalEditAccountReceivable;
