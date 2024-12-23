import { Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TableComponent from "../../components/TableComponent";
import { useEffect, useState } from "react";
import { ListServices } from "../../interfaces/interfaces";
import { formatPrice, removeFormatPrice } from "../../utils/utils";
//import ModalEditService from "./components/ModalEditService";
import {
  getServices,
  queryCreateService,
  queryDeleteServiceById,
  queryEditServiceById,
} from "./services/Services.services";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { useServices } from "./hooks/useServices";
import ModalEditService from "./components/ModalEditService";
//import { useServices } from "./hooks/useServices";

const columns = [
  { id: "service", label: "Servicio", minWidth: 200 },
  { id: "value", label: "Valor", minWidth: 200 },
];

const styleIconAdd = {
  display: "flex",
  alignItems: "center",
  padding: "20px",
};

export const Services = () => {
  const services = useServices();
  const { dataService, setDataService, defaultService } = services;

  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const openModalCreate = () => {
    setIsEditing(false);
    setDataService(defaultService);
    setOpenModal(true);
  };

  const handleCreate = async () => {    
    const payload = {
      service: dataService.service,
      value: removeFormatPrice(dataService.value.toString()),
    };
    const response = await queryCreateService(payload);
    if (response) {
      getListServices();
      setOpenModal(false);
      setDataService(defaultService);
    }
  };

  const handleEdit = async () => {
    const payload = {
      service: dataService.service,
      value: removeFormatPrice(dataService.value.toString()),
    };
    const response = await queryEditServiceById(dataService.id, payload);
    if (response) {
      getListServices();
      setOpenModal(false);
      setDataService(defaultService);
    }
  }; 

  const handleDelete = async () => {
    const response = await queryDeleteServiceById(dataService.id);
    if (response) {
      setDataService(defaultService);
      getListServices();
      setModalDelete(false);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const openModalEdit = (row: any) => {
    setIsEditing(true);
    setDataService(row);
    setOpenModal(true);
  };

  const openModalDelete = (row: any) => {
    setDataService(row);
    setModalDelete(true);
  };

  const getListServices = async () => {
    const response = await getServices();
    if (response) {
      const data = response.data.map((item: ListServices) => {
        return {
          id: item.id,
          service: item.service,
          value: formatPrice(item.value),
        };
      });
      setData(data);
    }
  };

  useEffect(() => {
    getListServices();
  }, []);

  return (
    <>
      <ModalEditService
        isEditing={isEditing}
        openModal={openModal}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleClose={handleClose}
        services={services}
      />
      <ConfirmDeleteModal
        openModalDelete={modalDelete}
        handleDelete={handleDelete}
        handleCloseDelete={() => setModalDelete(false)}
      />
      <div style={styleIconAdd}>
        <h2 className="color-lime">Servicios</h2>
        <div>
          <Tooltip title="Agregar Servicio">
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
