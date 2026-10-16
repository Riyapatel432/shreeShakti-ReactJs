import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../baseUrl";

// ================= API =================
const API = `${V_URL}/user/manage-user-details`;
const GET_API = `${V_URL}/user/get-user-details`;
const UPDATE_API = `${V_URL}/user/update-user-details`;
const DELETE_API = `${V_URL}/user/delete-user-details`;

// ================= GET USERS =================

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
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

// ================= CREATE USER =================
export const addUser = createAsyncThunk(
  "users/addUser",
  async (form, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post(API, form, {
        withCredentials: true
      });

      return res.data;

    } catch (err) {
      const msg = err.response?.data?.message;
      let field = err.response?.data?.field || null;

      return rejectWithValue({
        field,
        message: msg || "Something went wrong",
      });
    }
  }
);

// ================= UPDATE USER =================
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.put(`${UPDATE_API}/${id}`, data, { withCredentials: true });

      dispatch(fetchUsers());
      return res.data;

    } catch (err) {
      const data = err.response?.data;
      const msg = data?.message;
      let field = data?.field || null;

      return rejectWithValue({
        field,
        message: msg || "Something went wrong",
      });
    }
  }
);

// ================= DELETE USER =================
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.delete(`${DELETE_API}/${id}`, {
        withCredentials: true
      });

      dispatch(fetchUsers());
      return res.data;

    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Delete failed",
      });
    }
  }
);

// ================= SLICE =================
const userSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalRecords: 0,
      limit: 10
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.pagination = {
          currentPage: action.payload.pagination.currentPage,
          totalPages: action.payload.pagination.totalPages,
          totalRecords: action.payload.pagination.totalRecords,
          limit: action.payload.pagination.limit,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // ADD
      .addCase(addUser.fulfilled, (state) => {
        state.loading = false;
      })
      // UPDATE
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
      })
      // DELETE
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
