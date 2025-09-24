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
import { formatMoneyInput, moneyToInteger } from "../../../utils/utils";
import { useState, useEffect } from "react";
import dayjs from "dayjs"; // Import dayjs

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

interface ModalEditExpenseProps {
  isEditing: boolean;
  openModal: boolean;
  handleCreate: () => void;
  handleClose: () => void;
  handleEdit: () => void;
  expenses: any;
}

const ModalEditExpense: React.FC<ModalEditExpenseProps> = ({
  isEditing,
  openModal,
  handleCreate,
  handleClose,
  handleEdit,
  expenses,
}) => {
  const { dataExpense, setDataExpense } = expenses;
  const [valueFormatted, setValueFormatted] = useState<string>("");

  useEffect(() => {
    if (openModal) {
      // Initialize formatted value when modal opens
      if (dataExpense.value) {
        setValueFormatted(formatMoneyInput(dataExpense.value.toString()));
      } else {
        setValueFormatted("");
      }
    }
  }, [openModal, dataExpense.value]);

  const validateButton = () => {
    if (
      !dataExpense.expense ||
      !dataExpense.value ||
      dataExpense.expense.trim() === "" ||
      dataExpense.date === ""
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
            {isEditing ? "Editar" : "Nuevo"} Gasto
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <TextField
              id="expense"
              label="Nombre del Gasto"
              variant="outlined"
              value={dataExpense.expense}
              onChange={(e) =>
                setDataExpense({ ...dataExpense, expense: e.target.value })
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
                setDataExpense({ ...dataExpense, value: moneyToInteger(formatted) });
              }}
              required
            />
            <DatePickerComponent
              label="Fecha del Gasto"
              value={dataExpense.date ? dayjs(dataExpense.date).toDate() : null}
              onChange={(date) =>
                setDataExpense({ ...dataExpense, date: date ? dayjs(date).format('YYYY-MM-DD') : '' })
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

export default ModalEditExpense;
