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
import { saveAttention, saveListProductsByAttention, saveListServicesByAttention } from "./services/Attentions.services";

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
  >([{ id: 0, name: "" }]);

  const [listWashers, setListWashers] = useState<
    OptionsComboBoxAutoComplete[]
  >([{ id: 0, name: "" }]);

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

  const handleEdit = async () => {
    console.log("Edit");
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const openModalCreate = () => {
    setIsEditing(false);
    setOpenModal(true);
  };

  const deleteAttention = (attentionId: string) => {
    const currentListAttentions = JSON.parse(
      localStorage.getItem("currentListAttentions") || "[]"
    );
    const newListAttentions = currentListAttentions.filter(
      (attention: Attention) => attention.attentionId !== attentionId
    );
    localStorage.setItem(
      "currentListAttentions",
      JSON.stringify(newListAttentions)
    );
    setListAttentions(newListAttentions);
  }

  const setAttention = (attention: any) => {
    const currentListAttentions = JSON.parse(
      localStorage.getItem("currentListAttentions") || "[]"
    );
    currentListAttentions.push(attention);
    localStorage.setItem(
      "currentListAttentions",
      JSON.stringify(currentListAttentions)
    );
    setListAttentions(currentListAttentions);
  }

  const handleFinish = async (attention: Attention) => {

    const payload = {
      id: attention.attentionId,
      vehicle: attention.vehicle,
      washer: attention.washer,
      percentage: attention.percentage,
    };

    const payloadServices = attention.services.map((service: any) => {
      return {
        attentionId: attention.attentionId,
        serviceId: service.id,
        value: service.value,
      };
    });

    const payloadProducts = {
      attentionId: attention.attentionId,
      products: attention.products,
    }
    
    try {      
      const response = await saveAttention(payload);      
        if(response.data) {
          saveListServicesByAttention(payloadServices);   
          //saveListProductsByAttention(payloadProducts);
        }      
      } catch (error) {
        console.error(error);
      }
  };

  useEffect(() => {
    getListVehicles();
    getListWashers();
    
    const currentListAttentions = JSON.parse(
      localStorage.getItem("currentListAttentions") || "[]"
    );
    setListAttentions(currentListAttentions);
  }, []);


  return (
    <>
      <ModalAttentions
        listVehicles={listVehicles}
        listWashers={listWashers}
        isEditing={isEditing}
        openModal={openModal}
        handleEdit={handleEdit}
        handleClose={handleClose}
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
      <div className="mt-20 mb-20">
        {listAttentions.map((attention) => (
          <CardAttentions key={attention.attentionId} attention={attention} deleteAttention={deleteAttention} handleFinish={handleFinish} />
        ))}
      </div>
    </>
  );
};
