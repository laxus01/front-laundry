import { environment } from "../../../env";
import { requestGet } from "../../../services/axios/axios.services";


export const getServices = async () => {
    return await requestGet(environment.services);
}

export const getProducts = async () => {
    return await requestGet(environment.products);
}

export const getAttentions = async () => {
    return await requestGet(environment.attentions);
}