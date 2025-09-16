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
import DatePickerComponent from "../../../components/DatePickerComponent";
import ComboBoxAutoComplete from "../../../components/ComboBoxAutoComplete";
import { getVehicles } from "../../vehicles/services/Vehicle.services";
import { formatMoneyInput, moneyToInteger } from "../../../utils/utils";
import { useState, useEffect } from "react";

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

interface ModalEditParkingProps {
  isEditing: boolean;
  openModal: boolean;
  handleCreate: () => void;
  handleClose: () => void;
  handleEdit: () => void;
  parkings: any;
}

const ModalEditParking: React.FC<ModalEditParkingProps> = ({
  isEditing,
  openModal,
  handleCreate,
  handleClose,
  handleEdit,
  parkings,
}) => {
  const { dataParking, setDataParking } = parkings;
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [parkingTypes, setParkingTypes] = useState<any[]>([]);
  const [valueFormatted, setValueFormatted] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load static data first (synchronously from localStorage)
        const staticData = localStorage.getItem("staticData");
        if (staticData) {
          const parsedStaticData = JSON.parse(staticData);
          if (parsedStaticData.typeVehicles) {
            setVehicleTypes(parsedStaticData.typeVehicles);
          }
          if (parsedStaticData.typeParkings) {
            const parkingTypeOptions = parsedStaticData.typeParkings.map((parkingType: any) => ({
              id: parkingType.id,
              name: parkingType.type,
            }));
            setParkingTypes(parkingTypeOptions);
          }
        }

        // Only fetch vehicles if we're creating a new parking (not editing)
        if (!isEditing) {
          const vehiclesResponse = await getVehicles();
          if (vehiclesResponse?.data) {
            const vehicleOptions = vehiclesResponse.data.map((vehicle: any) => ({
              id: vehicle.id,
              name: vehicle.plate,
              plate: vehicle.plate,
              client: vehicle.client,
              phone: vehicle.phone,
              typeVehicle: vehicle.typeVehicle.type,
              typeVehicleId: vehicle.typeVehicle.id.toString(),
            }));
            setVehicles(vehicleOptions);
          }
        } else {
          // When editing, create a single vehicle option from the existing parking data
          if (dataParking.vehicleId && dataParking.plate) {
            const currentVehicle = {
              id: dataParking.vehicleId,
              name: dataParking.plate,
              plate: dataParking.plate,
              client: dataParking.client,
              phone: dataParking.phone,
              typeVehicle: dataParking.vehicleType,
              typeVehicleId: dataParking.typeVehicleId || dataParking.vehicleType,
            };
            setVehicles([currentVehicle]);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    if (openModal) {
      loadData();
      // Initialize formatted value when modal opens
      if (dataParking.value) {
        setValueFormatted(formatMoneyInput(dataParking.value.toString()));
      } else {
        setValueFormatted("");
      }
      // Debug parking type selection
      console.log('Modal opened with dataParking:', dataParking);
      console.log('typeParkingId:', dataParking.typeParkingId);
    }
  }, [openModal, dataParking.value, isEditing]);

  // Additional useEffect to ensure parking type is set after options are loaded
  useEffect(() => {
    if (isEditing && parkingTypes.length > 0 && dataParking.typeParkingId) {
      console.log('Setting parking type after options loaded:', dataParking.typeParkingId);
      console.log('Available parking types:', parkingTypes);
    }
  }, [parkingTypes, dataParking.typeParkingId, isEditing]);
  
  const handleChangeVehicleType = (event: SelectChangeEvent<string>) => {
    setDataParking({ ...dataParking, vehicleType: event.target.value });
  };

  const handleSelectVehicle = (vehicleId: string) => {
    console.log('handleSelectVehicle called with vehicleId:', vehicleId);
    console.log('Available vehicles:', vehicles);
    const selectedVehicle = vehicles.find(v => v.id === vehicleId);
    console.log('Selected vehicle:', selectedVehicle);
    if (selectedVehicle) {
      const updatedData = {
        ...dataParking,
        plate: selectedVehicle.plate,
        client: selectedVehicle.client,
        phone: selectedVehicle.phone,
        vehicleType: selectedVehicle.typeVehicleId,
        vehicleId: vehicleId,
      };
      console.log('Updated parking data:', updatedData);
      setDataParking(updatedData);
    }
  };

  const handleSelectParkingType = (typeId: string) => {
    console.log('handleSelectParkingType called with typeId:', typeId);
    console.log('Available parking types:', parkingTypes);
    setDataParking({
      ...dataParking,
      typeParkingId: typeId,
    });
  };

  const validateButtonCreate = () => {
    if (
      !dataParking.vehicleId ||
      !dataParking.typeParkingId ||
      !dataParking.value ||
      dataParking.startDate === "" ||
      dataParking.endDate === ""
    ) {
      return true;
    }
    return false;
  };

  const validateButtonEdit = () => {
    if (
      dataParking.plate === "" ||
      dataParking.vehicleType === "" ||
      dataParking.client === "" ||
      dataParking.startDate === "" ||
      dataParking.endDate === ""
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
            {isEditing ? "Editar" : "Nuevo"} Parqueo
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <ComboBoxAutoComplete
              title="Placa"
              options={vehicles}
              onSelect={handleSelectVehicle}
              value={dataParking.vehicleId}
              disabled={isEditing}
            />
            <FormControl fullWidth>
              <InputLabel id="vehicleTypeLabel">Tipo Vehículo</InputLabel>
              <Select
                labelId="vehicleTypeLabel"
                id="vehicleType"
                value={dataParking.vehicleType}
                label="Tipo Vehículo"
                onChange={handleChangeVehicleType}
                disabled={isEditing}
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
              value={dataParking.client}
              onChange={(e) =>
                setDataParking({ ...dataParking, client: e.target.value })
              }
              disabled={isEditing}
              InputProps={{
                readOnly: isEditing,
              }}
            />
            <TextField
              id="value"
              label="Valor"
              variant="outlined"
              value={valueFormatted}
              onChange={(e) => {
                const formatted = formatMoneyInput(e.target.value);
                setValueFormatted(formatted);
                setDataParking({ ...dataParking, value: moneyToInteger(formatted) });
              }}
            />
            {parkingTypes.length > 0 && (
              <ComboBoxAutoComplete
                title="Tipo de Parqueo"
                options={parkingTypes}
                onSelect={handleSelectParkingType}
                value={dataParking.typeParkingId}
              />
            )}
            <DatePickerComponent
              label="Fecha Inicial"
              value={dataParking.startDate ? new Date(dataParking.startDate) : null}
              onChange={(date) =>
                setDataParking({ ...dataParking, startDate: date ? date.toISOString().split('T')[0] : '' })
              }
              required
            />
            <DatePickerComponent
              label="Fecha Final"
              value={dataParking.endDate ? new Date(dataParking.endDate) : null}
              onChange={(date) =>
                setDataParking({ ...dataParking, endDate: date ? date.toISOString().split('T')[0] : '' })
              }
              required
              minDate={dataParking.startDate ? new Date(dataParking.startDate) : undefined}
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

export default ModalEditParking;
