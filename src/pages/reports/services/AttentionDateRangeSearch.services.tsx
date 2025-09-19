import { environment } from "../../../env";
import { requestGet } from "../../../services/axios/axios.services";

export const getAttentionsByDateRange = async (startDate: string, endDate: string) => {
  return await requestGet(`${environment.attentions}/date-range/search?startDate=${startDate}&endDate=${endDate}`);
};

export const getAttentionsByVehicle = async (plateId: string) => {
  return await requestGet(`${environment.attentions}/vehicle/${plateId}`);
};
