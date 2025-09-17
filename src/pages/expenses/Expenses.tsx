import { useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TableComponent from "../../components/TableComponent";
import ModalEditExpense from "./components/ModalEditExpense";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { useExpenses, Expense } from "./hooks/useExpenses";
import {
  getExpenses,
  queryCreateExpense,
  queryEditExpenseById,
  queryDeleteExpenseById,
} from "./services/Expenses.services";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { formatPrice } from "../../utils/utils";

const columns = [
  { id: "expense", label: "Gasto", minWidth: 200 },
  { id: "value", label: "Valor", minWidth: 150 },
  { id: "date", label: "Fecha", minWidth: 150 },
];

const styleIconAdd = {
  display: "flex",
  alignItems: "center",
  padding: "20px",
};

export const Expenses = () => {
  const expenses = useExpenses();
  const { defaultExpense, dataExpense, setDataExpense } = expenses;
  const { showSnackbar } = useSnackbar();

  const [data, setData] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const getListExpenses = async () => {
    try {
      const response = await getExpenses();
      if (response && response.data && Array.isArray(response.data)) {
        const data = response.data.map((item: any) => ({
          id: item.id,
          expense: item.expense,
          value: `$${formatPrice(item.value)}`,
          date: new Date(item.date).toLocaleDateString(),
          rawValue: item.value,
          rawDate: item.date,
        }));
        setData(data);
      } else {
        setData([]);
      }
    } catch (error: any) {
      console.error("Error loading expenses:", error);
      setData([]);
      showSnackbar("Error al cargar los gastos", "error");
    }
  };

  const handleCreate = async () => {
    try {
      const payload = {
        expense: dataExpense.expense,
        value: dataExpense.value,
        date: dataExpense.date,
      };

      const response = await queryCreateExpense(payload);
      if (response.data) {
        getListExpenses();
        setOpenModal(false);
        setDataExpense(defaultExpense);
        showSnackbar(response.data.message || "Gasto creado exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al crear el gasto", "error");
    }
  };

  const handleEdit = async () => {
    try {
      const payload = {
        expense: dataExpense.expense,
        value: dataExpense.value,
        date: dataExpense.date,
      };

      const response = await queryEditExpenseById(dataExpense.id, payload);
      if (response) {
        getListExpenses();
        setOpenModal(false);
        setDataExpense(defaultExpense);
        showSnackbar("Gasto actualizado exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al actualizar el gasto", "error");
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const openModalCreate = () => {
    setIsEditing(false);
    setDataExpense(defaultExpense);
    setOpenModal(true);
  };

  const openModalEdit = (row: any) => {
    setIsEditing(true);
    const editData = {
      ...row,
      value: row.rawValue || (typeof row.value === 'string' 
        ? parseFloat(row.value.replace('$', '').replace(/\./g, '').replace(',', ''))
        : row.value),
      date: row.rawDate ? new Date(row.rawDate).toISOString().split('T')[0] : new Date(row.date).toISOString().split('T')[0],
    };
    setDataExpense(editData);
    setOpenModal(true);
  };

  const openModalDelete = (row: Expense) => {
    setDataExpense(row);
    setModalDelete(true);
  };

  const handleDelete = async () => {
    try {
      const response = await queryDeleteExpenseById(dataExpense.id);
      if (response) {
        setDataExpense(defaultExpense);
        getListExpenses();
        setModalDelete(false);
        showSnackbar("Gasto eliminado exitosamente", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Error al eliminar el gasto", "error");
    }
  };

  useEffect(() => {
    getListExpenses();
  }, []);

  return (
    <>
      <ModalEditExpense
        isEditing={isEditing}
        openModal={openModal}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleClose={handleClose}
        expenses={expenses}
      />
      <ConfirmDeleteModal
        openModalDelete={modalDelete}
        handleDelete={handleDelete}
        handleCloseDelete={() => setModalDelete(false)}
      />
      <div style={styleIconAdd}>
        <h2 className="color-lime">Gastos</h2>
        <div>
          <Tooltip title="Agregar Gasto">
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
        emptyDataMessage="No hay gastos registrados"
      />
    </>
  );
};
