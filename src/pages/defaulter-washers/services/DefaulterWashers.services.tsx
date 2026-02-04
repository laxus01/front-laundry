import { requestDelete, requestGet, requestPost, requestPut } from "../../../services/axios/axios.services";
import { environment } from "../../../env";

export const getDefaulterWashers = async (startDate?: string, endDate?: string) => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const queryString = params.toString();
  const url = queryString 
    ? `${environment.defaulterWashers}?${queryString}`
    : environment.defaulterWashers;
  
  return await requestGet(url);
};

export const getDefaulterWasherById = async (id: string) => {
  return await requestGet(`${environment.defaulterWashers}/${id}`);
};

export const queryCreateDefaulterWasher = async (data: any) => {
  return await requestPost(environment.defaulterWashers, data);
};

export const queryEditDefaulterWasherById = async (id: string, data: any) => {
  return await requestPut(`${environment.defaulterWashers}/${id}`, data);
};

export const queryDeleteDefaulterWasherById = async (id: string) => {
  return await requestDelete(`${environment.defaulterWashers}/${id}`);
};

export const queryMarkAsPaid = async (id: string) => {
  return await requestPut(`${environment.defaulterWashers}/${id}/mark-as-paid`, {});
};
