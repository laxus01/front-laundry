/* eslint-disable @typescript-eslint/no-explicit-any */
// import { NotificationApp } from "@/common/notification-app";
import axios from "axios";

const URLV = process.env.VITE_API;
axios.defaults.baseURL = URLV;

axios.interceptors.request.use(
  (config) => {
    const tokenApp = localStorage.getItem("token_app");
    if (tokenApp) {
      config.headers.Authorization = `Bearer ${tokenApp}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const httpClient = {
  get: (url: any, params: any) => Promise.resolve(axios.get(url, params)),
  post: (url: any, body: any) => axios.post(url, body),
  put: (url: any, body: any) => axios.put(url, body),
  delete: (url: any, body: any) => axios.delete(url, body),
};

const errorHandler = (err: { response: { status: number } }) => {
  if (
    err?.response?.status !== 403 &&
    err?.response?.status !== 401 &&
    err?.response?.status !== 400
  ) {
    // const message =
    //   "Estimado usuario en este momento, no es posible completar la acción, por favor intentarlo más tarde";
    // NotificationApp.show(message, "error");
  } else {
    return err;
  }
};

export function getFromApi(url: string, params: any = {}) {
  return httpClient
    .get(url, { params })
    .then((response) => response?.data)
    .catch(errorHandler);
}

export function postToApi(url: any, payload: any) {
  return httpClient
    .post(url, payload)
    .then((response) => response.data)
    .catch(errorHandler);
}

export function putToApi(url: any, payload: any) {
  return httpClient
    .put(url, payload)
    .then((response) => response.data)
    .catch((err) => {
      errorHandler(err);
      return err.response;
    });
}

export function putToApiUrl(url: any, payload: any) {
  return httpClient
    .put(url, payload)
    .then((response) => response.data)
    .catch(errorHandler);
}

export function deleteToApi(url: any, payload: any) {
  return httpClient
    .delete(url, payload)
    .then((response) => response.data)
    .catch((err) => {
      errorHandler(err);
      return err.response;
    });
}

export function getDocumentToApi(url: string, params: any, type = "pdf") {
  return httpClient
    .get(url, { params, responseType: "arraybuffer" })
    .then(({ data }) => {
      if (data.byteLength === 0) {
        return "empty";
      }
      const typeApp = type === "pdf" ? "application/pdf" : "application/zip";
      const blob = new Blob([data], { type: typeApp });
      const urlDocument = URL.createObjectURL(blob);
      return urlDocument;
    })
    .catch(errorHandler);
}

export async function sendFileGcp(
  url: string,
  fileSend: File,
  method: string = "PUT"
) {
  const formData = new FormData();
  formData.append("file", fileSend);
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": fileSend.type,
      Accept: "*/*",
    },
    body: formData,
  });

  if (!response.ok) {
    errorHandler({ response });
  }
  return response.ok;
}
