import { useState } from "react";
import { Sale } from "../../../interfaces/interfaces";
import dayjs from "dayjs";

export const useSales = () => {
  const defaultSale = {
    id: "",
    quantity: 0,
    productId: "",
    date: dayjs().format('YYYY-MM-DD'),
    washerId: "",
  };
  const [dataSale, setDataSale] = useState<Sale>(defaultSale);

  return {
    defaultSale,
    dataSale,
    setDataSale,
  };
};
