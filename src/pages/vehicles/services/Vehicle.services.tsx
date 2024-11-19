import { environment } from "../../../env";
import {
  requestDelete,
  requestGet,
  requestPost,
  requestPut,
} from "../../../services/axios/axios.services";

export const getVehicles = async () => {
  return await requestGet(environment.vehicles);
};

export const queryCreateVehicleById = async (payload: any) => {
  return await requestPost(environment.vehicles, payload);
};

export const queryEditVehicleById = async (id: string, payload: any) => {
  return await requestPut(`${environment.vehicles}/${id}`, payload);
};

export const queryDeleteVehicleById = async (id: string) => {
  return await requestDelete(`${environment.vehicles}/${id}`);
};
