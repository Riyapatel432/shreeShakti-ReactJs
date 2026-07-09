import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../baseUrl";

// ================= API =================
const API = `${V_URL}/unit/manage-unit-details`;
const GET_API = `${V_URL}/unit/get-unit-details`;
const UPDATE_API = `${V_URL}/unit/update-unit-details`;
const DELETE_API = `${V_URL}/unit/delete-unit-details`;

// ================= GET units =================

export const fetchUnit = createAsyncThunk(
  "units/fetchUnit",
  async ({ page, limit, search = "", status } = {}) => {
    let url = `${GET_API}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;

    if (status !== undefined) {
      url += `&status=${status}`;
    }

    const res = await axios.get(url, {
      withCredentials: true,
    });

    return res.data;
  }
);

// ================= CREATE units =================
export const addUnit = createAsyncThunk(
  "units/addUnit",
  async (form, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post(API, form, {
        withCredentials: true
      });

      return res.data;

    } catch (err) {
  return rejectWithValue(err.response?.data);
}
  }
);

// ================= UPDATE units =================
export const updateUnit = createAsyncThunk(
  "units/updateUnit",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.put(`${UPDATE_API}/${id}`, data, { withCredentials: true });

      dispatch(fetchUnit());
      return res.data;

    } catch (err) {
  return rejectWithValue(err.response?.data);
}
  }
);

// ================= DELETE units =================
export const deleteUnit = createAsyncThunk(
  "units/deleteUnit",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.delete(`${DELETE_API}/${id}`, {
        withCredentials: true
      });

      dispatch(fetchUnit());
      return res.data;

    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Delete failed",
      });
    }
  }
);

// ================= SLICE =================
const unitSlice = createSlice({
  name: "units",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchUnit.pending, (state) => {
        state.loading = true;
      })
   .addCase(fetchUnit.fulfilled, (state, action) => {
  state.loading = false;
  state.data = action.payload.data;

  state.pagination = {
    currentPage: action.payload.pagination.currentPage,
    totalPages: action.payload.pagination.totalPages,
    totalRecords: action.payload.pagination.totalRecords,
    limit: action.payload.pagination.limit,
  };
})
      .addCase(fetchUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD
      .addCase(addUnit.fulfilled, (state) => {
        state.loading = false;
      })

      // UPDATE
      .addCase(updateUnit.fulfilled, (state) => {
        state.loading = false;
      })

      // DELETE
      .addCase(deleteUnit.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default unitSlice.reducer;