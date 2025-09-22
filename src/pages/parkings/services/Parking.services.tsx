import { environment } from "../../../env";
import {
  requestDelete,
  requestGet,
  requestPost,
  requestPut,
} from "../../../services/axios/axios.services";

export const getParkings = async (startDate?: string, endDate?: string) => {
  let url = environment.parkings;
  
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  
  return await requestGet(url);
};

export const queryCreateParkingById = async (payload: any) => {
  return await requestPost(environment.parkings, payload);
};

export const getParkingTypes = async () => {
  return await requestGet(`${environment.parkings}/types`);
};

export const queryEditParkingById = async (id: string, payload: any) => {
  return await requestPut(`${environment.parkings}/${id}`, payload);
};

export const queryDeleteParkingById = async (id: string) => {
  return await requestDelete(`${environment.parkings}/${id}`);
};

export const getParkingPayments = async (parkingId: string) => {
  return await requestGet(`http://localhost:3000/parking-payments?parkingId=${parkingId}`);
};

export const queryCreatePayment = async (payload: any) => {
  return await requestPost(`http://localhost:3000/parking-payments`, payload);
};

export const queryEditPayment = async (id: string, payload: any) => {
  return await requestPut(`http://localhost:3000/parking-payments/${id}`, payload);
};

export const queryDeletePayment = async (id: string) => {
  return await requestDelete(`http://localhost:3000/parking-payments/${id}`);
};
