import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: { items: [] },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift({ id: Date.now(), read: false, ...action.payload });
    },
    markAllRead: (state) => {
      state.items.forEach((n) => (n.read = true));
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, markAllRead, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
