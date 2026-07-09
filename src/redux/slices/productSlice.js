import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../baseUrl";

// ================= API =================
const API = `${V_URL}/product/manage-product-details`;
const GET_API = `${V_URL}/product/get-product-details`;
const UPDATE_API = `${V_URL}/product/update-product-details`;
const DELETE_API = `${V_URL}/product/delete-product-details`;

// ================= GET product-categoryS =================

export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async ({ page, limit, search = "",status} = {}) => {
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

// ================= CREATE product-category =================
export const addProduct = createAsyncThunk(
  "products/addProduct",
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

// ================= UPDATE product-category =================
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.put(`${UPDATE_API}/${id}`, data, { withCredentials: true });

      dispatch(fetchProduct());
      return res.data;

    } 
  catch (err) {
  return rejectWithValue(err.response?.data);
}
  }
);

// ================= DELETE product-category =================
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.delete(`${DELETE_API}/${id}`, {
        withCredentials: true
      });

      dispatch(fetchProduct());
      return res.data;

    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Delete failed",
      });
    }
  }
);

// ================= SLICE =================
const productSlice = createSlice({
  name: "products",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
      })
   .addCase(fetchProduct.fulfilled, (state, action) => {
  state.loading = false;
  state.data = action.payload.data;

  state.pagination = {
    currentPage: action.payload.pagination.currentPage,
    totalPages: action.payload.pagination.totalPages,
    totalRecords: action.payload.pagination.totalRecords,
    limit: action.payload.pagination.limit,
  };
})
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD
      .addCase(addProduct.fulfilled, (state) => {
        state.loading = false;
      })

      // UPDATE
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
      })

      // DELETE
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default productSlice.reducer;