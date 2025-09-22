import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ComboBoxAutoComplete from "../../../components/ComboBoxAutoComplete";
import { Washer } from "../../../interfaces/interfaces";
import { useState } from "react";
import DatePickerComponent from "../../../components/DatePickerComponent";
import dayjs from "dayjs";

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

interface ModalEditSaleProps {
  isEditing: boolean;
  openModal: boolean;
  handleCreate: () => void;
  handleClose: () => void;
  handleEdit: () => void;
  sales: any;
  listWashers: any;
  listProducts: any;
}

const ModalEditSale: React.FC<ModalEditSaleProps> = ({
  isEditing,
  openModal,
  handleCreate,
  handleClose,
  handleEdit,
  sales,
  listWashers,
  listProducts,
}) => {
  const [isWorkerSale, setIsWorkerSale] = useState(false);
  const { dataSale, setDataSale } = sales;

  const getInfoWasher = (id: string) => {
    return listWashers.find((washer: Washer) => washer.id === id);
  };

  const getInfoProduct = (id: string) => {
    return listProducts.find((product: any) => product.id === id);
  };

  const handleSelectWasher = (id: string) => {
    const selectedWasher = getInfoWasher(id);
    setDataSale({ ...dataSale, washerId: selectedWasher.id });
  };

  const handleProduct = (id: string) => {
    const selectedProduct = getInfoProduct(id);
    setDataSale({
      ...dataSale,
      productId: selectedProduct.id,
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
            {isEditing ? "Editar" : "Nueva"} Venta
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <ComboBoxAutoComplete
              title="Producto"
              options={listProducts}
              onSelect={handleProduct}
              value={dataSale.productId}
            />
            <TextField
              id="quantity"
              label="Cantidad"
              variant="outlined"
              value={dataSale.quantity}
              onChange={(e) =>
                setDataSale({
                  ...dataSale,
                  quantity: Number(e.target.value),
                })
              }
            />
            <DatePickerComponent
              label="Fecha"
              value={dataSale.date ? dayjs(dataSale.date).toDate() : null}
              onChange={(date) =>
                setDataSale({ ...dataSale, date: date ? dayjs(date).format('YYYY-MM-DD') : '' })
              }
              required
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isWorkerSale}
                    onChange={(e) => setIsWorkerSale(e.target.checked)}
                  />
                }
                label="Venta a trabajador"
              />
            </FormGroup>
            {isWorkerSale && (
              <ComboBoxAutoComplete
                title="Lavador"
                options={listWashers}
                onSelect={handleSelectWasher}
                value={dataSale.washerId}
              />
            )}
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
                dataSale.productId === "" ||
                dataSale.quantity === 0 ||
                (isWorkerSale && dataSale.washerId === "")
              }
              onClick={() => {
                if (isEditing) {
                  handleEdit();
                } else {
                  handleCreate();
                }
                handleClose();
                setIsWorkerSale(false);
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

export default ModalEditSale;
