import axios from "axios";
import { getToken, clearUser } from "../utils/auth";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearUser();
      window.location.href = "/login?sessionExpired=true";
    }
    return Promise.reject(error);
  }
);

export default api;