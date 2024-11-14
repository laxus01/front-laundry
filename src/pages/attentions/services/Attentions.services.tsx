import { environment } from "../../../env";
import { requestGet, requestPost } from "../../../services/axios/axios.services";


export const getServices = async () => {
    return await requestGet(environment.services);
}

export const getProducts = async () => {
    return await requestGet(environment.products);
}

export const getAttentions = async () => {
    return await requestGet(environment.attentions);
}

export const saveAttention = async (attention: any) => {
    return await requestPost(environment.attentions, attention);
}

export const saveListServicesByAttention = async (payload: any) => {
    return await requestPost(`${environment.attentions}/sales/services`, payload);
}

export const saveListProductsByAttention = async (payload: any) => {
    return await requestPost(`${environment.attentions}/sales/products`, payload);
}