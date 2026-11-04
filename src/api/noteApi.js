import axiosClient from "./axiosClient";

export const getNotesApi = (params) => axiosClient.get("/notes", { params });
export const createNoteApi = (data) => axiosClient.post("/notes", data);
export const updateNoteApi = (id, data) => axiosClient.put(`/notes/${id}`, data);
export const deleteNoteApi = (id) => axiosClient.delete(`/notes/${id}`);
