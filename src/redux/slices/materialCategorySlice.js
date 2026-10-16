import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../baseUrl";

export const getMaterialCategories = createAsyncThunk(
  "materialCategory/getMaterialCategories",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${V_URL}/material-category/get-material-category-details?page=${page}&limit=${limit}&search=${search}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch material categories"
      );
    }
  }
);

export const createMaterialCategory = createAsyncThunk(
  "materialCategory/createMaterialCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${V_URL}/material-category/manage-material-category-details`,
        categoryData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create category"
      );
    }
  }
);

export const updateMaterialCategory = createAsyncThunk(
  "materialCategory/updateMaterialCategory",
  async ({ id, ...categoryData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${V_URL}/material-category/update-material-category-details/${id}`,
        categoryData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update category"
      );
    }
  }
);

export const deleteMaterialCategory = createAsyncThunk(
  "materialCategory/deleteMaterialCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${V_URL}/material-category/delete-material-category-details/${id}`,
        { withCredentials: true }
      );
      return { ...response.data, id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  }
);

const initialState = {
  categories: [],
  pagination: {
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  },
  loading: false,
  error: null,
};

const materialCategorySlice = createSlice({
  name: "materialCategory",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMaterialCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMaterialCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getMaterialCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMaterialCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMaterialCategory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createMaterialCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMaterialCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMaterialCategory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateMaterialCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMaterialCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMaterialCategory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteMaterialCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = materialCategorySlice.actions;
export default materialCategorySlice.reducer;
