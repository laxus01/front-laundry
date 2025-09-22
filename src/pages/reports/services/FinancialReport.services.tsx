import { environment } from "../../../env";
import { requestGet } from "../../../services/axios/axios.services";

export const getFinancialReport = async (startDate: string, endDate: string) => {
  return await requestGet(`${environment.reports}/financial?startDate=${startDate}&endDate=${endDate}`);
};
