import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { formatPrice, removeFormatPrice } from "../../../utils/utils";

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

interface ModalEditProductProps {
  isEditing: boolean;
  openModal: boolean;
  handleCreate: () => void;
  handleClose: () => void;
  handleEdit: () => void;
  products: any;
}

const ModalEditProduct: React.FC<ModalEditProductProps> = ({
  isEditing,
  openModal,
  handleCreate,
  handleClose,
  handleEdit,
  products,
}) => {
  const { dataProduct, setDataProduct } = products;

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
            {isEditing ? "Editar" : "Nuevo"} Producto
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <TextField
              id="product"
              label="Producto"
              variant="outlined"
              value={dataProduct.product}
              onChange={(e) =>
                setDataProduct({ ...dataProduct, product: e.target.value })
              }
            />
            <TextField
              id="valueBuys"
              label="Valor de Compra"
              variant="outlined"
              value={dataProduct.valueBuys}
              onChange={(e) =>
                setDataProduct({
                  ...dataProduct,
                  valueBuys: formatPrice(Number(removeFormatPrice(e.target.value))),
                })
              }
            />
            <TextField
              id="saleValue"
              label="Valor de Venta"
              variant="outlined"
              value={dataProduct.saleValue}
              onChange={(e) =>
                setDataProduct({
                  ...dataProduct,
                  saleValue: formatPrice(Number(removeFormatPrice(e.target.value))),
                })
              }
            />
            <TextField
              id="existence"
              label="Existencia"
              variant="outlined"
              value={dataProduct.existence}
              onChange={(e) =>
                setDataProduct({
                  ...dataProduct,
                  existence: formatPrice(Number(removeFormatPrice(e.target.value))),
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
              disabled={
                dataProduct.product === "" ||
                dataProduct.valueBuys === 0 ||
                dataProduct.saleValue === 0 ||
                dataProduct.existence === 0
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

export default ModalEditProduct;
