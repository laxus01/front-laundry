import { Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import TableComponent from "../../components/TableComponent";
import ModalDateRangeSearch from "../../components/ModalDateRangeSearch";
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
import dayjs from "dayjs";

const columns = [
  { id: "product", label: "Producto", minWidth: 200 },
  { id: "quantity", label: "Cantidad", minWidth: 200 },
  { id: "saleValue", label: "Valor Venta", minWidth: 200 },
  { id: "totalSale", label: "Total", minWidth: 200 },
  { id: "date", label: "Fecha", minWidth: 200 },
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
  const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [listWashers, setListWashers] = useState<OptionsComboBoxAutoComplete[]>(
    [{ id: "", name: "" }]
  );

  const [listProducts, setListProducts] = useState<
    OptionsComboBoxAutoComplete[]
  >([{ id: "", name: "" }]);

  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));

  const openModalCreate = () => {
    setIsEditing(false);
    setDataSale(defaultSale);
    setOpenModal(true);
  };

  const handleCreate = async () => {
    const payload = {
      productId: dataSale.productId,
      quantity: dataSale.quantity,
      washerId: dataSale.washerId ? dataSale.washerId : null,
      date: dataSale.date,
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
      date: dataSale.date,
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

  const getListSales = async (startDate: string = dayjs().format('YYYY-MM-DD'), endDate: string = dayjs().format('YYYY-MM-DD')) => {
    const response = await getSales(startDate, endDate);
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
          date: dayjs(item.date).format('DD/MM/YYYY'),
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

  const handleDateRangeSearch = async (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    await getListSales(newStartDate, newEndDate);
  };

  useEffect(() => {
    const currentMonth = dayjs().month();
    const currentYear = dayjs().year();
    const startDate = dayjs(`${currentYear}-${currentMonth + 1}-01`).format('YYYY-MM-DD');
    const endDate = dayjs(`${currentYear}-${currentMonth + 1}-${dayjs(`${currentYear}-${currentMonth + 1}-01`).daysInMonth()}`).format('YYYY-MM-DD');
    setStartDate(startDate);
    setEndDate(endDate);
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
      <ModalDateRangeSearch
        title="Buscar por Fecha"
        open={openDateRangeModal}
        onClose={() => setOpenDateRangeModal(false)}
        onSearch={handleDateRangeSearch}
        initialStartDate={startDate}
        initialEndDate={endDate}
      />
      <ConfirmDeleteModal
        openModalDelete={modalDelete}
        handleDelete={handleDelete}
        handleCloseDelete={() => setModalDelete(false)}
      />
      <div style={styleIconAdd}>
        <h2 className="color-lime">Ventas</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Tooltip title="Agregar Venta">
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
        edit={false}
      />
    </>
  );
};
