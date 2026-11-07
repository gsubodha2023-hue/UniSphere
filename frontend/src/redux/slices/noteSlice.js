import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getNotesApi,
  createNoteApi,
  updateNoteApi,
  deleteNoteApi,
} from "../../api/noteApi";

const initialState = { items: [], loading: false, error: null };

export const fetchNotes = createAsyncThunk(
  "notes/fetchAll",
  async (params, thunkAPI) => {
    try {
      const res = await getNotesApi(params);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const addNote = createAsyncThunk(
  "notes/add",
  async (data, thunkAPI) => {
    try {
      const res = await createNoteApi(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const editNote = createAsyncThunk(
  "notes/edit",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await updateNoteApi(id, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

export const removeNote = createAsyncThunk(
  "notes/remove",
  async (id, thunkAPI) => {
    try {
      await deleteNoteApi(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editNote.fulfilled, (state, action) => {
        const idx = state.items.findIndex((n) => n._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeNote.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n._id !== action.payload);
      });
  },
});

export default noteSlice.reducer;
