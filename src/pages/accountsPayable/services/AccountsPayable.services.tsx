import { environment } from "../../../env";
import {
  requestDelete,
  requestGet,
  requestPost,
  requestPut,
} from "../../../services/axios/axios.services";

export const getAccountsPayable = async () => {
  return await requestGet(environment.accountsPayable);
};

export const queryCreateAccountPayableById = async (payload: any) => {
  return await requestPost(environment.accountsPayable, payload);
};

export const queryEditAccountPayableById = async (id: string, payload: any) => {
  return await requestPut(`${environment.accountsPayable}/${id}`, payload);
};

export const queryDeleteAccountPayableById = async (id: string) => {
  return await requestDelete(`${environment.accountsPayable}/${id}`);
};

export const getProviders = async () => {
  return await requestGet(environment.providers);
};

// Payment services for accounts payable
export const getAccountPayablePayments = async (accountsPayableId: string) => {
  return await requestGet(`${environment.accountsPayablePayments}?accountsPayableId=${accountsPayableId}`);
};

export const queryCreateAccountPayablePayment = async (payload: any) => {
  return await requestPost(`${environment.accountsPayablePayments}`, payload);
};

export const queryEditAccountPayablePayment = async (id: string, payload: any) => {
  return await requestPut(`${environment.accountsPayablePayments}/${id}`, payload);
};

export const queryDeleteAccountPayablePayment = async (id: string) => {
  return await requestDelete(`${environment.accountsPayablePayments}/${id}`);
};
