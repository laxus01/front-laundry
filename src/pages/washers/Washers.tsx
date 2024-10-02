import { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Tooltip } from "@mui/material";
import { useWashers } from "./hooks/useWashers";
import { getWashers, queryCreateWasherById, queryDeleteWasherById, queryEditWasherById } from "./services/Washer.services";
import { Washer } from "./interfaces/washers";
import ModalEditWasher from "./components/ModalEditWasher";

const columns = [
  { id: "washer", label: "Lavador", minWidth: 200 },
  { id: "phone", label: "Teléfono", minWidth: 200 },
];

const styleIconAdd = {
  display: "flex",
  alignItems: "center",
  padding: "20px",
};

export const Washers = () => {
  const washers = useWashers();
  const { defaultWasher, dataWasher, setDataWasher } = washers;

  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const getListWashers = async () => {
    const response = await getWashers();
    if (response) {
      const data = response.data.map((item: Washer) => {
        return {
          id: item.id,
          washer: item.washer,
          phone: item.phone,
        };
      });
      setData(data);
    }
  };

  const handleCreate = async () => {
    const payload = {
      washer: dataWasher.washer,
      phone: dataWasher.phone,
    };
    const response = await queryCreateWasherById(payload);
    if (response) {
      getListWashers();
      setOpenModal(false);
      setDataWasher(defaultWasher);
    }
  };

  const handleEdit = async () => {
    const payload = {
      washer: dataWasher.washer,
      phone: dataWasher.phone,
    };
    const response = await queryEditWasherById(dataWasher.id, payload);
    if (response) {
      getListWashers();
      setOpenModal(false);
      setDataWasher(defaultWasher);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const openModalCreate = () => {
    setIsEditing(false);
    setDataWasher(defaultWasher);
    setOpenModal(true);
  };

  const openModalEdit = (row: Washer) => {
    setIsEditing(true);
    setDataWasher(row);
    setOpenModal(true);
  };

  const openModalDelete = (row: Washer) => {
    setDataWasher(row);
    setModalDelete(true);
  };

  const handleDelete = async () => {
    const response = await queryDeleteWasherById(dataWasher.id);
    if (response) {
      setDataWasher(defaultWasher);
      getListWashers();
      setModalDelete(false);
    }
  };

  useEffect(() => {
    getListWashers();
  }, []);

  return (
    <>
      <ModalEditWasher
        isEditing={isEditing}
        openModal={openModal}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleClose={handleClose}
        washers={washers}
      />
      <ConfirmDeleteModal
        openModalDelete={modalDelete}
        handleDelete={handleDelete}
        handleCloseDelete={() => setModalDelete(false)}
      />
      <div
        style={styleIconAdd}
      >
        <h2 className="color-lime">Lavadores</h2>
        <div>
          <Tooltip title="Agregar Vehículo">
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