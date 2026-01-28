import { useState } from "react";
import { AdvanceSelected } from "../../../interfaces/interfaces";

export const useAdvances = () => {
  const defaultAdvance: AdvanceSelected = {
    id: "",
    value: 0,
    date: "",
    washerId: "",
    washerName: "",
  };
  const [dataAdvance, setDataAdvance] = useState<AdvanceSelected>(defaultAdvance);

  return {
    defaultAdvance,
    dataAdvance,
    setDataAdvance,
  };
};
