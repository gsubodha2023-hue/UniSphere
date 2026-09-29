import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

axiosClient.interceptors.request.use((config) => {
  const userStr = localStorage.getItem("unisphere_user");
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("unisphere_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
