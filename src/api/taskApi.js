import axiosClient from "./axiosClient";

export const getTasksApi = (params) => axiosClient.get("/tasks", { params });
export const getTaskStatsApi = () => axiosClient.get("/tasks/stats/summary");
export const createTaskApi = (data) => axiosClient.post("/tasks", data);
export const updateTaskApi = (id, data) => axiosClient.put(`/tasks/${id}`, data);
export const deleteTaskApi = (id) => axiosClient.delete(`/tasks/${id}`);
