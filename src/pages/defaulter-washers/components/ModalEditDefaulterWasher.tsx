import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ComboBoxAutoComplete from "../../../components/ComboBoxAutoComplete";
import DatePickerComponent from "../../../components/DatePickerComponent";
import { formatMoneyInput, moneyToInteger } from "../../../utils/utils";
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

interface ModalEditDefaulterWasherProps {
  isEditing: boolean;
  openModal: boolean;
  handleCreate: () => void;
  handleClose: () => void;
  handleEdit: () => void;
  defaulterWasher: any;
  listWashers: any;
}

const ModalEditDefaulterWasher: React.FC<ModalEditDefaulterWasherProps> = ({
  isEditing,
  openModal,
  handleCreate,
  handleClose,
  handleEdit,
  defaulterWasher,
  listWashers,
}) => {
  const { dataDefaulterWasher, setDataDefaulterWasher } = defaulterWasher;

  const handleSelectWasher = (washerId: string) => {
    setDataDefaulterWasher({
      ...dataDefaulterWasher,
      washerId: washerId,
    });
  };

  const validateButton = () => {
    if (
      !dataDefaulterWasher.washerId ||
      moneyToInteger(dataDefaulterWasher.amount.toString()) === 0 ||
      dataDefaulterWasher.date === ""
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
            {isEditing ? "Editar" : "Nuevo"} Lavador en Mora
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <ComboBoxAutoComplete
              title="Lavador"
              options={listWashers}
              onSelect={handleSelectWasher}
              value={dataDefaulterWasher.washerId}
            />
            <TextField
              id="amount"
              label="Monto"
              variant="outlined"
              value={dataDefaulterWasher.amount}
              onChange={(e) =>
                setDataDefaulterWasher({ 
                  ...dataDefaulterWasher, 
                  amount: formatMoneyInput(e.target.value)
                })
              }
              required
            />
            <TextField
              id="description"
              label="Descripción"
              variant="outlined"
              type="text"
              multiline
              rows={3}
              value={dataDefaulterWasher.description}
              onChange={(e) =>
                setDataDefaulterWasher({ 
                  ...dataDefaulterWasher, 
                  description: e.target.value 
                })
              }
            />
            <DatePickerComponent
              label="Fecha"
              value={dataDefaulterWasher.date ? dayjs(dataDefaulterWasher.date).toDate() : null}
              onChange={(date) =>
                setDataDefaulterWasher({ 
                  ...dataDefaulterWasher, 
                  date: date ? dayjs(date).format('YYYY-MM-DD') : '' 
                })
              }
              required
              maxDate={dayjs().toDate()}
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

export default ModalEditDefaulterWasher;
