import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../baseUrl";

// ================= API =================
const API = `${V_URL}/quotation/manage-quotation-details`;
const GET_API = `${V_URL}/quotation/get-quotation-details`;
const UPDATE_API = `${V_URL}/quotation/update-quotation-details`;
const DELETE_API = `${V_URL}/quotation/delete-quotation-details`;

// ================= GET Quotations =================

export const fetchQuotation = createAsyncThunk(
  "Quotations/fetchQuotation",
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

// ================= CREATE Quotations =================
export const addQuotation = createAsyncThunk(
  "Quotations/addQuotation",
  async (form, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post(API, form, {
        withCredentials: true
      });

      return res.data;

    } catch (err) {
      const msg = err.response?.data?.message;


      return rejectWithValue({
        field,
        message: msg || "Something went wrong",
      });
    }
  }
);

// ================= UPDATE Quotations =================
export const updateQuotation = createAsyncThunk(
  "Quotations/updateQuotation",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.put(`${UPDATE_API}/${id}`, data, { withCredentials: true });

      dispatch(fetchQuotation());
      return res.data;

    } catch (err) {
      const data = err.response?.data;
      const msg = data?.message;
      
   

      return rejectWithValue({
        field,
        message: msg || "Something went wrong",
      });
    }
  }
);

// ================= DELETE Quotations =================
export const deleteQuotation = createAsyncThunk(
  "Quotations/deleteQuotation",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.delete(`${DELETE_API}/${id}`, {
        withCredentials: true
      });

      dispatch(fetchQuotation());
      return res.data;

    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Delete failed",
      });
    }
  }
);

// ================= SLICE =================
const QuotationSlice = createSlice({
  name: "Quotations",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchQuotation.pending, (state) => {
        state.loading = true;
      })
   .addCase(fetchQuotation.fulfilled, (state, action) => {
  state.loading = false;
  state.data = action.payload.data;

  state.pagination = {
    currentPage: action.payload.pagination.currentPage,
    totalPages: action.payload.pagination.totalPages,
    totalRecords: action.payload.pagination.totalRecords,
    limit: action.payload.pagination.limit,
  };
})
      .addCase(fetchQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD
      .addCase(addQuotation.fulfilled, (state) => {
        state.loading = false;
      })

      // UPDATE
      .addCase(updateQuotation.fulfilled, (state) => {
        state.loading = false;
      })

      // DELETE
      .addCase(deleteQuotation.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default QuotationSlice.reducer;