import { useEffect, useState } from "react";
import { getVehicles } from "../vehicles/services/Vehicle.services";
import {
  Attention,
  OptionsComboBoxAutoComplete,
  Vehicle,
  Washer,
} from "../../interfaces/interfaces";
import { getWashers } from "../washers/services/Washer.services";
import { Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Divider from "@mui/material/Divider";
import { CardAttentions } from "./components/CardAttentions";
import ModalAttentions from "./components/ModalAttentions";
import {
  saveAttention,
  saveListProductsByAttention,
  saveListServicesByAttention,
} from "./services/Attentions.services";
import { removeFormatPrice } from "../../utils/utils";

const styleIconAdd = {
  display: "flex",
  alignItems: "center",
  padding: "20px",
};

export const Attentions = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [listAttentions, setListAttentions] = useState<Attention[]>([]);

  const [listVehicles, setListVehicles] = useState<
    OptionsComboBoxAutoComplete[]
  >([{ id: "", name: "" }]);

  const [listWashers, setListWashers] = useState<OptionsComboBoxAutoComplete[]>(
    [{ id: "", name: "" }]
  );

  const getListVehicles = async () => {
    const response = await getVehicles();
    if (response) {
      const vehicles = response.data.map((item: Vehicle) => {
        return {
          id: item.id,
          name: item.plate,
          client: item.client,
        };
      });
      setListVehicles(vehicles);
    }
  };

  const getListWashers = async () => {
    const response = await getWashers();
    if (response) {
      const washers = response.data.map((item: Washer) => {
        return {
          id: item.id,
          name: item.washer,
        };
      });
      setListWashers(washers);
    }
  };

  const openModalCreate = () => {
    setIsEditing(false);
    setOpenModal(true);
  };

  const updateCurrentListAttentions = (attentions: any) => {
    localStorage.setItem("currentListAttentions", JSON.stringify(attentions));
    setListAttentions(attentions);
  };

  const deleteAttention = async (attentionId: string) => {
    const currentListAttentions = currentAttention();
    const newListAttentions = currentListAttentions.filter(
      (attention: Attention) => attention.attentionId !== attentionId
    );
    updateCurrentListAttentions(newListAttentions);
  };

  const setAttention = (attention: any) => {
    const currentListAttentions = currentAttention();
    currentListAttentions.push(attention);
    updateCurrentListAttentions(currentListAttentions);
  };

  const handleFinish = async (attentionId: string) => {
    const currentListAttentions = currentAttention();
    const newListAttentions = currentListAttentions.find(
      (att: Attention) => att.attentionId === attentionId
    );

    const payload = {
      id: attentionId,
      vehicleId: newListAttentions.vehicle.id,
      washerId: newListAttentions.washer.id,
      percentage: newListAttentions.percentage,
    };

    const payloadServices = newListAttentions.services.map((service: any) => ({
      attentionId: attentionId,
      serviceId: service.id,
      value: removeFormatPrice(service.value.toString()),
    }));

    const payloadProducts = newListAttentions.products.map((product: any) => ({
      attentionId: attentionId,
      productId: product.id,
      quantity: product.quantity,
    }));

    try {
      const response = await saveAttention(payload);
      if (response.data) {
        await saveListServicesByAttention(payloadServices);
        if (payloadProducts.length > 0) {
          await saveListProductsByAttention(payloadProducts);
        }
        await deleteAttention(attentionId);
      }
    } catch (error) {
      console.error("Error saving attention:", error);
    }
  };

  const currentAttention = () => {
    return JSON.parse(localStorage.getItem("currentListAttentions") || "[]");
  };

  useEffect(() => {
    getListVehicles();
    getListWashers();
    setListAttentions(currentAttention());
  }, []);

  return (
    <>
      <ModalAttentions
        listVehicles={listVehicles}
        listWashers={listWashers}
        isEditing={isEditing}
        openModal={openModal}
        handleEdit={() => {}}
        handleClose={() => {
          setOpenModal(false);
        }}
        setAttention={setAttention}
      />
      <div style={styleIconAdd}>
        <h2 className="color-lime">Atenciones</h2>
        <div>
          <Tooltip title="Agregar Atención">
            <AddCircleIcon
              style={{ fontSize: 40, color: "#9FB404", cursor: "pointer" }}
              onClick={openModalCreate}
            />
          </Tooltip>
        </div>
      </div>
      <Divider />
      <div className="attentions">
        {listAttentions.map((attention) => (
          <CardAttentions
            key={attention.attentionId}
            attention={attention}
            deleteAttention={deleteAttention}
            handleFinish={handleFinish}
          />
        ))}
      </div>
    </>
  );
};
