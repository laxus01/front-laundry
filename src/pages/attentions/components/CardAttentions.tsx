import "../styles/CardAttentions.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useState } from "react";
import TableComponent from "../../../components/TableComponent";
import { Stack, Tooltip } from "@mui/material";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalCarWashIcon from "@mui/icons-material/LocalCarWash";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalServices from "./ModalServices";
import ModalProducts from "./ModalProducts";
import { OptionsComboBoxAutoComplete } from "../../../interfaces/interfaces";

const columnsServices = [
  { id: "name", label: "Servicio", minWidth: 200 },
  { id: "value", label: "Valor", minWidth: 200 },
];

const columnsProducts = [
  { id: "product", label: "Producto", minWidth: 200 },
  { id: "cant", label: "Cantidad", minWidth: 200 },
  { id: "value", label: "Valor", minWidth: 200 },
];

const styleIcon = {
  fontSize: 25, 
  color: "#9FB404", 
  cursor: "pointer",
}

export const CardAttentions = () => {
  const [stateBody, setStateBody] = useState(false);
  const [stateModalServices, setStateModalServices] = useState(false);
  const [stateModalProducts, setStateModalProducts] = useState(false);
  const [dataServices, setDataServices] = useState<OptionsComboBoxAutoComplete[]>([]);

  const handleStateBody = () => {
    setStateBody(!stateBody);
  };

  const pushServices = (serviceSelected: any) => {    
    const currentListServices = localStorage.getItem("currentListServices");
    if (currentListServices) {
      const parsedList = JSON.parse(currentListServices);
      parsedList.push(serviceSelected);
      localStorage.setItem("currentListServices", JSON.stringify(parsedList));
    } else {
      localStorage.setItem("currentListServices", JSON.stringify([serviceSelected]));
    }
    setDataServices((prevData) => [...prevData, serviceSelected]);
  };

  //Funciones utilizadas por las tablas

  const deleteService = (row: any) => {
    setDataServices(dataServices.filter((service: any) => service.uuid !== row.uuid));
    const currentListServices = localStorage.getItem("currentListServices");
    if (currentListServices) {
      const parsedList = JSON.parse(currentListServices);
      const newList = parsedList.filter((service: any) => service.uuid !== row.uuid);
      localStorage.setItem("currentListServices", JSON.stringify(newList));
    }
  };

  const deleteProduct = (row: any) => {
    console.log("Delete", row);
  };

  const listProducts = [{ id: 1, name: "CocaCola", value: "2000" }];

  useEffect(() => {
    const currentListServices = localStorage.getItem("currentListServices");
    if (currentListServices) {
      const parsedList = JSON.parse(currentListServices);
      setDataServices(parsedList);
    }
  }, []);

  return (
    <div className="card">
      <ModalServices
        isEditing={false}
        openModal={stateModalServices}
        handleClose={()=>{
          setStateModalServices(false);
        }}
        setService={pushServices}
      />
      <ModalProducts
        listProducts={listProducts}
        isEditing={false}
        openModal={stateModalProducts}
        handleClose={()=>{
          setStateModalServices(false);
        }}
      />
      <div className="card-header">
        <Stack direction="row" spacing={3} alignItems="center">
          <div className="card-title">Vehiculo: SEL598</div>
          <div>
            <Tooltip title="Agregar Servicio">
              <LocalCarWashIcon
                style={styleIcon}
                onClick={() => {
                  setStateModalServices(true);
                }}
              />
            </Tooltip>
          </div>
          <div>
            <Tooltip title="Agregar Producto">
              <FastfoodIcon
                style={styleIcon}
                onClick={() => {
                  setStateModalProducts(true);
                }}
              />
            </Tooltip>
          </div>
          <div>
            <Tooltip title="Eliminar Atención">
              <DeleteIcon
                style={styleIcon}
              />
            </Tooltip>
          </div>
        </Stack>
        <div className="card-date">Total a pagar: $65.000</div>
      </div>
      {stateBody && (
        <div className="card-content">
          <div className="card-content-left">
            <TableComponent
              columns={columnsServices}
              data={dataServices}
              paginationEnabled={false}
              edit={false}
              onEdit={()=>{}}
              onDelete={deleteService}
            />
          </div>
          <div className="card-content-right">
            <TableComponent
              columns={columnsProducts}
              data={[]}
              paginationEnabled={false}
              onEdit={()=>{}}
              onDelete={deleteProduct}
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
