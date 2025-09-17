import { environment } from "../../../env";
import {
  requestDelete,
  requestGet,
  requestPost,
  requestPut,
} from "../../../services/axios/axios.services";

export const getShopping = async () => {
  return await requestGet(environment.shopping);
};

export const queryCreateShopping = async (payload: any) => {
  return await requestPost(environment.shopping, payload);
};

export const queryEditShoppingById = async (id: string, payload: any) => {
  return await requestPut(`${environment.shopping}/${id}`, payload);
};

export const queryDeleteShoppingById = async (id: string) => {
  return await requestDelete(`${environment.shopping}/${id}`);
};
