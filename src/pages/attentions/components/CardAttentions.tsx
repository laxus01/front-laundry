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
import {
  Attention,
  OptionsComboBoxAutoComplete,
} from "../../../interfaces/interfaces";
import ConfirmDeleteModal from "../../../components/ConfirmDeleteModal";
import ConfirmFinishModal from "./ConfirmFinishModal";
import { formatPrice, removeFormatPrice } from "../../../utils/utils";

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

interface CardAttentionsProps {
  attention: Attention;
  deleteAttention: (atention: string) => void;
}

export const CardAttentions: React.FC<CardAttentionsProps> = ({
  attention,
  deleteAttention,
}) => {
  const [stateBody, setStateBody] = useState(false);
  const [stateModalServices, setStateModalServices] = useState(false);
  const [stateModalProducts, setStateModalProducts] = useState(false);
  const [stateDeleteModal, setStateDeleteModal] = useState(false);
  const [stateFinishModal, setStateFinishModal] = useState(false);

  const [dataServices, setDataServices] = useState<
    OptionsComboBoxAutoComplete[]
  >(attention.services);

  const [dataProducts, setDataProducts] = useState<
    OptionsComboBoxAutoComplete[]
  >(attention.products);

  const handleStateBody = () => {
    setStateBody(!stateBody);
  };

  const updateLocalStorage = (
    updatedData: any,
    type: "services" | "products"
  ) => {
    const currentListAttentions = JSON.parse(
      localStorage.getItem("currentListAttentions") || "[]"
    );
    const currentAttention = currentListAttentions.find(
      (att: any) => att.attentionId === attention.attentionId
    );
    currentAttention[type] = updatedData;
    localStorage.setItem(
      "currentListAttentions",
      JSON.stringify(currentListAttentions)
    );
  };

  const pushItem = (
    itemSelected: any,
    type: "services" | "products",
    setData: React.Dispatch<React.SetStateAction<OptionsComboBoxAutoComplete[]>>
  ) => {
    console.log(itemSelected);

    setData((prevData) => {
      const updatedData = [...prevData, itemSelected];
      updateLocalStorage(updatedData, type);
      return updatedData;
    });
  };

  const deleteItem = (
    item: OptionsComboBoxAutoComplete,
    type: "services" | "products",
    data: OptionsComboBoxAutoComplete[],
    setData: React.Dispatch<React.SetStateAction<OptionsComboBoxAutoComplete[]>>
  ) => {
    const updatedData = data.filter(
      (currentItem: OptionsComboBoxAutoComplete) => currentItem.id !== item.id
    );
    setData(updatedData);
    updateLocalStorage(updatedData, type);
  };

  const pushServices = (serviceSelected: any) => {
    pushItem(serviceSelected, "services", setDataServices);
    setStateModalServices(false);
  };

  const pushProducts = (productSelected: any) => {
    pushItem(productSelected, "products", setDataProducts);
    setStateModalProducts(false);
  };

  const deleteService = (service: OptionsComboBoxAutoComplete) => {
    deleteItem(service, "services", dataServices, setDataServices);
  };

  const deleteProduct = (product: OptionsComboBoxAutoComplete) => {
    deleteItem(product, "products", dataProducts, setDataProducts);
  };

  const calculateTotalValue = () => {
    let totalValue = 0;
    dataServices.forEach((service) => {
      const serviceValue = removeFormatPrice(service.value?.toString() ?? "0");
      totalValue += Number(serviceValue);
    });
    dataProducts.forEach((product) => {
      const productValue = removeFormatPrice(product.value?.toString() ?? "0");
      totalValue += Number(productValue ?? 0) * (product.quantity ?? 0);
    });
    return formatPrice(totalValue);
  };

  const handleDeleteAttention = () => {
    deleteAttention(attention.attentionId);
  };

  const handleFinishAttention = () => {
    console.log("Finish");
  };

  return (
    <div className="card">
      <ConfirmDeleteModal
        openModalDelete={stateDeleteModal}
        handleDelete={handleDeleteAttention}
        handleCloseDelete={() => setStateDeleteModal(false)}
        title={`Eliminar Atención vehículo ${attention.vehicle.name}`}
        message="¿Esta seguro de eliminar esta atención?"
      />
      <ConfirmFinishModal
        openModalFinish={stateFinishModal}
        handleFinish={handleFinishAttention}
        handleCloseFinish={() => setStateFinishModal(false)}
        title={`Finalizar Atención vehículo ${attention.vehicle.name}`}
        message="Total a pagar:"
        totalValue={calculateTotalValue()}
      />
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
          <div className="card-title">Vehiculo: {attention.vehicle.name}</div>
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
                onClick={() => setStateDeleteModal(true)}
              />
            </Tooltip>
          </div>
        </Stack>
        <Stack
          onClick={() => setStateFinishModal(true)}
          direction="row"
          spacing={2}
          alignItems="center"
          style={{ marginRight: "10px" }}
        >
          <div className="card-date">Total a pagar:</div>
          <div className="card-title">${calculateTotalValue()}</div>
        </Stack>
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
              emptyDataMessage="Sin servicios relacionados..."
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
              emptyDataMessage="Sin productos relacionados..."
            />
          </div>
        </div>
      )}
      <div className="card-footer">
        <Stack direction="row" spacing={2} alignItems="center">
          <div className="card-author">Lavador: </div>
          <div className="card-title">{attention.washer.name}</div>
        </Stack>
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
