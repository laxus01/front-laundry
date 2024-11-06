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
  { id: "value", label: "Valor", minWidth: 100, align: "center" },
];

const columnsProducts = [
  { id: "name", label: "Producto", minWidth: 200 },
  { id: "quantity", label: "Cantidad", minWidth: 100, align: "center" },
  { id: "value", label: "Valor", minWidth: 100, align: "center" },
];

const styleIcon = {
  fontSize: 25,
  color: "#9FB404",
  cursor: "pointer",
};

export const CardAttentions = () => {
  const [stateBody, setStateBody] = useState(false);
  const [stateModalServices, setStateModalServices] = useState(false);
  const [stateModalProducts, setStateModalProducts] = useState(false);
  const [dataServices, setDataServices] = useState<
    OptionsComboBoxAutoComplete[]
  >([]);
  const [dataProducts, setDataProducts] = useState<
    OptionsComboBoxAutoComplete[]
  >([]);

  const handleStateBody = () => {
    setStateBody(!stateBody);
  };

  const pushServices = (serviceSelected: any) => {
    const currentListServices = JSON.parse(
      localStorage.getItem("currentListServices") || "[]"
    );
    currentListServices.push(serviceSelected);
    localStorage.setItem(
      "currentListServices",
      JSON.stringify(currentListServices)
    );
    setDataServices((prevData) => [...prevData, serviceSelected]);
  };

  const pushProducts = (productSelected: any) => {
    const currentListProducts = JSON.parse(
      localStorage.getItem("currentListProducts") || "[]"
    );
    currentListProducts.push(productSelected);
    localStorage.setItem(
      "currentListProducts",
      JSON.stringify(currentListProducts)
    );
    setDataProducts((prevData) => [...prevData, productSelected]);
  };

  const deleteService = (row: any) => {
    const updatedServices = dataServices.filter(
      (service: any) => service.uuid !== row.uuid
    );
    setDataServices(updatedServices);
    localStorage.setItem(
      "currentListServices",
      JSON.stringify(updatedServices)
    );
  };

  const deleteProduct = (row: any) => {
    const updatedProducts = dataProducts.filter(
      (product: any) => product.uuid !== row.uuid
    );
    setDataProducts(updatedProducts);
    localStorage.setItem(
      "currentListProducts",
      JSON.stringify(updatedProducts)
    );
  };

  useEffect(() => {
    const currentListServices = JSON.parse(
      localStorage.getItem("currentListServices") || "[]"
    );
    const currentListProducts = JSON.parse(
      localStorage.getItem("currentListProducts") || "[]"
    );
    setDataServices(currentListServices);
    setDataProducts(currentListProducts);
  }, []);

  return (
    <div className="card">
      <ModalServices
        isEditing={false}
        openModal={stateModalServices}
        handleClose={() => {
          setStateModalServices(false);
        }}
        setService={pushServices}
      />
      <ModalProducts
        isEditing={false}
        openModal={stateModalProducts}
        handleClose={() => {
          setStateModalProducts(false);
        }}
        setProduct={pushProducts}
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
              <DeleteIcon style={styleIcon} />
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
              onEdit={() => {}}
              onDelete={deleteService}
            />
          </div>
          <div className="card-content-right">
            <TableComponent
              columns={columnsProducts}
              data={dataProducts}
              paginationEnabled={false}
              edit={false}
              onEdit={() => {}}
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
