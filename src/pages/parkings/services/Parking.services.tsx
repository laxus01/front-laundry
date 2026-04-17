import { BASE_URL, environment } from "../../../env";
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

export interface SearchParkingsParams {
  page?: number;
  limit?: number;
  paymentStatus?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  vehicleId?: string;
  state?: number;
  dateInitialFrom?: string;
  dateInitialTo?: string;
  dateFinalFrom?: string;
  dateFinalTo?: string;
  creationDateFrom?: string;
  creationDateTo?: string;
}

export interface PaginatedParkingsResponse {
  items: any[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export const searchParkings = async (params: SearchParkingsParams) => {
  const queryParams = new URLSearchParams();
  
  // Add all params dynamically
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });
  
  const url = `${environment.parkings}/search?${queryParams.toString()}`;
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
  return await requestGet(`${BASE_URL}/parking-payments`, { parkingId });
};

export const queryCreatePayment = async (payload: any) => {
  return await requestPost(`${BASE_URL}/parking-payments`, payload);
};

export const queryEditPayment = async (id: string, payload: any) => {
  return await requestPut(`${BASE_URL}/parking-payments/${id}`, payload);
};

export const queryDeletePayment = async (id: string) => {
  return await requestDelete(`${BASE_URL}/parking-payments/${id}`);
};
