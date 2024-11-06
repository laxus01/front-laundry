import { useState } from "react";
import {
  OptionsComboBoxAutoComplete,
  ListServices,
  ListProducts,
} from "../../../interfaces/interfaces";
import {
  getProducts,
  getServices,
} from "../../vehicles/services/Vehicle.services";

export const useAttentions = () => {
  const [listServices, setListServices] = useState<
    OptionsComboBoxAutoComplete[]
  >([{ id: 0, name: "" }]);
  const [listProducts, setListProducts] = useState<
    OptionsComboBoxAutoComplete[]
  >([{ id: 0, name: "" }]);

  const getListServices = async () => {
    const response = await getServices();
    if (response) {
      const services = response.data.map((item: ListServices) => {
        return {
          id: item.id,
          name: item.service,
          value: item.value,
        };
      });
      setListServices(services);
    }
  };

  const getListProducts = async () => {
    const response = await getProducts();
    if (response) {
      const products = response.data.map((item: ListProducts) => {
        return {
          id: item.id,
          name: item.product,
          value: item.saleValue,
        };
      });
      setListProducts(products);
    }
  };

  return {
    listServices,
    setListServices,
    getListServices,
    listProducts,
    setListProducts,
    getListProducts,
  };
};
