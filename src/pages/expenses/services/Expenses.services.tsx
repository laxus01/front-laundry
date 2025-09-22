import { environment } from "../../../env";
import {
  requestDelete,
  requestGet,
  requestPost,
  requestPut,
} from "../../../services/axios/axios.services";

export const getExpenses = async (startDate?: string, endDate?: string) => {
  let url = environment.expenses;
  
  if (startDate && endDate) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  
  return await requestGet(url);
};

export const queryCreateExpense = async (payload: any) => {
  return await requestPost(environment.expenses, payload);
};

export const queryEditExpenseById = async (id: string, payload: any) => {
  return await requestPut(`${environment.expenses}/${id}`, payload);
};

export const queryDeleteExpenseById = async (id: string) => {
  return await requestDelete(`${environment.expenses}/${id}`);
};
