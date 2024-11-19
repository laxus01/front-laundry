import { useState } from "react";
import { VehicleSelected } from "../../../interfaces/interfaces";

export const useVehicles = () => {
  const defaultVehicle = {
    id: "",
    plate: "",
    client: "",
    phone: "",
    typeVehicleId: 0,
  };
  const [dataVehicle, setDataVehicle] =
    useState<VehicleSelected>(defaultVehicle);

  return {
    defaultVehicle,
    dataVehicle,
    setDataVehicle,
  };
};
