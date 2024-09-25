import axios from "axios";

const getHeaders = () => {
  const token: string = window.localStorage.getItem("Authorization") || "";
  const headers: { Authorization: string } = {
    Authorization: "",
  };

  if (token != "") {
    headers.Authorization = "Bearer " + token;
  } 
  return headers;
};


export const requestGet = async (url: string, params: any = {}) => {
  try {
    const headers = getHeaders();
    const res = await axios.get(url, { headers, params });
    return res;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const requestPost = async (url: string, data: any) => {
  try {
    const headers = getHeaders();
    const res = await axios.post(url, data, { headers });
    return res;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const requestPut = async (url: string, data: any) => {
  try {
    const headers = getHeaders();
    const res = await axios.put(url, data, { headers });
    return res;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

