import { environment } from "../../../env";
import { requestGet, requestPut } from "../../../services/axios/axios.services";

export const getVehicles = async () => {
    return await requestGet(environment.vehicles);
};

export const queryEditVehicleById = async (id: number, dataVehicle: any) => {
    return await requestPut(`${environment.vehicles}/${id}`, dataVehicle);
};
