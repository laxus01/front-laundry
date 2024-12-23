import { useState } from "react";
import { Service } from "../../../interfaces/interfaces";

export const useServices = () => {
  const defaultService = {
    id: "",
    service: "",
    value: 0,
  };
  const [dataService, setDataService] = useState<Service>(defaultService);

  return {
    defaultService,
    dataService,
    setDataService,
  };
};
