import { environment } from "../../../env";
import {
  requestDelete,
  requestGet,
  requestPost,
  requestPut,
} from "../../../services/axios/axios.services";

export const getExpenses = async () => {
  return await requestGet(environment.expenses);
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
