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

interface ModalEditShoppingProps {
  isEditing: boolean;
  openModal: boolean;
  handleCreate: () => void;
  handleClose: () => void;
  handleEdit: () => void;
  shopping: any;
  listProducts: any;
}

const ModalEditShopping: React.FC<ModalEditShoppingProps> = ({
  isEditing,
  openModal,
  handleCreate,
  handleClose,
  handleEdit,
  shopping,
  listProducts,
}) => {
  const { dataShopping, setDataShopping } = shopping;

  const handleSelectProduct = (productId: string) => {
    setDataShopping({
      ...dataShopping,
      productId: productId,
    });
  };

  const validateButton = () => {
    if (
      !dataShopping.productId ||
      !dataShopping.quantity ||
      dataShopping.quantity <= 0 ||
      dataShopping.date === ""
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
            {isEditing ? "Editar" : "Nueva"} Compra
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <ComboBoxAutoComplete
              title="Producto"
              options={listProducts}
              onSelect={handleSelectProduct}
              value={dataShopping.productId}
            />
            <TextField
              id="quantity"
              label="Cantidad"
              variant="outlined"
              type="number"
              value={dataShopping.quantity}
              onChange={(e) =>
                setDataShopping({ 
                  ...dataShopping, 
                  quantity: parseInt(e.target.value) || 0 
                })
              }
              required
              inputProps={{ min: 1 }}
            />
            <DatePickerComponent
              label="Fecha de Compra"
              value={dataShopping.date ? dayjs(dataShopping.date).toDate() : null}
              onChange={(date) =>
                setDataShopping({ 
                  ...dataShopping, 
                  date: date ? dayjs(date).format('YYYY-MM-DD') : '' 
                })
              }
              required
              maxDate={new Date()}
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

export default ModalEditShopping;
