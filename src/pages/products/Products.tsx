import { Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TableComponent from "../../components/TableComponent";
import { useEffect, useState } from "react";
import { ListProducts } from "../../interfaces/interfaces";
import { formatPrice, removeFormatPrice } from "../../utils/utils";
import ModalEditProduct from "./components/ModalEditProduct";
import { getProducts, queryCreateProduct, queryDeleteProductById, queryEditProductById } from "./services/Products.services";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { useProducts } from "./hooks/useProducts";
import { useSnackbar } from "../../contexts/SnackbarContext";

const columns = [
  { id: "product", label: "Producto", minWidth: 200 },
  { id: "valueBuys", label: "Valor Compra", minWidth: 200 },
  { id: "saleValue", label: "Valor Venta", minWidth: 200 },
  { id: "existence", label: "Existencia", minWidth: 200 },
];

const styleIconAdd = {
  display: "flex",
  alignItems: "center",
  padding: "20px",
};

export const Products = () => {

  const products = useProducts();
  const { dataProduct, setDataProduct, defaultProduct } = products;
  const { showSnackbar } = useSnackbar();

  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const openModalCreate = () => {
    setIsEditing(false);
    setDataProduct(defaultProduct);
    setOpenModal(true);
  };

  const handleCreate = async () => {    
    const payload = {
      product: dataProduct.product,
      valueBuys: removeFormatPrice(dataProduct.valueBuys.toString()),
      saleValue: removeFormatPrice(dataProduct.saleValue.toString()),
      existence: removeFormatPrice(dataProduct.existence.toString()),
    };    
    const response = await queryCreateProduct(payload);
    if (response) {
      getListProducts();
      setOpenModal(false);
      setDataProduct(defaultProduct);
      showSnackbar("Producto creado exitosamente", "success");
    }
  };

  const handleEdit = async () => {
    const payload = {
      product: dataProduct.product,
      valueBuys: removeFormatPrice(dataProduct.valueBuys.toString()),
      saleValue: removeFormatPrice(dataProduct.saleValue.toString()),
      existence: removeFormatPrice(dataProduct.existence.toString()),
    };
    const response = await queryEditProductById(dataProduct.id, payload);
    if (response) {
      getListProducts();
      setOpenModal(false);
      setDataProduct(defaultProduct);
    }
  };

  const handleDelete = async () => {
    const response = await queryDeleteProductById(dataProduct.id);
    if (response) {
      setDataProduct(defaultProduct);
      getListProducts();
      setModalDelete(false);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const openModalEdit = (row: any) => {    
    setIsEditing(true);
    setDataProduct(row);
    setOpenModal(true);
  };

  const openModalDelete = (row: any) => {
    setDataProduct(row);
    setModalDelete(true);
  };

  const getListProducts = async () => {
    const response = await getProducts();
    if (response) {
      const data = response.data.map((item: ListProducts) => {
        return {
          id: item.id,
          product: item.product,
          valueBuys: formatPrice(item.valueBuys),
          saleValue: formatPrice(item.saleValue),
          existence: formatPrice(item.existence),
        };
      });
      setData(data);
    }
  };

  useEffect(() => {
    getListProducts();
  }, []);

  return (
    <>
    <ModalEditProduct
      isEditing={isEditing}
      openModal={openModal}
      handleCreate={handleCreate}
      handleEdit={handleEdit}
      handleClose={handleClose}
      products={products}
    />
    <ConfirmDeleteModal
      openModalDelete={modalDelete}
      handleDelete={handleDelete}
      handleCloseDelete={() => setModalDelete(false)}
    />
      <div style={styleIconAdd}>
        <h2 className="color-lime">Productos</h2>
        <div>
          <Tooltip title="Agregar Producto">
            <AddCircleIcon
              style={{ fontSize: 40, color: "#9FB404", cursor: "pointer" }}
              onClick={openModalCreate}
            />
          </Tooltip>
        </div>
      </div>

      <TableComponent
        columns={columns}
        data={data}
        onEdit={openModalEdit}
        onDelete={openModalDelete}
      />
    </>
  );
};
