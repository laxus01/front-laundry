import { environment } from "../../../env";
import {
  requestDelete,
  requestGet,
  requestPost,
  requestPut,
} from "../../../services/axios/axios.services";

export const getProducts = async () => {
  return await requestGet(environment.products);
};

export const queryCreateProduct = async (payload: any) => {
  return await requestPost(environment.products, payload);
};

export const queryEditProductById = async (id: string, payload: any) => {
  return await requestPut(`${environment.products}/${id}`, payload);
};

export const queryDeleteProductById = async (id: string) => {
  return await requestDelete(`${environment.products}/${id}`);
};
