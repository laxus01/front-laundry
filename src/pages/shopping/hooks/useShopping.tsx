import { useState } from "react";
import dayjs from "dayjs";

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
    date: dayjs().format('YYYY-MM-DD'),
  };
  
  const [dataShopping, setDataShopping] = useState<Shopping>(defaultShopping);

  return {
    defaultShopping,
    dataShopping,
    setDataShopping,
  };
};
