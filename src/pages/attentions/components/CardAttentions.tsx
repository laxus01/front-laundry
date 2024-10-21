import "../styles/CardAttentions.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";
import TableComponent from "../../../components/TableComponent";

const columns = [
    { id: "service", label: "Servicio", minWidth: 200 },
    { id: "value", label: "Valor", minWidth: 200 },
  ];

  const columns2 = [
    { id: "service", label: "Producto", minWidth: 200 },
    { id: "value", label: "Valor", minWidth: 200 },
  ];

export const CardAttentions = () => {
  const [stateBody, setStateBody] = useState(false);

  const handleStateBody = () => {
    setStateBody(!stateBody);
  };

    const data = [
        { service: "Lavado de carro", value: "$50.000" },
    ];

    const data2 = [
        { service: "Lavado de carro", value: "$50.000" },
        { service: "Lavado de moto", value: "$30.000" },
    ];

    const openModalEdit = (row: any) => {
      console.log("Edit", row);        
    };

    const openModalDelete = (row: any) => {
        console.log("Delete", row);
    };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Vehiculo: SEL598</div>
        <div className="card-date">Total a pagar: $65.000</div>
      </div>
      {stateBody && (
        <div className="card-content">
          <div className="card-content-left">
          <TableComponent
            columns={columns}
            data={data}
            paginationEnabled={false}
            onEdit={openModalEdit}
            onDelete={openModalDelete}
            />
          </div>
          <div className="card-content-right">
          <TableComponent
            columns={columns2}
            data={data2}
            paginationEnabled={false}
            onEdit={openModalEdit}
            onDelete={openModalDelete}
            />
          </div>
        </div>
      )}
      <div className="card-footer">
        <div className="card-author">Lavador: Camilo Rivero</div>
        <div className="card-actions">
          <div className="card-action">
            {stateBody ? (
              <KeyboardArrowUpIcon onClick={handleStateBody} />
            ) : (
              <KeyboardArrowDownIcon onClick={handleStateBody} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
