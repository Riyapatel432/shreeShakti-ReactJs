import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../baseUrl";

export const getMaterials = createAsyncThunk(
  "material/getMaterials",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${V_URL}/material/get-material-details?page=${page}&limit=${limit}&search=${search}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch materials"
      );
    }
  }
);

export const getLowStockMaterials = createAsyncThunk(
  "material/getLowStockMaterials",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${V_URL}/material/low-stock`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch low stock materials"
      );
    }
  }
);

export const getMaterialLedger = createAsyncThunk(
  "material/getMaterialLedger",
  async ({ id, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${V_URL}/material/${id}/ledger?page=${page}&limit=${limit}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch ledger"
      );
    }
  }
);

export const createMaterial = createAsyncThunk(
  "material/createMaterial",
  async (materialData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${V_URL}/material/manage-material-details`,
        materialData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create material"
      );
    }
  }
);

export const updateMaterial = createAsyncThunk(
  "material/updateMaterial",
  async ({ id, ...materialData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${V_URL}/material/update-material-details/${id}`,
        materialData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update material"
      );
    }
  }
);

export const deleteMaterial = createAsyncThunk(
  "material/deleteMaterial",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${V_URL}/material/delete-material-details/${id}`,
        { withCredentials: true }
      );
      return { ...response.data, id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete material"
      );
    }
  }
);

export const recordStockMovement = createAsyncThunk(
  "material/recordStockMovement",
  async ({ id, movementData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${V_URL}/material/${id}/stock-movement`,
        movementData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to record stock movement"
      );
    }
  }
);

const initialState = {
  materials: [],
  lowStockMaterials: [],
  ledger: [],
  pagination: {
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  },
  ledgerPagination: {
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  },
  loading: false,
  error: null,
};

const materialSlice = createSlice({
  name: "material",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLedger: (state) => {
      state.ledger = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.materials = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLowStockMaterials.fulfilled, (state, action) => {
        state.lowStockMaterials = action.payload.data;
      })
      .addCase(getMaterialLedger.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMaterialLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.ledger = action.payload.data;
        state.ledgerPagination = action.payload.pagination;
      })
      .addCase(getMaterialLedger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(createMaterial.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMaterial.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMaterial.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMaterial.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(recordStockMovement.pending, (state) => {
        state.loading = true;
      })
      .addCase(recordStockMovement.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(recordStockMovement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearLedger } = materialSlice.actions;
export default materialSlice.reducer;
