import { useEffect, useState } from "react";
import TableComponent from "../../components/TableComponent";
import { getVehicles } from "./services/Vehicle.services";

const columns = [
  { id: "plate", label: "Placa", minWidth: 200 },
  { id: "typeVehicle", label: "Tipo Vehiculo", minWidth: 200 },
  { id: "client", label: "Cliente", minWidth: 200 },
  { id: "phone", label: "Telefono", minWidth: 200 },
];

export const Vehicle = () => {
  const [data, setData] = useState([]);

  const getListVehicles = async () => {
    const response = await getVehicles();
    if (response) {
      const data = response.data.map((item: any) => {
        return {
          id: item.id,
          plate: item.plate,
          typeVehicle: item.typeVehicleId.type,
          client: item.client,
          phone: item.phone,
        };
      });
      setData(data);
    }
  };

  const handleEdit = (row: any) => {
    console.log("Edit:", row);
  };

  const handleDelete = (row: any) => {
    console.log("Delete:", row);
  };

  useEffect(() => {
    getListVehicles();
  }, []);

  return (
    <>
      <h2 className="color-lime">Listado de vehiculos</h2>
      <TableComponent
        columns={columns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
};
