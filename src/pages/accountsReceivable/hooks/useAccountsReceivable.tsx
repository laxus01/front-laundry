import { useState } from "react";
import { AccountReceivableSelected } from "../../../interfaces/interfaces";
import dayjs from "dayjs";

export const useAccountsReceivable = () => {
  const defaultAccountReceivable = {
    id: "",
    value: 0,
    date: dayjs().format('YYYY-MM-DD'),
    detail: "",
    vehicleId: "",
    vehicleName: "",
    plate: "",
    clientName: "",
    phone: "",
  };
  
  const [dataAccountReceivable, setDataAccountReceivable] =
    useState<AccountReceivableSelected>(defaultAccountReceivable);

  return {
    defaultAccountReceivable,
    dataAccountReceivable,
    setDataAccountReceivable,
  };
};
