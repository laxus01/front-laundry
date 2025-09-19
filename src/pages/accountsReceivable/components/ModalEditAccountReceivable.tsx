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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DatePickerComponent from "../../../components/DatePickerComponent";
import ComboBoxAutoComplete from "../../../components/ComboBoxAutoComplete";
import ModalCreateClient from "./ModalCreateClient";
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
  const [openClientModal, setOpenClientModal] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('LoadData called - isEditing:', isEditing, 'openModal:', openModal);
        console.log('dataAccountReceivable:', dataAccountReceivable);
        
        // Load clients for the dropdown
        if (!isEditing) {
          const clientsResponse = await getClients();
          if (clientsResponse?.data) {
            const clientOptions = clientsResponse.data.map((client: any) => ({
              id: client.id,
              name: client.client,
            }));
            console.log('Setting all clients for create mode:', clientOptions);
            setClients(clientOptions);
          }
        } else {
          // When editing, create a single client option from the existing data
          console.log('Edit mode - clientId:', dataAccountReceivable.clientId, 'clientName:', dataAccountReceivable.clientName);
          
          if (dataAccountReceivable.clientId) {
            const currentClient = {
              id: dataAccountReceivable.clientId,
              name: dataAccountReceivable.clientName || "Cliente no encontrado",
            };
            console.log('Setting current client for edit mode:', currentClient);
            setClients([currentClient]);
          } else {
            console.warn('No clientId found in edit mode, loading all clients as fallback');
            // Fallback: load all clients if clientId is missing
            const clientsResponse = await getClients();
            if (clientsResponse?.data) {
              const clientOptions = clientsResponse.data.map((client: any) => ({
                id: client.id,
                name: client.client,
              }));
              setClients(clientOptions);
            }
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
  }, [openModal, isEditing, dataAccountReceivable.clientId, dataAccountReceivable.clientName, dataAccountReceivable.value]);

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

  const handleClientCreated = (newClient: { id: string; name: string }) => {
    // Add the new client to the clients list
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    
    // Auto-select the newly created client
    setDataAccountReceivable({
      ...dataAccountReceivable,
      clientId: newClient.id,
      clientName: newClient.name,
    });
  };

  const handleOpenClientModal = () => {
    if (!isEditing) {
      setOpenClientModal(true);
    }
  };

  const handleCloseClientModal = () => {
    setOpenClientModal(false);
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
            <Box display="flex" alignItems="center" gap={1} width="100%">
              <Box flexGrow={1}>
                <ComboBoxAutoComplete
                  title="Cliente"
                  options={clients}
                  onSelect={handleSelectClient}
                  value={dataAccountReceivable.clientId}
                  disabled={isEditing}
                />
              </Box>
              {!isEditing && (
                <IconButton 
                  onClick={handleOpenClientModal}
                  color="primary"
                  title="Agregar nuevo cliente"
                  sx={{ flexShrink: 0 }}
                >
                  <PersonAddIcon />
                </IconButton>
              )}
            </Box>
            <ModalCreateClient 
              openModal={openClientModal} 
              handleClose={handleCloseClientModal} 
              onClientCreated={handleClientCreated} 
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
