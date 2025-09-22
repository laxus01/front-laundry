import { environment } from "../../../env";
import {
  requestDelete,
  requestGet,
  requestPost,
  requestPut,
} from "../../../services/axios/axios.services";

export const getAccountsReceivable = async (startDate?: string, endDate?: string) => {
  let url = environment.accountsReceivable;
  
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  
  return await requestGet(url);
};

export const queryCreateAccountReceivableById = async (payload: any) => {
  return await requestPost(environment.accountsReceivable, payload);
};

export const queryEditAccountReceivableById = async (id: string, payload: any) => {
  return await requestPut(`${environment.accountsReceivable}/${id}`, payload);
};

export const queryDeleteAccountReceivableById = async (id: string) => {
  return await requestDelete(`${environment.accountsReceivable}/${id}`);
};

export const getClients = async () => {
  return await requestGet(environment.clients);
};

export const queryCreateClient = async (payload: any) => {
  return await requestPost(environment.clients, payload);
};

// Payment services for accounts receivable
export const getAccountReceivablePayments = async (accountsReceivableId: string) => {
  return await requestGet(`${environment.accountsReceivablePayments}/by-accounts-receivable/${accountsReceivableId}`);
};

export const queryCreateAccountReceivablePayment = async (payload: any) => {
  return await requestPost(`${environment.accountsReceivablePayments}`, payload);
};

export const queryEditAccountReceivablePayment = async (id: string, payload: any) => {
  return await requestPut(`${environment.accountsReceivablePayments}/${id}`, payload);
};

export const queryDeleteAccountReceivablePayment = async (id: string) => {
  return await requestDelete(`${environment.accountsReceivablePayments}/${id}`);
};
