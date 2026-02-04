import { useState } from "react";
import dayjs from "dayjs";

export interface DefaulterWasher {
  id: string;
  amount: string;
  washerId: string;
  description: string;
  date: string;
  isPaid?: boolean;
}

export const useDefaulterWashers = () => {
  const defaultDefaulterWasher: DefaulterWasher = {
    id: "",
    amount: "",
    washerId: "",
    description: "",
    date: dayjs().format('YYYY-MM-DD'),
  };
  
  const [dataDefaulterWasher, setDataDefaulterWasher] = useState<DefaulterWasher>(defaultDefaulterWasher);

  return {
    defaultDefaulterWasher,
    dataDefaulterWasher,
    setDataDefaulterWasher,
  };
};
