import { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import ModalDateRangeSearch from "../../components/ModalDateRangeSearch";
import {
  getAccountsReceivable,
  queryCreateAccountReceivableById,
  queryDeleteAccountReceivableById,
  queryEditAccountReceivableById,
} from "./services/AccountsReceivable.services";
import ModalEditAccountReceivable from "./components/ModalEditAccountReceivable";
import ModalPaymentDetailsAccountReceivable from "./components/ModalPaymentDetailsAccountReceivable";
import { AccountReceivableSelected } from "../../interfaces/interfaces";
import { useAccountsReceivable } from "./hooks/useAccountsReceivable";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import PaymentIcon from "@mui/icons-material/Payment";
import { Tooltip, IconButton } from "@mui/material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { formatPrice } from "../../utils/utils";
import dayjs from "dayjs";

const columns = [
  { id: "clientName", label: "Cliente", minWidth: 200 },
  { id: "phone", label: "Telefono", minWidth: 150 },
  { id: "date", label: "Fecha", minWidth: 150 },
  { id: "detail", label: "Detalle", minWidth: 250 },
  { id: "value", label: "Valor", minWidth: 150 },
  { id: "balance", label: "Saldo", minWidth: 150 },
];

const styleIconAdd = {
  display: "flex",
  alignItems: "center",
  padding: "20px",
};

export const AccountsReceivable = () => {
  const accountsReceivable = useAccountsReceivable();
  const { defaultAccountReceivable, dataAccountReceivable, setDataAccountReceivable } = accountsReceivable;
  const { showSnackbar } = useSnackbar();

  const [data, setData] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openDateRangeModal, setOpenDateRangeModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  // Current month date range for initial load
  const [startDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));

  const getListAccountsReceivable = async (searchStartDate: string = dayjs().format('YYYY-MM-DD'), searchEndDate: string = dayjs().format('YYYY-MM-DD')) => {
    try {
      const dateStart = searchStartDate || startDate;
      const dateEnd = searchEndDate || endDate;
      
      const response = await getAccountsReceivable(dateStart, dateEnd);
      if (response && response.data && Array.isArray(response.data)) {
        const data = response.data.map((item: any) => {
          // Format date properly to avoid timezone issues
          const formatDate = (dateString: string) => {
            return dayjs(dateString).format('DD/MM/YYYY');
          };

          return {
            id: item.id,
            clientName: item.clientId?.client || "Cliente no encontrado",
            phone: item.clientId?.phone || "Telefono no encontrado",
            date: formatDate(item.date),
            detail: item.detail,
            value: `$${formatPrice(item.value)}`,
            balance: `$${formatPrice(item.balance)}`,
            // Store original data for editing
            rawValue: item.value,
            rawDate: item.date,
            rawBalance: item.balance,
            clientId: item.clientId?.id || "",
          };
        });
        setData(data);
      } else {
        setData([]);
      }
    } catch (error: any) {
      console.error("Error loading accounts receivable:", error);
      setData([]);
      showSnackbar("Error al cargar las cuentas por cobrar", "error");
    }
  };

  const handleCreate = async () => {
    try {
      const payload = {
        value: dataAccountReceivable.value,
        date: dataAccountReceivable.date,
        detail: dataAccountReceivable.detail,
        clientId: dataAccountReceivable.clientId,
      };
      
      const response = await queryCreateAccountReceivableById(payload);
      if (response.data) {
        getListAccountsReceivable();
        setOpenModal(false);
        setDataAccountReceivable(defaultAccountReceivable);
        showSnackbar(response.data.message || "Cuenta por cobrar creada exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al crear la cuenta por cobrar", "error");
    }
  };

  const handleEdit = async () => {
    try {
      const payload = {
        value: dataAccountReceivable.value,
        date: dataAccountReceivable.date,
        detail: dataAccountReceivable.detail,
        clientId: dataAccountReceivable.clientId,
      };
      
      const response = await queryEditAccountReceivableById(dataAccountReceivable.id, payload);
      if (response) {
        getListAccountsReceivable();
        setOpenModal(false);
        setDataAccountReceivable(defaultAccountReceivable);
        showSnackbar("Cuenta por cobrar actualizada exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al actualizar la cuenta por cobrar", "error");
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false);
  };

  const openModalCreate = () => {
    setIsEditing(false);
    setDataAccountReceivable(defaultAccountReceivable);
    setOpenModal(true);
  };

  const openModalEdit = (row: any) => {
    setIsEditing(true);
    // Convert formatted data back to raw data for editing
    const editData = {
      ...row,
      value: row.rawValue || (typeof row.value === 'string' 
        ? parseFloat(row.value.replace('$', '').replace(',', ''))
        : row.value),
      date: dayjs(row.rawDate || row.date).format('YYYY-MM-DD'),
      clientId: row.clientId || '',
      clientName: row.clientName || '',
    };
    setDataAccountReceivable(editData);
    setOpenModal(true);
  };

  const openModalDelete = (row: AccountReceivableSelected) => {
    setDataAccountReceivable(row);
    setModalDelete(true);
  };

  const openPaymentDetails = (row: AccountReceivableSelected) => {
    setDataAccountReceivable(row);
    setOpenPaymentModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await queryDeleteAccountReceivableById(dataAccountReceivable.id);
      if (response) {
        setDataAccountReceivable(defaultAccountReceivable);
        getListAccountsReceivable();
        setModalDelete(false);
        showSnackbar("Cuenta por cobrar eliminada exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al eliminar la cuenta por cobrar", "error");
    }
  };

  const handleDateRangeSearch = (searchStartDate: string, searchEndDate: string) => {
    getListAccountsReceivable(searchStartDate, searchEndDate);
  };

  useEffect(() => {
    getListAccountsReceivable();
  }, []);

  return (
    <>
      <ModalEditAccountReceivable
        isEditing={isEditing}
        openModal={openModal}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleClose={handleClose}
        accountsReceivable={accountsReceivable}
      />
      <ModalPaymentDetailsAccountReceivable
        openModal={openPaymentModal}
        handleClose={handleClosePaymentModal}
        accountReceivableData={dataAccountReceivable}
        onPaymentChange={getListAccountsReceivable}
      />
      <ConfirmDeleteModal
        openModalDelete={modalDelete}
        handleDelete={handleDelete}
        handleCloseDelete={() => setModalDelete(false)}
      />
      <ModalDateRangeSearch
        title="Buscar Cuentas por Cobrar por Fecha"
        open={openDateRangeModal}
        onClose={() => setOpenDateRangeModal(false)}
        onSearch={handleDateRangeSearch}
        initialStartDate={startDate}
        initialEndDate={endDate}
      />
      <div style={styleIconAdd}>
        <h2 className="color-lime">Cuentas por Cobrar</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Tooltip title="Agregar Cuenta por Cobrar">
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
        emptyDataMessage="No hay cuentas por cobrar registradas"
        customActions={(row: any) => (
          <Tooltip title="Ver Pagos">
            <IconButton
              onClick={() => openPaymentDetails(row)}
              aria-label="payments"
            >
              <PaymentIcon />
            </IconButton>
          </Tooltip>
        )}
      />
    </>
  );
};