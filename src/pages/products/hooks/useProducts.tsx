import { useState } from "react";
import { Product } from "../../../interfaces/interfaces";

export const useProducts = () => {
  const defaultProduct = {
    id: "",
    product: "",
    valueBuys: 0,
    saleValue: 0,
    existence: 0,
  };
  const [dataProduct, setDataProduct] = useState<Product>(defaultProduct);

  return {
    defaultProduct,
    dataProduct,
    setDataProduct,
  };
};
