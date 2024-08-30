import TableComponent from "../../components/TableComponent";

const columns = [
  { id: 'plate', label: 'Placa', minWidth: 200 },
  { id: 'typeVehicle', label: 'Tipo Vehiculo', minWidth: 200 },
  { id: 'client', label: 'Cliente', minWidth: 200 },
  { id: 'phone', label: 'Telefono', minWidth: 200 },
];

const data = [
  { plate: 'SEL445', typeVehicle: 'AUTOMOVIL', client: 'RUBEN AGUIRRE', phone: '3001234567' },	
  { plate: 'STK125', typeVehicle: 'CAMPERO', client: 'EDGAR BIBAR', phone: '3001288567' },
  // ... more data
];

const handleEdit = (row: any) => {
  console.log('Edit:', row);
};

const handleDelete = (row: any) => {
  console.log('Delete:', row);
};

export const Vehicle = () => {
  return (
    <>
      <h2 className="color-lime">Listado de vehiculos</h2>
      <TableComponent columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete}/>
    </>
  );
};
