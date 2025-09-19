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
import { getClients } from "../services/AccountsReceivable.services";
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
  const [clients, setClients] = useState<any[]>([]);
  const [valueFormatted, setValueFormatted] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load clients for the dropdown
        if (!isEditing) {
          const clientsResponse = await getClients();
          if (clientsResponse?.data) {
            const clientOptions = clientsResponse.data.map((client: any) => ({
              id: client.id,
              name: client.client,
            }));
            setClients(clientOptions);
          }
        } else {
          // When editing, create a single client option from the existing data
          if (dataAccountReceivable.clientId && dataAccountReceivable.clientName) {
            const currentClient = {
              id: dataAccountReceivable.clientId,
              name: dataAccountReceivable.clientName,
            };
            setClients([currentClient]);
          }
        }
      } catch (error) {
        console.error('Error loading clients:', error);
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
  }, [openModal, dataAccountReceivable.value, isEditing]);

  const handleSelectClient = (clientId: string) => {
    const selectedClient = clients.find(c => c.id === clientId);
    if (selectedClient) {
      setDataAccountReceivable({
        ...dataAccountReceivable,
        clientId: clientId,
        clientName: selectedClient.name,
      });
    }
  };

  const validateButton = () => {
    if (
      !dataAccountReceivable.clientId ||
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
            <ComboBoxAutoComplete
              title="Cliente"
              options={clients}
              onSelect={handleSelectClient}
              value={dataAccountReceivable.clientId}
              disabled={isEditing}
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
