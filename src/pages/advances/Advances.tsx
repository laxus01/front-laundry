import { Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TableComponent from "../../components/TableComponent";
import { useEffect, useState } from "react";
import { Advance } from "../../interfaces/interfaces";
import { formatPrice, removeFormatPrice } from "../../utils/utils";
import {
  getAdvances,
  queryCreateAdvance,
  queryDeleteAdvanceById,
  queryEditAdvanceById,
} from "./services/Advances.services";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { useAdvances } from "./hooks/useAdvances";
import ModalEditAdvance from "./components/ModalEditAdvance";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { requestGet } from "../../services/axios/axios.services";
import { environment } from "../../env";
import dayjs from "dayjs";

const columns = [
  { id: "washer", label: "Lavador", minWidth: 200 },
  { id: "value", label: "Valor", minWidth: 150 },
  { id: "date", label: "Fecha", minWidth: 150 },
];

const styleIconAdd = {
  display: "flex",
  alignItems: "center",
  padding: "20px",
};

export const Advances = () => {
  const advances = useAdvances();
  const { dataAdvance, setDataAdvance, defaultAdvance } = advances;
  const { showSnackbar } = useSnackbar();
  
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [listWashers, setListWashers] = useState([]);

  const getListWashers = async () => {
    const response = await requestGet(environment.washers);
    if (response) {
      const washers = response.data.map((washer: any) => ({
        id: washer.id,
        name: washer.washer,
      }));
      setListWashers(washers);
    }
  };

  const openModalCreate = () => {
    setIsEditing(false);
    setDataAdvance({
      ...defaultAdvance,
      date: dayjs().format("YYYY-MM-DD"),
    });
    setOpenModal(true);
  };

  const handleCreate = async () => {
    const payload = {
      value: removeFormatPrice(dataAdvance.value.toString()),
      date: dataAdvance.date,
      washerId: dataAdvance.washerId,
    };
    const response = await queryCreateAdvance(payload);
    if (response) {
      getListAdvances();
      setOpenModal(false);
      setDataAdvance(defaultAdvance);
      showSnackbar("Avance creado exitosamente", "success");
    }
  };

  const handleEdit = async () => {
    const payload = {
      value: removeFormatPrice(dataAdvance.value.toString()),
      date: dataAdvance.date,
      washerId: dataAdvance.washerId,
    };
    const response = await queryEditAdvanceById(dataAdvance.id, payload);
    if (response) {
      getListAdvances();
      setOpenModal(false);
      setDataAdvance(defaultAdvance);
      showSnackbar("Avance editado exitosamente", "success");
    }
  };

  const handleDelete = async () => {
    const response = await queryDeleteAdvanceById(dataAdvance.id);
    if (response) {
      setDataAdvance(defaultAdvance);
      getListAdvances();
      setModalDelete(false);
      showSnackbar("Avance eliminado exitosamente", "success");
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const openModalEdit = (row: any) => {
    setIsEditing(true);
    setDataAdvance(row);
    setOpenModal(true);
  };

  const openModalDelete = (row: any) => {
    setDataAdvance(row);
    setModalDelete(true);
  };

  const getListAdvances = async () => {
    const response = await getAdvances();
    if (response) {
      const data = response.data.map((item: Advance) => {
        return {
          id: item.id,
          washer: item.washer?.washer || "",
          value: formatPrice(item.value),
          date: dayjs(item.date).format("YYYY-MM-DD"),
          washerId: item.washerId,
          washerName: item.washer?.washer || "",
        };
      });
      setData(data);
    }
  };

  useEffect(() => {
    getListAdvances();
    getListWashers();
  }, []);

  return (
    <>
      <ModalEditAdvance
        isEditing={isEditing}
        openModal={openModal}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleClose={handleClose}
        advances={advances}
        listWashers={listWashers}
      />
      <ConfirmDeleteModal
        openModalDelete={modalDelete}
        handleDelete={handleDelete}
        handleCloseDelete={() => setModalDelete(false)}
      />
      <div style={styleIconAdd}>
        <h2 className="color-lime">Avances</h2>
        <div>
          <Tooltip title="Agregar Avance">
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
