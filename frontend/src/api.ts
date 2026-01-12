import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Interceptor -> automatski dodaje Authorization header
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("stemtutor-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;