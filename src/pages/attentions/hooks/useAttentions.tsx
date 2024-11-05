import { useState } from "react";
import { OptionsComboBoxAutoComplete, Service } from "../../../interfaces/interfaces";
import { getServices } from "../../vehicles/services/Vehicle.services";

export const useAttentions = () => {
  const [listServices, setListServices] = useState<
  OptionsComboBoxAutoComplete[]
>([{ id: 0, name: "" }]);
const [dataServices, setDataServices] = useState<OptionsComboBoxAutoComplete[]>([]);

const getListServices = async () => {
  const response = await getServices();
  if (response) {
    const services = response.data.map((item: Service) => {
      return {
        id: item.id,
        name: item.service,
        value: item.value,
      };
    });      
    setListServices(services);      
  }
};

  return {
    dataServices,
    setDataServices,
    listServices,
    setListServices,
    getListServices,
  };
};
