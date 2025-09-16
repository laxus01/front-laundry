import { useState } from "react";
import { ParkingSelected } from "../../../interfaces/interfaces";

export const useParkings = () => {
  const defaultParking = {
    id: "",
    plate: "",
    vehicleType: "",
    client: "",
    phone: "",
    balance: 0,
    startDate: "",
    endDate: "",
    value: 0,
    vehicleId: "",
    typeParkingId: "",
  };
  const [dataParking, setDataParking] =
    useState<ParkingSelected>(defaultParking);

  return {
    defaultParking,
    dataParking,
    setDataParking,
  };
};
