import axios from "axios";
import { camelCase } from "lodash";

function deepSnakeToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(deepSnakeToCamel);
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        camelCase(key),
        deepSnakeToCamel(value),
      ])
    );
  }
  return obj;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    response.data = deepSnakeToCamel(response.data);
    return response.data;
  },
  (error) => Promise.reject(error)
);
