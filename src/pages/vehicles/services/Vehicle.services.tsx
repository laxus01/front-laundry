import { environment } from "../../../env";
import { requestGet } from "../../../services/axios/axios.services";

export const getVehicles = async () => {
    return await requestGet(environment.vehicles);
};