import { useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import TableComponent from "../../components/TableComponent";
import ModalDateRangeSearch from "../../components/ModalDateRangeSearch";
import ModalEditShopping from "./components/ModalEditShopping";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { useShopping, type Shopping as ShoppingType } from "./hooks/useShopping";
import {
  getShopping,
  queryCreateShopping,
  queryEditShoppingById,
  queryDeleteShoppingById,
} from "./services/Shopping.services";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { OptionsComboBoxAutoComplete } from "../../interfaces/interfaces";
import { getProducts } from "../attentions/services/Attentions.services";
import dayjs from "dayjs";

const columns = [
  { id: "product", label: "Producto", minWidth: 200 },
  { id: "quantity", label: "Cantidad", minWidth: 150 },
  { id: "date", label: "Fecha", minWidth: 150 },
];

const styleIconAdd = {
  display: "flex",
  alignItems: "center",
  padding: "20px",
};

export const Shopping = () => {
  const shopping = useShopping();
  const { defaultShopping, dataShopping, setDataShopping } = shopping;
  const { showSnackbar } = useSnackbar();

  const [data, setData] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  // Current month date range for initial load
  const [startDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));

  const [listProducts, setListProducts] = useState<OptionsComboBoxAutoComplete[]>([
    { id: "", name: "" }
  ]);

  const getListShopping = async (searchStartDate: string = dayjs().format('YYYY-MM-DD'), searchEndDate: string = dayjs().format('YYYY-MM-DD')) => {
    try {
      const dateStart = searchStartDate || startDate;
      const dateEnd = searchEndDate || endDate;
      
      const response = await getShopping(dateStart, dateEnd);
      if (response && response.data && Array.isArray(response.data)) {
        const data = response.data.map((item: any) => {         
          return {
            id: item.id,
            product: item.product?.product || "Producto no encontrado",
            quantity: item.quantity,
            date: dayjs(item.date).format('DD/MM/YYYY'),
            productId: item.productId,
            rawDate: item.date,
          };
        });
        setData(data);
      } else {
        setData([]);
      }
    } catch (error: any) {
      console.error("Error loading shopping:", error);
      setData([]);
      showSnackbar("Error al cargar las compras", "error");
    }
  };

  const getListProducts = async () => {
    try {
      const response = await getProducts();
      if (response?.data) {
        const productOptions = response.data.map((product: any) => ({
          id: product.id,
          name: product.product,
        }));
        setListProducts(productOptions);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleCreate = async () => {
    try {
      const payload = {
        quantity: dataShopping.quantity,
        productId: dataShopping.productId,
        date: dataShopping.date,
      };

      const response = await queryCreateShopping(payload);
      if (response.data) {
        getListShopping();
        setOpenModal(false);
        setDataShopping(defaultShopping);
        showSnackbar(response.data.message || "Compra creada exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al crear la compra", "error");
    }
  };

  const handleEdit = async () => {
    try {
      const payload = {
        quantity: dataShopping.quantity,
        productId: dataShopping.productId,
        date: dataShopping.date,
      };

      const response = await queryEditShoppingById(dataShopping.id, payload);
      if (response) {
        getListShopping();
        setOpenModal(false);
        setDataShopping(defaultShopping);
        showSnackbar("Compra actualizada exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al actualizar la compra", "error");
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const openModalCreate = () => {
    setIsEditing(false);
    setDataShopping(defaultShopping);
    setOpenModal(true);
  };

  const openModalEdit = (row: any) => {
    setIsEditing(true);
    const editData = {
      ...row,
      date: row.rawDate ? dayjs(row.rawDate).format('YYYY-MM-DD') : dayjs(row.date).format('YYYY-MM-DD'),
    };
    setDataShopping(editData);
    setOpenModal(true);
  };

  const openModalDelete = (row: ShoppingType) => {
    setDataShopping(row);
    setModalDelete(true);
  };

  const handleDelete = async () => {
    try {
      const response = await queryDeleteShoppingById(dataShopping.id);
      if (response) {
        setDataShopping(defaultShopping);
        getListShopping();
        setModalDelete(false);
        showSnackbar("Compra eliminada exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al eliminar la compra", "error");
    }
  };

  const handleDateRangeSearch = (searchStartDate: string, searchEndDate: string) => {
    getListShopping(searchStartDate, searchEndDate);
  };

  useEffect(() => {
    getListShopping();
    getListProducts();
  }, []);

  return (
    <>
      <ModalEditShopping
        isEditing={isEditing}
        openModal={openModal}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleClose={handleClose}
        shopping={shopping}
        listProducts={listProducts}
      />
      <ConfirmDeleteModal
        openModalDelete={modalDelete}
        handleDelete={handleDelete}
        handleCloseDelete={() => setModalDelete(false)}
      />
      <ModalDateRangeSearch
        title="Buscar Compras por Fecha"
        open={openDateRangeModal}
        onClose={() => setOpenDateRangeModal(false)}
        onSearch={handleDateRangeSearch}
        initialStartDate={startDate}
        initialEndDate={endDate}
      />
      <div style={styleIconAdd}>
        <h2 className="color-lime">Compras</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Tooltip title="Agregar Compra">
            <AddCircleIcon
              style={{ fontSize: 40, color: "#9FB404", cursor: "pointer" }}
              onClick={openModalCreate}
            />
          </Tooltip>
          <Tooltip title="Buscar por Fecha">
            <SearchIcon
              style={{ fontSize: 40, color: "#9FB404", cursor: "pointer" }}
              onClick={() => setOpenDateRangeModal(true)}
            />
          </Tooltip>
        </div>
      </div>

      <TableComponent
        columns={columns}
        data={data}
        onEdit={openModalEdit}
        onDelete={openModalDelete}
        emptyDataMessage="No hay compras registradas"
      />
    </>
  );
};