import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../baseUrl";

// ================= API =================
const API = `${V_URL}/quotation/manage-quotation-details`;
const GET_API = `${V_URL}/quotation/get-quotation-details`;
const UPDATE_API = `${V_URL}/quotation/update-quotation-details`;
const DELETE_API = `${V_URL}/quotation/delete-quotation-details`;
const EXPORT_API = `${V_URL}/quotation/export-pdf`;

// ================= GET Quotations =================

export const fetchQuotation = createAsyncThunk(
  "Quotations/fetchQuotation",
  async ({ page = 1, limit = 10, search = "", clientId = "" } = {}) => {
    let url = `${GET_API}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
    if (clientId) {
      url += `&clientId=${clientId}`;
    }
    const res = await axios.get(url, {
      withCredentials: true,
    });

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
      const data = err.response?.data;
      const msg = data?.error ? `${data.message}: ${data.error}` : (data?.message || "Something went wrong");

      return rejectWithValue({
        message: msg,
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

// ================= EXPORT Quotations PDF =================
export const exportQuotation = createAsyncThunk(
  "Quotations/exportQuotation",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${EXPORT_API}/${id}`, {
        responseType: 'blob', // Important for file download
        withCredentials: true
      });
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Quotation_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      return true;
    } catch (err) {
      return rejectWithValue({
        message: "PDF export failed",
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