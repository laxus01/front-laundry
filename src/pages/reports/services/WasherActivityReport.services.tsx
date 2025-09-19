import { environment } from "../../../env";
import { requestGet } from "../../../services/axios/axios.services";

export const getWasherActivityReport = async (startDate: string, endDate: string, washerId: string) => {
  return await requestGet(`${environment.reports}/washer-activity?startDate=${startDate}&endDate=${endDate}&washerId=${washerId}`);
};
