import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../baseUrl";

// ================= API =================
const API = `${V_URL}/client/manage-client-details`;
const GET_API = `${V_URL}/client/get-client-details`;
const UPDATE_API = `${V_URL}/client/update-client-details`;
const DELETE_API = `${V_URL}/client/delete-client-details`;

// ================= GET CLIENTS =================

export const fetchClients = createAsyncThunk(
  "clients/fetchClients",
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

// ================= CREATE CLIENT =================
export const addClient = createAsyncThunk(
  "clients/addClient",
  async (form, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post(API, form, {
        withCredentials: true
      });

      return res.data;

    } catch (err) {
      const msg = err.response?.data?.message;

      let field = null;

      if (msg?.toLowerCase().includes("email")) field = "email";
      else if (msg?.toLowerCase().includes("gst")) field = "gst_no";
      else if (msg?.toLowerCase().includes("company")) field = "company_name";
      else if (msg?.toLowerCase().includes("phone")) field = "phone";

      return rejectWithValue({
        field,
        message: msg || "Something went wrong",
      });
    }
  }
);

// ================= UPDATE CLIENT =================
export const updateClient = createAsyncThunk(
  "clients/updateClient",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.put(`${UPDATE_API}/${id}`, data, { withCredentials: true });

      dispatch(fetchClients());
      return res.data;

    } catch (err) {
      const data = err.response?.data;
      const msg = data?.message;
      
      // Use field from backend if available, otherwise guess from message
      let field = data?.field || null;

      if (!field && msg) {
        if (msg.toLowerCase().includes("email")) field = "email";
        else if (msg.toLowerCase().includes("gst")) field = "gst_no";
        else if (msg.toLowerCase().includes("company")) field = "company_name";
        else if (msg.toLowerCase().includes("phone")) field = "phone";
      }

      return rejectWithValue({
        field,
        message: msg || "Something went wrong",
      });
    }
  }
);

// ================= DELETE CLIENT =================
export const deleteClient = createAsyncThunk(
  "clients/deleteClient",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.delete(`${DELETE_API}/${id}`, {
        withCredentials: true
      });

      dispatch(fetchClients());
      return res.data;

    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Delete failed",
      });
    }
  }
);

// ================= SLICE =================
const clientSlice = createSlice({
  name: "clients",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
      })
   .addCase(fetchClients.fulfilled, (state, action) => {
  state.loading = false;
  state.data = action.payload.data;

  state.pagination = {
    currentPage: action.payload.pagination.currentPage,
    totalPages: action.payload.pagination.totalPages,
    totalRecords: action.payload.pagination.totalRecords,
    limit: action.payload.pagination.limit,
  };
})
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD
      .addCase(addClient.fulfilled, (state) => {
        state.loading = false;
      })

      // UPDATE
      .addCase(updateClient.fulfilled, (state) => {
        state.loading = false;
      })

      // DELETE
      .addCase(deleteClient.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default clientSlice.reducer;