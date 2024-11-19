import { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import {
  getVehicles,
  queryCreateVehicleById,
  queryDeleteVehicleById,
  queryEditVehicleById,
} from "./services/Vehicle.services";
import ModalEditVehicle from "./components/ModalEditVehicle";
import { Vehicle, VehicleSelected } from "../../interfaces/interfaces";
import { useVehicles } from "./hooks/useVehicles";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Tooltip } from "@mui/material";

const columns = [
  { id: "plate", label: "Placa", minWidth: 200 },
  { id: "typeVehicle", label: "Tipo Vehículo", minWidth: 200 },
  { id: "client", label: "Cliente", minWidth: 200 },
  { id: "phone", label: "Teléfono", minWidth: 200 },
];

const styleIconAdd = {
  display: "flex",
  alignItems: "center",
  padding: "20px",
};

export const Vehicles = () => {
  const vehicles = useVehicles();
  const { defaultVehicle, dataVehicle, setDataVehicle } = vehicles;

  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const getListVehicles = async () => {
    const response = await getVehicles();
    if (response) {
      const data = response.data.map((item: Vehicle) => {
        return {
          id: item.id,
          plate: item.plate,
          typeVehicle: item.typeVehicle.type,
          typeVehicleId: item.typeVehicle.id,
          client: item.client,
          phone: item.phone,
        };
      });
      setData(data);
    }
  };

  const handleCreate = async () => {
    const payload = {
      plate: dataVehicle.plate,
      typeVehicleId: dataVehicle.typeVehicleId,
      client: dataVehicle.client,
      phone: dataVehicle.phone,
    };
    const response = await queryCreateVehicleById(payload);
    if (response) {
      getListVehicles();
      setOpenModal(false);
      setDataVehicle(defaultVehicle);
    }
  };

  const handleEdit = async () => {
    const payload = {
      plate: dataVehicle.plate,
      typeVehicleId: dataVehicle.typeVehicleId,
      client: dataVehicle.client,
      phone: dataVehicle.phone,
    };
    const response = await queryEditVehicleById(dataVehicle.id, payload);
    if (response) {
      getListVehicles();
      setOpenModal(false);
      setDataVehicle(defaultVehicle);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const openModalCreate = () => {
    setIsEditing(false);
    setDataVehicle(defaultVehicle);
    setOpenModal(true);
  };

  const openModalEdit = (row: VehicleSelected) => {
    setIsEditing(true);
    setDataVehicle(row);
    setOpenModal(true);
  };

  const openModalDelete = (row: VehicleSelected) => {
    setDataVehicle(row);
    setModalDelete(true);
  };

  const handleDelete = async () => {
    const response = await queryDeleteVehicleById(dataVehicle.id);
    if (response) {
      setDataVehicle(defaultVehicle);
      getListVehicles();
      setModalDelete(false);
    }
  };

  useEffect(() => {
    getListVehicles();
  }, []);

  return (
    <>
      <ModalEditVehicle
        isEditing={isEditing}
        openModal={openModal}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleClose={handleClose}
        vehicles={vehicles}
      />
      <ConfirmDeleteModal
        openModalDelete={modalDelete}
        handleDelete={handleDelete}
        handleCloseDelete={() => setModalDelete(false)}
      />
      <div style={styleIconAdd}>
        <h2 className="color-lime">Vehículos</h2>
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
