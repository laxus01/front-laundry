import { environment } from "../../../env";
import { requestGet } from "../../../services/axios/axios.services";

export const getParkingsByDateRange = async (startDate: string, endDate: string) => {
  return await requestGet(`${environment.parkings}/date-range/search?startDate=${startDate}&endDate=${endDate}`);
};
