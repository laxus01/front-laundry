import axios from "axios";
import { Token } from "../token/token.services";

const headers: any = {
  authorization: "Bearer " + Token(),
};


export const requestGet = async (url: string, params: any = {}) => {
  try {
    const res = await axios.get(url, { headers, params });
    return res;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const requestPost = async (url: string, data: any) => {
  try {
    const res = await axios.post(url, data, { headers });
    return res;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};