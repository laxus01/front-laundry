import { useState } from "react";
import { Sale } from "../../../interfaces/interfaces";

export const useSales = () => {
  const defaultSale = {
    id: "",
    quantity: 0,
    productId: "",
    date: "",
    washerId: "",
  };
  const [dataSale, setDataSale] = useState<Sale>(defaultSale);

  return {
    defaultSale,
    dataSale,
    setDataSale,
  };
};
