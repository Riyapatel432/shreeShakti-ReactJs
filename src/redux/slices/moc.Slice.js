import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../baseUrl";

// ================= API =================
const API = `${V_URL}/moc/manage-moc-details`;
const GET_API = `${V_URL}/moc/get-moc-details`;
const UPDATE_API = `${V_URL}/moc/update-moc-details`;
const DELETE_API = `${V_URL}/moc/delete-moc-details`;

// ================= GET mocs =================

export const fetchMoc = createAsyncThunk(
  "mocs/fetchMoc",
  async ({ page, limit, search = "" ,status} = {}) => {
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

// ================= CREATE mocs =================
export const addMoc = createAsyncThunk(
  "mocs/addMoc",
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

// ================= UPDATE mocs =================
export const updateMoc = createAsyncThunk(
  "mocs/updateMoc",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.put(`${UPDATE_API}/${id}`, data, { withCredentials: true });

      dispatch(fetchMoc());
      return res.data;

    } 
    catch (err) {
  return rejectWithValue(err.response?.data);
}
  }
);

// ================= DELETE mocs =================
export const deleteMoc = createAsyncThunk(
  "mocs/deleteMoc",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.delete(`${DELETE_API}/${id}`, {
        withCredentials: true
      });

      dispatch(fetchMoc());
      return res.data;

    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Delete failed",
      });
    }
  }
);

// ================= SLICE =================
const mocSlice = createSlice({
  name: "mocs",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchMoc.pending, (state) => {
        state.loading = true;
      })
   .addCase(fetchMoc.fulfilled, (state, action) => {
  state.loading = false;
  state.data = action.payload.data;

  state.pagination = {
    currentPage: action.payload.pagination.currentPage,
    totalPages: action.payload.pagination.totalPages,
    totalRecords: action.payload.pagination.totalRecords,
    limit: action.payload.pagination.limit,
  };
})
      .addCase(fetchMoc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD
      .addCase(addMoc.fulfilled, (state) => {
        state.loading = false;
      })

      // UPDATE
      .addCase(updateMoc.fulfilled, (state) => {
        state.loading = false;
      })

      // DELETE
      .addCase(deleteMoc.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default mocSlice.reducer;