import { environment } from "../../../env";
import {
    requestDelete,
    requestGet,
    requestPost,
    requestPut,
} from "../../../services/axios/axios.services";

export const getServices = async () => {
    return await requestGet(environment.services);
};

export const queryCreateService = async (payload: any) => {
    return await requestPost(environment.services, payload);
};

export const queryEditServiceById = async (id: string, payload: any) => {
    return await requestPut(`${environment.services}/${id}`, payload);
};

export const queryDeleteServiceById = async (id: string) => {
    return await requestDelete(`${environment.services}/${id}`);
};