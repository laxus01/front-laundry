import "../styles/CardAttentions.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";
import TableComponent from "../../../components/TableComponent";
import { Stack, Tooltip } from "@mui/material";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalCarWashIcon from "@mui/icons-material/LocalCarWash";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalServices from "./ModalServices";
import ModalProducts from "./ModalProducts";

interface Product {
  productId: number;
  product: string;
  cant: string;
  value: string;
}

interface Service {
  serviceId: number;
  service: string;
  value: string;
}

const columnsServices = [
  { id: "service", label: "Servicio", minWidth: 200 },
  { id: "value", label: "Valor", minWidth: 200 },
];

const columnsProducts = [
  { id: "product", label: "Producto", minWidth: 200 },
  { id: "cant", label: "Cantidad", minWidth: 200 },
  { id: "value", label: "Valor", minWidth: 200 },
];

export const CardAttentions = () => {
  const [stateBody, setStateBody] = useState(false);
  const [openModalServices, setOpenModalServices] = useState(false);
  const [openModalProducts, setOpenModalProducts] = useState(false);
  const [dataServices, setDataServices] = useState<Service[]>([]);
  const [dataProducts, setDataProducts] = useState<Product[]>([]);

  const handleStateBody = () => {
    setStateBody(!stateBody);
  };

  const pushServices = (service: Service) => {
    setDataServices((prevData) => [...prevData, service]);
  };

  const pushProducts = (product: Product) => {
    setDataProducts((prevData) => [...prevData, product]);
  };

  const openModalEdit = (row: any) => {
    console.log("Edit", row);
  };

  const openModalDelete = (row: any) => {
    console.log("Delete", row);
  };

  const handleCloseModalServices = () => {
    setOpenModalServices(false);
  };

  const handleCloseModalProducts = () => {
    setOpenModalProducts(false);
  };

  const listServices = [{ id: 1, name: "Lavado de auto" }];
  const listProducts = [{ id: 1, name: "CocaCola" }];

  return (
    <div className="card">
      <ModalServices
        listServices={listServices}
        isEditing={false}
        openModal={openModalServices}
        handleClose={handleCloseModalServices}
      />
      <ModalProducts
        listProducts={listProducts}
        isEditing={false}
        openModal={openModalProducts}
        handleClose={handleCloseModalProducts}
      />
      <div className="card-header">
        <Stack direction="row" spacing={3} alignItems="center">
          <div className="card-title">Vehiculo: SEL598</div>
          <div>
            <Tooltip title="Agregar Servicio">
              <LocalCarWashIcon
                style={{ fontSize: 25, color: "#9FB404", cursor: "pointer" }}
                onClick={() => {
                  setOpenModalServices(true);
                }}
              />
            </Tooltip>
          </div>
          <div>
            <Tooltip title="Agregar Producto">
              <FastfoodIcon
                style={{ fontSize: 25, color: "#9FB404", cursor: "pointer" }}
                onClick={() => {
                  setOpenModalProducts(true);
                }}
              />
            </Tooltip>
          </div>
          <div>
            <Tooltip title="Eliminar Atención">
              <DeleteIcon
                style={{ fontSize: 25, color: "#9FB404", cursor: "pointer" }}
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
              onEdit={openModalEdit}
              onDelete={openModalDelete}
            />
          </div>
          <div className="card-content-right">
            <TableComponent
              columns={columnsProducts}
              data={dataProducts}
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
