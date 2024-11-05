import { useState } from "react";
import { Washer } from "../../../interfaces/interfaces";

export const useWashers = () => {
  const defaultWasher = {
    id: 0,
    washer: "",
    phone: "",
  };
  const [dataWasher, setDataWasher] = useState<Washer>(defaultWasher);

  return {
    defaultWasher,
    dataWasher,
    setDataWasher,
  };
};