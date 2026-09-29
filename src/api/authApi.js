import axiosClient from "./axiosClient";

export const registerApi = (data) => axiosClient.post("/auth/register", data);
export const loginApi = (data) => axiosClient.post("/auth/login", data);
export const getProfileApi = () => axiosClient.get("/users/profile");
export const updateProfileApi = (data) => axiosClient.put("/users/profile", data);
