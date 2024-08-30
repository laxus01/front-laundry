import TableComponent from "../../components/TableComponent";

const columns = [
  { id: 'plate', label: 'Placa', minWidth: 200 },
  { id: 'client', label: 'Cliente', minWidth: 200 },
  { id: 'washer', label: 'Lavador', minWidth: 200 },
];

const data = [
  { plate: 'SEL445', client: 'RUBEN AGUIRRE', washer: 'JORGE URANGO' },
  { plate: 'STK125', client: 'EDGAR BIBAR', washer: 'DARGE LORA' },
  // ... more data
];

const handleEdit = (row: any) => {
  console.log('Edit:', row);
};

const handleDelete = (row: any) => {
  console.log('Delete:', row);
};

export const Attentions = () => {
  return (
    <>
      <h2 className="color-lime">Listado de atenciones</h2>
      <TableComponent columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete}/>
    </>
  );
};