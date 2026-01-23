import axios from "axios";
const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
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
