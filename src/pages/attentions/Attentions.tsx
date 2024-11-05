import { useEffect, useState } from "react";
import { getVehicles } from "../vehicles/services/Vehicle.services";
import {
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

const styleIconAdd = {
  display: "flex",
  alignItems: "center",
  padding: "20px",
};

export const Attentions = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleCreate = async () => {
    console.log("Create");
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

  useEffect(() => {
    getListVehicles();
    getListWashers();
  }, []);
  return (
    <>
      <ModalAttentions
        listVehicles={listVehicles}
        listWashers={listWashers}
        isEditing={isEditing}
        openModal={openModal}
        handleCreate={handleCreate}
        handleEdit={handleEdit}
        handleClose={handleClose}
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
        <CardAttentions />
      </div>
    </>
  );
};
