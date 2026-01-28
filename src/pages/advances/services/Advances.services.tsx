import { environment } from "../../../env";
import {
    requestDelete,
    requestGet,
    requestPost,
    requestPut,
} from "../../../services/axios/axios.services";

export const getAdvances = async () => {
    return await requestGet(environment.advances);
};

export const queryCreateAdvance = async (payload: any) => {
    return await requestPost(environment.advances, payload);
};

export const queryEditAdvanceById = async (id: string, payload: any) => {
    return await requestPut(`${environment.advances}/${id}`, payload);
};

export const queryDeleteAdvanceById = async (id: string) => {
    return await requestDelete(`${environment.advances}/${id}`);
};
