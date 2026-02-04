import { useEffect, useState } from "react";
import { Tooltip, IconButton, Chip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import PaymentIcon from "@mui/icons-material/Payment";
import TableComponent from "../../components/TableComponent";
import ModalDateRangeSearch from "../../components/ModalDateRangeSearch";
import ModalEditDefaulterWasher from "./components/ModalEditDefaulterWasher";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import ConfirmPaymentModal from "./components/ConfirmPaymentModal";
import { useDefaulterWashers, type DefaulterWasher as DefaulterWasherType } from "./hooks/useDefaulterWashers";
import {
  getDefaulterWashers,
  queryCreateDefaulterWasher,
  queryEditDefaulterWasherById,
  queryDeleteDefaulterWasherById,
  queryMarkAsPaid,
} from "./services/DefaulterWashers.services";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { OptionsComboBoxAutoComplete } from "../../interfaces/interfaces";
import { getWashers } from "../washers/services/Washer.services";
import { removeFormatPrice } from "../../utils/utils";
import dayjs from "dayjs";

const columns = [
  { id: "washer", label: "Lavador", minWidth: 200 },
  { id: "amount", label: "Monto", minWidth: 150 },
  { id: "description", label: "Descripción", minWidth: 200 },
  { id: "date", label: "Fecha", minWidth: 150 },
  { id: "status", label: "Estado", minWidth: 150 },
];

const styleIconAdd = {
  display: "flex",
  alignItems: "center",
  padding: "20px",
};

export const DefaulterWashers = () => {
  const defaulterWasher = useDefaulterWashers();
  const { defaultDefaulterWasher, dataDefaulterWasher, setDataDefaulterWasher } = defaulterWasher;
  const { showSnackbar } = useSnackbar();

  const [data, setData] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalPayment, setModalPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const [startDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));

  const [listWashers, setListWashers] = useState<OptionsComboBoxAutoComplete[]>([
    { id: "", name: "" }
  ]);

  const getListDefaulterWashers = async (searchStartDate: string = dayjs().format('YYYY-MM-DD'), searchEndDate: string = dayjs().format('YYYY-MM-DD')) => {
    try {
      const dateStart = searchStartDate || startDate;
      const dateEnd = searchEndDate || endDate;
      
      const response = await getDefaulterWashers(dateStart, dateEnd);
      if (response && response.data && Array.isArray(response.data)) {
        const data = response.data.map((item: any) => {
          const isPaid = item.isPaid;
          const statusText = isPaid ? "Pagado" : "Por Pagar";
          
          return {
            id: item.id,
            washer: item.washer?.washer || "Lavador no encontrado",
            amount: new Intl.NumberFormat('es-CO', { 
              style: 'currency', 
              currency: 'COP',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(item.amount),
            description: item.description || "Sin descripción",
            date: dayjs(item.date).format('DD/MM/YYYY'),
            status: (
              <Chip
                label={statusText}
                color={isPaid ? "success" : "warning"}
                variant="filled"
                size="small"
              />
            ),
            washerId: item.washerId,
            rawDate: item.date,
            rawAmount: item.amount,
            isPaid: item.isPaid,
          };
        });
        setData(data);
      } else {
        setData([]);
      }
    } catch (error: any) {
      console.error("Error loading defaulter washers:", error);
      setData([]);
      showSnackbar("Error al cargar los lavadores en mora", "error");
    }
  };

  const getListWashers = async () => {
    try {
      const response = await getWashers();
      if (response?.data) {
        const washerOptions = response.data.map((washer: any) => ({
          id: washer.id,
          name: washer.washer,
        }));
        setListWashers(washerOptions);
      }
    } catch (error) {
      console.error("Error loading washers:", error);
    }
  };

  const handleCreate = async () => {
    try {
      const payload = {
        amount: removeFormatPrice(dataDefaulterWasher.amount.toString()),
        washerId: dataDefaulterWasher.washerId,
        description: dataDefaulterWasher.description,
        date: dataDefaulterWasher.date,
      };

      const response = await queryCreateDefaulterWasher(payload);
      if (response.data) {
        getListDefaulterWashers();
        setOpenModal(false);
        setDataDefaulterWasher(defaultDefaulterWasher);
        showSnackbar(response.data.message || "Lavador en mora registrado exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al registrar el lavador en mora", "error");
    }
  };

  const handleEdit = async () => {
    try {
      const payload = {
        amount: removeFormatPrice(dataDefaulterWasher.amount.toString()),
        washerId: dataDefaulterWasher.washerId,
        description: dataDefaulterWasher.description,
        date: dataDefaulterWasher.date,
      };

      const response = await queryEditDefaulterWasherById(dataDefaulterWasher.id, payload);
      if (response) {
        getListDefaulterWashers();
        setOpenModal(false);
        setDataDefaulterWasher(defaultDefaulterWasher);
        showSnackbar("Lavador en mora actualizado exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al actualizar el lavador en mora", "error");
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const openModalCreate = () => {
    setIsEditing(false);
    setDataDefaulterWasher(defaultDefaulterWasher);
    setOpenModal(true);
  };

  const openModalEdit = (row: any) => {
    setIsEditing(true);
    const editData = {
      ...row,
      amount: new Intl.NumberFormat('es-CO').format(row.rawAmount),
      date: row.rawDate ? dayjs(row.rawDate).format('YYYY-MM-DD') : dayjs(row.date).format('YYYY-MM-DD'),
    };
    setDataDefaulterWasher(editData);
    setOpenModal(true);
  };

  const openModalDelete = (row: DefaulterWasherType) => {
    setDataDefaulterWasher(row);
    setModalDelete(true);
  };

  const handleDelete = async () => {
    try {
      const response = await queryDeleteDefaulterWasherById(dataDefaulterWasher.id);
      if (response) {
        setDataDefaulterWasher(defaultDefaulterWasher);
        getListDefaulterWashers();
        setModalDelete(false);
        showSnackbar("Lavador en mora eliminado exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al eliminar el lavador en mora", "error");
    }
  };

  const handleDateRangeSearch = (searchStartDate: string, searchEndDate: string) => {
    getListDefaulterWashers(searchStartDate, searchEndDate);
  };

  const openModalPayment = (row: any) => {
    setSelectedPayment(row);
    setModalPayment(true);
  };

  const handleMarkAsPaid = async () => {
    try {
      const response = await queryMarkAsPaid(selectedPayment.id);
      if (response) {
        getListDefaulterWashers();
        setModalPayment(false);
        setSelectedPayment(null);
        showSnackbar("Pago registrado exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al registrar el pago", "error");
    }
  };

  useEffect(() => {
    getListDefaulterWashers();
    getListWashers();
  }, []);

  return (
    <>
      <ModalEditDefaulterWasher
        isEditing={isEditing}
        openModal={openModal}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleClose={handleClose}
        defaulterWasher={defaulterWasher}
        listWashers={listWashers}
      />
      <ConfirmDeleteModal
        openModalDelete={modalDelete}
        handleDelete={handleDelete}
        handleCloseDelete={() => setModalDelete(false)}
      />
      <ConfirmPaymentModal
        open={modalPayment}
        onClose={() => setModalPayment(false)}
        onConfirm={handleMarkAsPaid}
        washerName={selectedPayment?.washer || ""}
        amount={selectedPayment?.amount || ""}
      />
      <ModalDateRangeSearch
        title="Buscar Lavadores en Mora por Fecha"
        open={openDateRangeModal}
        onClose={() => setOpenDateRangeModal(false)}
        onSearch={handleDateRangeSearch}
        initialStartDate={startDate}
        initialEndDate={endDate}
      />
      <div style={styleIconAdd}>
        <h2 className="color-lime">Lavadores en Mora</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Tooltip title="Agregar Lavador en Mora">
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
        emptyDataMessage="No hay lavadores en mora registrados"
        customActions={(row) => (
          !row.isPaid && (
            <Tooltip title="Marcar como Pagado">
              <IconButton
                onClick={() => openModalPayment(row)}
                aria-label="payment"
              >
                <PaymentIcon />
              </IconButton>
            </Tooltip>
          )
        )}
      />
    </>
  );
};
