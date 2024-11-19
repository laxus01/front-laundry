import { environment } from "../../../env";
import { requestGet } from "../../../services/axios/axios.services";

export const getBackup = async () => {
  return await requestGet(environment.backup);
};