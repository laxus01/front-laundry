import { useState } from "react";
import {
  OptionsComboBoxAutoComplete,
  ListServices,
  ListProducts,
} from "../../../interfaces/interfaces";
import { getProducts, getServices } from "../services/Attentions.services";
import { formatPrice } from "../../../utils/utils";

export const useAttentions = () => {
  const [listServices, setListServices] = useState<
    OptionsComboBoxAutoComplete[]
  >([{ id: "", name: "" }]);
  const [listProducts, setListProducts] = useState<
    OptionsComboBoxAutoComplete[]
  >([{ id: "", name: "" }]);

  const getListServices = async () => {
    const response = await getServices();
    if (response) {
      const services = response.data.map((item: ListServices) => {
        return {
          id: item.id,
          name: item.service,
          value: formatPrice(item.value),
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
          value: formatPrice(item.saleValue),
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
