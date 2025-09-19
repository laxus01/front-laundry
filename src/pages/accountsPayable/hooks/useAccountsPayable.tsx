import { useState } from "react";
import { AccountPayableSelected } from "../../../interfaces/interfaces";

export const useAccountsPayable = () => {
  const defaultAccountPayable = {
    id: "",
    value: 0,
    date: "",
    detail: "",
    providerId: "",
    providerName: "",
  };
  
  const [dataAccountPayable, setDataAccountPayable] =
    useState<AccountPayableSelected>(defaultAccountPayable);

  return {
    defaultAccountPayable,
    dataAccountPayable,
    setDataAccountPayable,
  };
};
