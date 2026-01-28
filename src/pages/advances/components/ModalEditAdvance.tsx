import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ComboBoxAutoComplete from "../../../components/ComboBoxAutoComplete";
import { formatMoneyInput, moneyToInteger } from "../../../utils/utils";

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

interface ModalEditAdvanceProps {
  isEditing: boolean;
  openModal: boolean;
  handleCreate: () => void;
  handleClose: () => void;
  handleEdit: () => void;
  advances: any;
  listWashers: any[];
}

const ModalEditAdvance: React.FC<ModalEditAdvanceProps> = ({
  isEditing,
  openModal,
  handleCreate,
  handleClose,
  handleEdit,
  advances,
  listWashers,
}) => {
  const { dataAdvance, setDataAdvance } = advances;

  const handleSelectWasher = (id: string) => {
    const selectedWasher = listWashers.find((washer) => washer.id === id);
    setDataAdvance({
      ...dataAdvance,
      washerId: id,
      washerName: selectedWasher?.name || "",
    });
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
            {isEditing ? "Editar" : "Nuevo"} Avance
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <ComboBoxAutoComplete
              title="Lavador"
              options={listWashers}
              onSelect={handleSelectWasher}
              value={dataAdvance.washerId}
            />
            <TextField
              id="value"
              label="Valor"
              variant="outlined"
              value={dataAdvance.value}
              onChange={(e) =>
                setDataAdvance({
                  ...dataAdvance,
                  value: formatMoneyInput(e.target.value),
                })
              }
            />
            <TextField
              id="date"
              label="Fecha"
              type="date"
              variant="outlined"
              value={dataAdvance.date}
              onChange={(e) =>
                setDataAdvance({
                  ...dataAdvance,
                  date: e.target.value,
                })
              }
              InputLabelProps={{
                shrink: true,
              }}
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
                !dataAdvance.washerId ||
                moneyToInteger(dataAdvance.value.toString()) === 0 ||
                !dataAdvance.date
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

export default ModalEditAdvance;
