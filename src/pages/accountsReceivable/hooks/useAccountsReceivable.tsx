import { useState } from "react";
import { AccountReceivableSelected } from "../../../interfaces/interfaces";

export const useAccountsReceivable = () => {
  const defaultAccountReceivable = {
    id: "",
    value: 0,
    date: "",
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
