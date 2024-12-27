import { Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TableComponent from "../../components/TableComponent";
import { useEffect, useState } from "react";
import {
  ListProducts,
  OptionsComboBoxAutoComplete,
  ListSales,
  Washer,
} from "../../interfaces/interfaces";
import { formatPrice } from "../../utils/utils";
import ModalEditSale from "./components/ModalEditSale";
import {
  getSales,
  queryCreateSale,
  queryDeleteSaleById,
  queryEditSaleById,
} from "./services/Sales.services";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { useSales } from "./hooks/useSales";
import { getWashers } from "../washers/services/Washer.services";
import { getProducts } from "../attentions/services/Attentions.services";

const columns = [
  { id: "product", label: "Producto", minWidth: 200 },
  { id: "quantity", label: "Cantidad", minWidth: 200 },
  { id: "saleValue", label: "Valor Venta", minWidth: 200 },
  { id: "totalSale", label: "Total", minWidth: 200 },
  { id: "washer", label: "Lavador", minWidth: 200 },
];

const styleIconAdd = {
  display: "flex",
  alignItems: "center",
  padding: "20px",
};

export const Sales = () => {
  const sales = useSales();
  const { dataSale, setDataSale, defaultSale } = sales;

  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [listWashers, setListWashers] = useState<OptionsComboBoxAutoComplete[]>(
    [{ id: "", name: "" }]
  );

  const [listProducts, setListProducts] = useState<
    OptionsComboBoxAutoComplete[]
  >([{ id: "", name: "" }]);

  const openModalCreate = () => {
    setIsEditing(false);
    setDataSale(defaultSale);
    setOpenModal(true);
  };

  const handleCreate = async () => {
    const payload = {
      productId: dataSale.productId,
      quantity: dataSale.quantity,
      washerId: dataSale.washerId ? dataSale.washerId : 'Venta Cliente',
    };
    const response = await queryCreateSale(payload);
    if (response) {
      getListSales();
      setOpenModal(false);
      setDataSale(defaultSale);
    }
  };

  const handleEdit = async () => {
    const payload = {
        productId: dataSale.productId,
        quantity: dataSale.quantity,
        washerId: dataSale.washerId ? dataSale.washerId : null,
    };
    const response = await queryEditSaleById(dataSale.id, payload);
    if (response) {
      getListSales();
      setOpenModal(false);
      setDataSale(defaultSale);
    }
  };

  const handleDelete = async () => {
    const response = await queryDeleteSaleById(dataSale.id);
    if (response) {
      setDataSale(defaultSale);
      getListSales();
      setModalDelete(false);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const openModalEdit = (row: any) => {
    console.log(row);
    
    setIsEditing(true);
    setDataSale(row);
    setOpenModal(true);
  };

  const openModalDelete = (row: any) => {
    setDataSale(row);
    setModalDelete(true);
  };

  const getListSales = async () => {
    const response = await getSales();
    if (response) {
      const data = response.data.map((item: ListSales) => {
        return {
          id: item.id,
          product: item.productId.product,
          productId: item.productId.id,
          quantity: item.quantity,
          saleValue: formatPrice(item.productId.saleValue),
          totalSale: formatPrice(item.quantity * item.productId.saleValue),
          washer: item.washerId && item.washerId.washer,
        };
      });
      setData(data);
    }
  };

  const getListWashers = async () => {
    const response = await getWashers();
    if (response) {
      const washers = response.data.map((item: Washer) => {
        return {
          id: item.id,
          name: item.washer,
        };
      });
      setListWashers(washers);
    }
  };

  const getListProducts = async () => {
    const response = await getProducts();
    if (response) {
      const listProducts = response.data.map((item: ListProducts) => {
        return {
          id: item.id,
          name: item.product,
        };
      });
      setListProducts(listProducts);
    }
  };

  useEffect(() => {
    getListSales();
    getListWashers();
    getListProducts();
  }, []);

  return (
    <>
      <ModalEditSale
        listWashers={listWashers}
        listProducts={listProducts}
        isEditing={isEditing}
        openModal={openModal}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleClose={handleClose}
        sales={sales}
      />
      <ConfirmDeleteModal
        openModalDelete={modalDelete}
        handleDelete={handleDelete}
        handleCloseDelete={() => setModalDelete(false)}
      />
      <div style={styleIconAdd}>
        <h2 className="color-lime">Ventas</h2>
        <div>
          <Tooltip title="Agregar Venta">
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
        edit={false}
      />
    </>
  );
};
