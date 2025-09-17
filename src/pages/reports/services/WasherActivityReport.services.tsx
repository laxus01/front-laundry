import { environment } from "../../../env";
import { requestGet } from "../../../services/axios/axios.services";

export const getWasherActivityReport = async (date: string, washerId: string) => {
  return await requestGet(`${environment.reports}/washer-activity?date=${date}&washerId=${washerId}`);
};
