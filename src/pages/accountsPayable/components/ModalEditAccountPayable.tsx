import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DatePickerComponent from "../../../components/DatePickerComponent";
import ComboBoxAutoComplete from "../../../components/ComboBoxAutoComplete";
import { getProviders } from "../services/AccountsPayable.services";
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

interface ModalEditAccountPayableProps {
  isEditing: boolean;
  openModal: boolean;
  handleCreate: () => void;
  handleClose: () => void;
  handleEdit: () => void;
  accountsPayable: any;
}

const ModalEditAccountPayable: React.FC<ModalEditAccountPayableProps> = ({
  isEditing,
  openModal,
  handleCreate,
  handleClose,
  handleEdit,
  accountsPayable,
}) => {
  const { dataAccountPayable, setDataAccountPayable } = accountsPayable;
  const [providers, setProviders] = useState<any[]>([]);
  const [valueFormatted, setValueFormatted] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load providers for the dropdown
        if (!isEditing) {
          const providersResponse = await getProviders();
          if (providersResponse?.data) {
            const providerOptions = providersResponse.data.map((provider: any) => ({
              id: provider.id,
              name: provider.name,
            }));
            setProviders(providerOptions);
          }
        } else {
          // When editing, create a single provider option from the existing data
          if (dataAccountPayable.providerId && dataAccountPayable.providerName) {
            const currentProvider = {
              id: dataAccountPayable.providerId,
              name: dataAccountPayable.providerName,
            };
            setProviders([currentProvider]);
          }
        }
      } catch (error) {
        console.error('Error loading providers:', error);
      }
    };

    if (openModal) {
      loadData();
      // Initialize formatted value when modal opens
      if (dataAccountPayable.value) {
        setValueFormatted(formatMoneyInput(dataAccountPayable.value.toString()));
      } else {
        setValueFormatted("");
      }
    }
  }, [openModal, dataAccountPayable.value, isEditing]);

  const handleSelectProvider = (providerId: string) => {
    const selectedProvider = providers.find(p => p.id === providerId);
    if (selectedProvider) {
      setDataAccountPayable({
        ...dataAccountPayable,
        providerId: providerId,
        providerName: selectedProvider.name,
      });
    }
  };

  const validateButton = () => {
    if (
      !dataAccountPayable.providerId ||
      !dataAccountPayable.value ||
      dataAccountPayable.date === "" ||
      dataAccountPayable.detail === ""
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
            {isEditing ? "Editar" : "Nueva"} Cuenta por Pagar
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <ComboBoxAutoComplete
              title="Proveedor"
              options={providers}
              onSelect={handleSelectProvider}
              value={dataAccountPayable.providerId}
              disabled={isEditing}
            />
            <DatePickerComponent
              label="Fecha"
              value={dataAccountPayable.date ? dayjs(dataAccountPayable.date).toDate() : null}
              onChange={(date) =>
                setDataAccountPayable({ 
                  ...dataAccountPayable, 
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
                setDataAccountPayable({ 
                  ...dataAccountPayable, 
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
              value={dataAccountPayable.detail}
              onChange={(e) =>
                setDataAccountPayable({ 
                  ...dataAccountPayable, 
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

export default ModalEditAccountPayable;
