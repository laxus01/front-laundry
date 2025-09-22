import { environment } from "../../../env";
import {
  requestDelete,
  requestGet,
  requestPost,
  requestPut,
} from "../../../services/axios/axios.services";

export const getSales = async (startDate?: string, endDate?: string) => {
  let url = environment.sales;
  
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  
  return await requestGet(url);
};

export const queryCreateSale = async (payload: any) => {
  return await requestPost(environment.sales, payload);
};

export const queryEditSaleById = async (id: string, payload: any) => {
  return await requestPut(`${environment.sales}/${id}`, payload);
};

export const queryDeleteSaleById = async (id: string) => {
  return await requestDelete(`${environment.sales}/${id}`);
};