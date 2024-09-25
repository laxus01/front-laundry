import { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import { getVehicles, queryEditVehicleById } from "./services/Vehicle.services";
import ModalEditVehicle from "./components/ModalEditVehicle";
import { Vehicle } from "../../interfaces/interfaces";
import { useVehicles } from "./hooks/useVehicles";

const columns = [
  { id: "plate", label: "Placa", minWidth: 200 },
  { id: "typeVehicle", label: "Tipo Vehículo", minWidth: 200 },
  { id: "client", label: "Cliente", minWidth: 200 },
  { id: "phone", label: "Teléfono", minWidth: 200 },
];

export const Vehicles = () => {

  const vehicles = useVehicles(); 
  const { dataVehicle, setDataVehicle } = vehicles;
  
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  

  const getListVehicles = async () => {
    const response = await getVehicles();
    if (response) {
      const data = response.data.map((item: any) => {
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

  const handleEdit = async() => { 
    const payload = {
      plate: dataVehicle.plate,
      typeVehicleId: dataVehicle.typeVehicle,
      client: dataVehicle.client,
      phone: dataVehicle.phone,
    };
    
    const response = await queryEditVehicleById(dataVehicle.id, payload);
    console.log(response);   
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const openModalEdit = (row: Vehicle) => {   
    console.log("Edit:", row);
    
    setDataVehicle(row);    
    setOpenModal(true);
  }

  const openModalDelete = (row: Vehicle) => {
    console.log("Delete:", row);
  };

  useEffect(() => {
    getListVehicles();
  }, []);

  return (
    <>
      <ModalEditVehicle
        openModal={openModal}
        handleEdit={handleEdit}
        handleClose={handleClose}
        vehicles={vehicles}
      />
      <h2 className="color-lime">Listado de Vehículos</h2>
      <TableComponent
        columns={columns}
        data={data}
        onEdit={openModalEdit}
        onDelete={openModalDelete}
      />
    </>
  );
};
