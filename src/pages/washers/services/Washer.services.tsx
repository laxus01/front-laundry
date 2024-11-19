import { environment } from "../../../env";
import {
  requestDelete,
  requestGet,
  requestPost,
  requestPut,
} from "../../../services/axios/axios.services";

export const getWashers = async () => {
  return await requestGet(environment.washers);
};

export const queryCreateWasherById = async (payload: any) => {
  return await requestPost(environment.washers, payload);
};

export const queryEditWasherById = async (id: string, payload: any) => {
  return await requestPut(`${environment.washers}/${id}`, payload);
};

export const queryDeleteWasherById = async (id: string) => {
  return await requestDelete(`${environment.washers}/${id}`);
};
