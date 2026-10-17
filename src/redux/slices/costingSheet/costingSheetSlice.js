import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../../baseUrl";

// ================= API =================
const API = `${V_URL}/costingSheet/manage-costing-sheet-details`;
const GET_API = `${V_URL}/costingSheet/get-costing-sheet-details`;
const UPDATE_API = `${V_URL}/costingSheet/update-costing-sheet-details`;
const DELETE_API = `${V_URL}/costingSheet/delete-costing-sheet-details`;

// ================= GET costingSheetS =================

export const fetchCostingSheet = createAsyncThunk(
  "costingSheets/fetchCostingSheet",
  async ({ page, limit, search = "" } = {}) => {
    const res = await axios.get(
      `${GET_API}?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search
      )}`,
      {
        withCredentials: true,
      }
    );

    return res.data;
  }
);

// ================= CREATE costingSheet =================
export const addCostingSheet = createAsyncThunk(
  "costingSheets/addCostingSheet",
  async (form, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post(API, form, {
        withCredentials: true
      });

      return res.data;

    } 
 catch (err) {
  return rejectWithValue(err.response?.data);
}
  }
);

// ================= UPDATE costingSheet =================
export const updateCostingSheet = createAsyncThunk(
  "costingSheets/updateCostingSheet",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${UPDATE_API}/${id}`, data, {
        withCredentials: true,
      });

      return res.data;
    } 
   catch (err) {
  return rejectWithValue(err.response?.data);
}
  }
);

// ================= DELETE costingSheet =================
export const deleteCostingSheet = createAsyncThunk(
  "costingSheets/deleteCostingSheet",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${DELETE_API}/${id}`, {
        withCredentials: true,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Delete failed",
      });
    }
  }
);

// ================= SLICE =================
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

      // FETCH
      .addCase(fetchCostingSheet.pending, (state) => {
        state.loading = true;
      })
    .addCase(fetchCostingSheet.fulfilled, (state, action) => {
      state.loading = false;
      state.data = Array.isArray(action.payload?.data)
        ? action.payload.data
        : Array.isArray(action.payload)
        ? action.payload
        : [];

      if (action.payload?.pagination) {
        state.pagination = {
          currentPage: action.payload.pagination.currentPage || 1,
          totalPages: action.payload.pagination.totalPages || 1,
          totalRecords: action.payload.pagination.totalRecords || 0,
          limit: action.payload.pagination.limit || 10,
        };
      }
    })
      .addCase(fetchCostingSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD
      .addCase(addCostingSheet.fulfilled, (state) => {
        state.loading = false;
      })

      // UPDATE
      .addCase(updateCostingSheet.fulfilled, (state) => {
        state.loading = false;
      })

      // DELETE
      .addCase(deleteCostingSheet.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default costingSheetSlice.reducer;