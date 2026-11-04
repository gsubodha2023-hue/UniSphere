import axiosClient from "./axiosClient";

export const logSessionApi = (data) => axiosClient.post("/pomodoro", data);
export const getAnalyticsApi = (days) =>
  axiosClient.get("/pomodoro/analytics", { params: { days } });
