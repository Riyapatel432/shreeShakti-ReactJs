import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../../baseUrl";

const BASE_API = `${V_URL}/costingSheet`;
const GET_API = `${V_URL}/costingSheet/get-costing-sheet-details`;
const DELETE_API = `${V_URL}/costingSheet/delete-costing-sheet-details`;

export const fetchCostingSheet = createAsyncThunk(
  "costingSheets/fetchCostingSheet",
  async ({ page, limit, search = "" } = {}) => {
    const res = await axios.get(
      `${GET_API}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
      { withCredentials: true }
    );
    return res.data;
  }
);

export const addCostingSheet = createAsyncThunk(
  "costingSheets/addCostingSheet",
  async (form, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_API}/`, form, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateCostingSheetHeader = createAsyncThunk(
  "costingSheets/updateCostingSheetHeader",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_API}/${id}`, data, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateLineItems = createAsyncThunk(
  "costingSheets/updateLineItems",
  async ({ id, line_items }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_API}/${id}/line-items`, { line_items }, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateRollup = createAsyncThunk(
  "costingSheets/updateRollup",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_API}/${id}/rollup`, data, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const deleteCostingSheet = createAsyncThunk(
  "costingSheets/deleteCostingSheet",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${DELETE_API}/${id}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue({ message: err.response?.data?.message || "Delete failed" });
    }
  }
);

const costingSheetSlice = createSlice({
  name: "costingSheets",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCostingSheet.pending, (state) => { state.loading = true; })
      .addCase(fetchCostingSheet.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.pagination = {
          currentPage: action.payload.pagination.currentPage,
          totalPages: action.payload.pagination.totalPages,
          totalRecords: action.payload.pagination.totalRecords,
          limit: action.payload.pagination.limit,
        };
      })
      .addCase(fetchCostingSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCostingSheet.fulfilled, (state) => { state.loading = false; })
      .addCase(updateCostingSheetHeader.fulfilled, (state) => { state.loading = false; })
      .addCase(updateLineItems.fulfilled, (state) => { state.loading = false; })
      .addCase(updateRollup.fulfilled, (state) => { state.loading = false; })
      .addCase(deleteCostingSheet.fulfilled, (state) => { state.loading = false; });
  },
});

export default costingSheetSlice.reducer;