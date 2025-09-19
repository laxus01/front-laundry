import { useState } from "react";

export interface Shopping {
  id: string;
  quantity: string;
  productId: string;
  date: string;
}

export const useShopping = () => {
  const defaultShopping: Shopping = {
    id: "",
    quantity: "",
    productId: "",
    date: new Date().toISOString().split('T')[0],
  };
  
  const [dataShopping, setDataShopping] = useState<Shopping>(defaultShopping);

  return {
    defaultShopping,
    dataShopping,
    setDataShopping,
  };
};
