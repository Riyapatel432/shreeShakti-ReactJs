import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { V_URL } from '../../baseUrl';

const API_URL = `${V_URL}/tech-spec`;

// Fetch all Tech Specs
export const fetchTechSpecs = createAsyncThunk(
  'techSpecs/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const config = { params, withCredentials: true };
      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Get Tech Spec by ID
export const getTechSpecById = createAsyncThunk(
  'techSpecs/getById',
  async (id, { rejectWithValue }) => {
    try {
      const config = { withCredentials: true };
      const response = await axios.get(`${API_URL}/${id}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Generate Tech Spec from Costing Sheet
export const generateTechSpec = createAsyncThunk(
  'techSpecs/generate',
  async (costingSheetId, { rejectWithValue }) => {
    try {
      const config = { withCredentials: true };
      const response = await axios.post(`${API_URL}/generate`, { costingSheetId }, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Update Tech Spec
export const updateTechSpec = createAsyncThunk(
  'techSpecs/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const config = { withCredentials: true };
      const response = await axios.put(`${API_URL}/${id}`, data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Delete Tech Spec
export const deleteTechSpec = createAsyncThunk(
  'techSpecs/delete',
  async (id, { rejectWithValue }) => {
    try {
      const config = { withCredentials: true };
      const response = await axios.delete(`${API_URL}/${id}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const techSpecSlice = createSlice({
  name: 'techSpecs',
  initialState: {
    techSpecs: [],
    currentSpec: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentSpec: (state) => {
      state.currentSpec = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchTechSpecs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTechSpecs.fulfilled, (state, action) => {
        state.loading = false;
        state.techSpecs = action.payload.data;
      })
      .addCase(fetchTechSpecs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch technical specifications";
      })
      
      // Get By ID
      .addCase(getTechSpecById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTechSpecById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSpec = action.payload.data;
      })
      .addCase(getTechSpecById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch technical specification";
      })

      // Generate
      .addCase(generateTechSpec.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateTechSpec.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSpec = action.payload.data;
        state.techSpecs.unshift(action.payload.data);
      })
      .addCase(generateTechSpec.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to generate technical specification";
      })

      // Update
      .addCase(updateTechSpec.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTechSpec.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSpec = action.payload.data;
        const index = state.techSpecs.findIndex(ts => ts._id === action.payload.data._id);
        if (index !== -1) {
          state.techSpecs[index] = action.payload.data;
        }
      })
      .addCase(updateTechSpec.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update technical specification";
      })

      // Delete
      .addCase(deleteTechSpec.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTechSpec.fulfilled, (state, action) => {
        state.loading = false;
        state.techSpecs = state.techSpecs.filter(ts => ts._id !== action.meta.arg);
      })
      .addCase(deleteTechSpec.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete technical specification";
      });
  }
});

export const { clearCurrentSpec } = techSpecSlice.actions;
export default techSpecSlice.reducer;
