import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ComboBoxAutoComplete from "../../../components/ComboBoxAutoComplete";
import { useAttentions } from "../hooks/useAttentions";
import { useEffect, useState } from "react";

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

interface ModalProductsProps {
  isEditing: boolean;
  openModal: boolean;
  handleClose: () => void;
  setProduct: (product: any) => void;
}

const ModalProducts: React.FC<ModalProductsProps> = ({
  isEditing,
  openModal,
  handleClose,
  setProduct,
}) => {
  const { listProducts, getListProducts } = useAttentions();

  const [valueProduct, setValueProduct] = useState<number>(0);
  const [quantityProduct, setQuantityProduct] = useState<number>(0);
  const [productId, setProductId] = useState<string>("");

  const getInfoProduct = (id: string) => {
    return listProducts.find((product) => product.id === id);
  };

  const handleSelectProduct = (id: string) => {
    setProductId(id);
    const selectedProduct = getInfoProduct(id);
    setValueProduct(selectedProduct?.value || 0);
  };

  const addToListProducts = () => {
    const productSelected = listProducts.find(
      (product) => product.id === productId
    );
    setProduct({ ...productSelected, quantity: quantityProduct });
    closeModal();
  };

  const closeModal = () => {
    setProductId("");
    setValueProduct(0);
    setQuantityProduct(0);
    handleClose();
  };

  useEffect(() => {
    getListProducts();
  }, []);

  return (
    <div>
      <Modal
        open={openModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            {isEditing ? "Editar Venta" : "Vender Producto"}
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <ComboBoxAutoComplete
              title="Producto"
              options={listProducts}
              onSelect={handleSelectProduct}
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <TextField
              id="Valor"
              label="value"
              variant="outlined"
              value={valueProduct}
              onChange={(e) => setValueProduct(Number(e.target.value))}
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={2} mt={3}>
            <TextField
              id="Cantidad"
              label="quantity"
              variant="outlined"
              value={quantityProduct}
              onChange={(e) => setQuantityProduct(Number(e.target.value))}
            />
          </Box>
          <Box display="flex" justifyContent="space-around" mt={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={isEditing ? <EditIcon /> : <SaveIcon />}
              onClick={addToListProducts}
              disabled={!productId || !quantityProduct || !valueProduct}
            >
              {isEditing ? "Editar" : "Guardar"}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                closeModal();
              }}
              sx={{ bgcolor: "#FF3040", "&:hover": { bgcolor: "#d02636" } }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalProducts;
