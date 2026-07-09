import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../baseUrl";

// ================= API =================
const API = `${V_URL}/price/manage-price-details`;
const GET_API = `${V_URL}/price/get-price-details`;
const UPDATE_API = `${V_URL}/price/update-price-details`;
const DELETE_API = `${V_URL}/price/delete-price-details`;

// ================= GET priceS =================

export const fetchPrice = createAsyncThunk(
  "prices/fetchPrice",
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

// ================= CREATE price =================
export const addPrice = createAsyncThunk(
  "prices/addPrice",
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

// ================= UPDATE price =================
export const updatePrice = createAsyncThunk(
  "prices/updatePrice",
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

// ================= DELETE price =================
export const deletePrice = createAsyncThunk(
  "prices/deletePrice",
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
const priceSlice = createSlice({
  name: "prices",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchPrice.pending, (state) => {
        state.loading = true;
      })
   .addCase(fetchPrice.fulfilled, (state, action) => {
  state.loading = false;
  state.data = action.payload.data;

  state.pagination = {
    currentPage: action.payload.pagination.currentPage,
    totalPages: action.payload.pagination.totalPages,
    totalRecords: action.payload.pagination.totalRecords,
    limit: action.payload.pagination.limit,
  };
})
      .addCase(fetchPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD
      .addCase(addPrice.fulfilled, (state) => {
        state.loading = false;
      })

      // UPDATE
      .addCase(updatePrice.fulfilled, (state) => {
        state.loading = false;
      })

      // DELETE
      .addCase(deletePrice.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default priceSlice.reducer;