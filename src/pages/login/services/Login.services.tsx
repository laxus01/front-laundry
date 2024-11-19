import { environment } from "../../../env";
import { requestPost } from "../../../services/axios/axios.services";

export const login = async (data: any) => {
  return await requestPost(environment.auth, data);
};
