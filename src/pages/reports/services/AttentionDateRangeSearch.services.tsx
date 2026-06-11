import { environment } from "../../../env";
import { requestGet, requestDelete, requestPut } from "../../../services/axios/axios.services";

export const getAttentionsByDateRange = async (startDate: string, endDate: string) => {
  return await requestGet(`${environment.attentions}/date-range/search?startDate=${startDate}&endDate=${endDate}`);
};

export const getAttentionsByVehicle = async (plateId: string) => {
  return await requestGet(`${environment.attentions}/vehicle/${plateId}`);
};

export const deleteAttention = async (id: string) => {
  return await requestDelete(`${environment.attentions}/${id}`);
};

export const updateAttention = async (id: string, data: any) => {
  return await requestPut(`${environment.attentions}/${id}`, data);
};
