import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../baseUrl";

// ================= API =================
const API = `${V_URL}/product-category/manage-product-category-details`;
const GET_API = `${V_URL}/product-category/get-product-category-details`;
const UPDATE_API = `${V_URL}/product-category/update-product-category-details`;
const DELETE_API = `${V_URL}/product-category/delete-product-category-details`;

// ================= GET product-categoryS =================

export const fetchProductCategory = createAsyncThunk(
  "productCategories/fetchProductCategory",
  async ({ page, limit, search = "",status } = {}) => {

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


export const addProductCategory = createAsyncThunk(
  "product-categorys/addProductCategory",
  async (form, { rejectWithValue }) => {
    try {
      const res = await axios.post(API, form, {
        withCredentials: true,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ================= UPDATE product-category =================

export const updateProductCategory = createAsyncThunk(
  "product-categorys/updateProductCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${UPDATE_API}/${id}`, data, {
        withCredentials: true,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);
// ================= DELETE product-category =================
export const deleteProductCategory = createAsyncThunk(
  "product-categorys/deleteProductCategory",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.delete(`${DELETE_API}/${id}`, {
        withCredentials: true
      });

      dispatch(fetchProductCategory());
      return res.data;

    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Delete failed",
      });
    }
  }
);

// ================= SLICE =================
const productCategorySlice = createSlice({
  name: "productCategories",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchProductCategory.pending, (state) => {
        state.loading = true;
      })
   .addCase(fetchProductCategory.fulfilled, (state, action) => {
  state.loading = false;
  state.data = action.payload.data;

  state.pagination = {
    currentPage: action.payload.pagination.currentPage,
    totalPages: action.payload.pagination.totalPages,
    totalRecords: action.payload.pagination.totalRecords,
    limit: action.payload.pagination.limit,
  };
})
      .addCase(fetchProductCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ADD
      .addCase(addProductCategory.fulfilled, (state) => {
        state.loading = false;
      })

      // UPDATE
      .addCase(updateProductCategory.fulfilled, (state) => {
        state.loading = false;
      })

      // DELETE
      .addCase(deleteProductCategory.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default productCategorySlice.reducer;