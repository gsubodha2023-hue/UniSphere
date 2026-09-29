import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
  getTaskStatsApi,
} from "../../api/taskApi";

const initialState = {
  items: [],
  stats: null,
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchAll",
  async (params, thunkAPI) => {
    try {
      const res = await getTasksApi(params);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchTaskStats = createAsyncThunk(
  "tasks/fetchStats",
  async (_, thunkAPI) => {
    try {
      const res = await getTaskStatsApi();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const addTask = createAsyncThunk(
  "tasks/add",
  async (data, thunkAPI) => {
    try {
      const res = await createTaskApi(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const editTask = createAsyncThunk(
  "tasks/edit",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateTaskApi(id, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const removeTask = createAsyncThunk(
  "tasks/remove",
  async (id, thunkAPI) => {
    try {
      await deleteTaskApi(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTaskStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
