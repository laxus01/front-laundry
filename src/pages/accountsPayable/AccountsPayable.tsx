import { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import {
  getAccountsPayable,
  queryCreateAccountPayableById,
  queryDeleteAccountPayableById,
  queryEditAccountPayableById,
} from "./services/AccountsPayable.services";
import ModalEditAccountPayable from "./components/ModalEditAccountPayable";
import ModalPaymentDetailsAccountPayable from "./components/ModalPaymentDetailsAccountPayable";
import { AccountPayableSelected } from "../../interfaces/interfaces";
import { useAccountsPayable } from "./hooks/useAccountsPayable";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import { Tooltip, IconButton } from "@mui/material";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { formatPrice } from "../../utils/utils";
import dayjs from "dayjs";

const columns = [
  { id: "providerName", label: "Proveedor", minWidth: 200 },
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

export const AccountsPayable = () => {
  const accountsPayable = useAccountsPayable();
  const { defaultAccountPayable, dataAccountPayable, setDataAccountPayable } = accountsPayable;
  const { showSnackbar } = useSnackbar();

  const [data, setData] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const getListAccountsPayable = async () => {
    try {
      const response = await getAccountsPayable();
      if (response && response.data && Array.isArray(response.data)) {
        const data = response.data.map((item: any) => {
          // Format date properly to avoid timezone issues
          const formatDate = (dateString: string) => {
            return dayjs(dateString).format('DD/MM/YYYY');
          };

          return {
            id: item.id,
            providerName: item.providerId?.name || "Proveedor no encontrado",
            date: formatDate(item.date),
            detail: item.detail,
            value: `$${formatPrice(item.value)}`,
            balance: `$${formatPrice(item.balance)}`,
            // Store original data for editing
            rawValue: item.value,
            rawDate: item.date,
            rawBalance: item.balance,
            providerId: item.providerId?.id || "",
          };
        });
        setData(data);
      } else {
        setData([]);
      }
    } catch (error: any) {
      console.error("Error loading accounts payable:", error);
      setData([]);
      showSnackbar("Error al cargar las cuentas por pagar", "error");
    }
  };

  const handleCreate = async () => {
    try {
      const payload = {
        value: dataAccountPayable.value,
        date: dataAccountPayable.date,
        detail: dataAccountPayable.detail,
        providerId: dataAccountPayable.providerId,
      };
      
      const response = await queryCreateAccountPayableById(payload);
      if (response.data) {
        getListAccountsPayable();
        setOpenModal(false);
        setDataAccountPayable(defaultAccountPayable);
        showSnackbar(response.data.message || "Cuenta por pagar creada exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al crear la cuenta por pagar", "error");
    }
  };

  const handleEdit = async () => {
    try {
      const payload = {
        value: dataAccountPayable.value,
        date: dataAccountPayable.date,
        detail: dataAccountPayable.detail,
        providerId: dataAccountPayable.providerId,
      };
      
      const response = await queryEditAccountPayableById(dataAccountPayable.id, payload);
      if (response) {
        getListAccountsPayable();
        setOpenModal(false);
        setDataAccountPayable(defaultAccountPayable);
        showSnackbar("Cuenta por pagar actualizada exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al actualizar la cuenta por pagar", "error");
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
    setDataAccountPayable(defaultAccountPayable);
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
      providerId: row.providerId || '',
      providerName: row.providerName || '',
    };
    setDataAccountPayable(editData);
    setOpenModal(true);
  };

  const openModalDelete = (row: AccountPayableSelected) => {
    setDataAccountPayable(row);
    setModalDelete(true);
  };

  const openPaymentDetails = (row: AccountPayableSelected) => {
    setDataAccountPayable(row);
    setOpenPaymentModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await queryDeleteAccountPayableById(dataAccountPayable.id);
      if (response) {
        setDataAccountPayable(defaultAccountPayable);
        getListAccountsPayable();
        setModalDelete(false);
        showSnackbar("Cuenta por pagar eliminada exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al eliminar la cuenta por pagar", "error");
    }
  };

  useEffect(() => {
    getListAccountsPayable();
  }, []);

  return (
    <>
      <ModalEditAccountPayable
        isEditing={isEditing}
        openModal={openModal}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleClose={handleClose}
        accountsPayable={accountsPayable}
      />
      <ModalPaymentDetailsAccountPayable
        openModal={openPaymentModal}
        handleClose={handleClosePaymentModal}
        accountPayableData={dataAccountPayable}
        onPaymentChange={getListAccountsPayable}
      />
      <ConfirmDeleteModal
        openModalDelete={modalDelete}
        handleDelete={handleDelete}
        handleCloseDelete={() => setModalDelete(false)}
      />
      <div style={styleIconAdd}>
        <h2 className="color-lime">Cuentas por Pagar</h2>
        <div>
          <Tooltip title="Agregar Cuenta por Pagar">
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
        emptyDataMessage="No hay cuentas por pagar registradas"
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
