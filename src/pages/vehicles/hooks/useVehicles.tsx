import { useState } from "react";
import { Vehicle } from "../../../interfaces/interfaces";

export const useVehicles = () => {
  const [dataVehicle, setDataVehicle] = useState<Vehicle>({} as Vehicle);

  return {
    dataVehicle,
    setDataVehicle,
  };
};
