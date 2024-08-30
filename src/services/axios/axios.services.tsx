import axios from "axios";
import { Token } from "../token/token.services";

const CancelToken = axios.CancelToken;
let cancel: (() => void) | undefined;

const headers: any = {
  authorization: "Bearer " + Token(),
};

// Function to make a GET request
export const get = async (url: string, params?: any) => {
  try {
    const response = await axios.get(url, {
      params,
      headers,
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      }),
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      console.log("Error", (error as any).message);
    }
    throw error;
  }
};

// Function to make a POST request
export const post = async (url: string, data?: any) => {
  try {
    const response = await axios.post(url, data, {
      headers,
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      }),
    });
    return response.data;
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      console.log("Error", error.message);
    }
    throw error;
  }
};

// Function to cancel the ongoing request
export const cancelRequest = () => {
  if (cancel) {
    cancel();
  }
};