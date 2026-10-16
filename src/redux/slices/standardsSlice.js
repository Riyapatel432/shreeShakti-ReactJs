import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { V_URL } from "../../baseUrl";

// ----------------------
// NB Sizes
// ----------------------
export const fetchNBSizes = createAsyncThunk("standards/fetchNBSizes", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${V_URL}/standards/nb-sizes`, { withCredentials: true });
    return response.data.data;
  } catch (error) { return rejectWithValue(error.response?.data || error.message); }
});
export const addNBSize = createAsyncThunk("standards/addNBSize", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${V_URL}/standards/nb-sizes`, data, { withCredentials: true });
    return response.data;
  } catch (error) { return rejectWithValue(error.response?.data || { message: error.message }); }
});
export const updateNBSize = createAsyncThunk("standards/updateNBSize", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${V_URL}/standards/nb-sizes/${id}`, data, { withCredentials: true });
    return response.data;
  } catch (error) { return rejectWithValue(error.response?.data || { message: error.message }); }
});
export const deleteNBSize = createAsyncThunk("standards/deleteNBSize", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${V_URL}/standards/nb-sizes/${id}`, { withCredentials: true });
    return { ...response.data, id };
  } catch (error) { return rejectWithValue(error.response?.data || { message: error.message }); }
});

// ----------------------
// Pipe Schedules
// ----------------------
export const fetchPipeSchedules = createAsyncThunk("standards/fetchPipeSchedules", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${V_URL}/standards/pipe-schedules`, { withCredentials: true });
    return response.data.data;
  } catch (error) { return rejectWithValue(error.response?.data || error.message); }
});
export const addPipeSchedule = createAsyncThunk("standards/addPipeSchedule", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${V_URL}/standards/pipe-schedules`, data, { withCredentials: true });
    return response.data;
  } catch (error) { return rejectWithValue(error.response?.data || { message: error.message }); }
});
export const updatePipeSchedule = createAsyncThunk("standards/updatePipeSchedule", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${V_URL}/standards/pipe-schedules/${id}`, data, { withCredentials: true });
    return response.data;
  } catch (error) { return rejectWithValue(error.response?.data || { message: error.message }); }
});
export const deletePipeSchedule = createAsyncThunk("standards/deletePipeSchedule", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${V_URL}/standards/pipe-schedules/${id}`, { withCredentials: true });
    return { ...response.data, id };
  } catch (error) { return rejectWithValue(error.response?.data || { message: error.message }); }
});

// ----------------------
// Tube ODs
// ----------------------
export const fetchTubeODs = createAsyncThunk("standards/fetchTubeODs", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${V_URL}/standards/tube-ods`, { withCredentials: true });
    return response.data.data;
  } catch (error) { return rejectWithValue(error.response?.data || error.message); }
});
export const addTubeOD = createAsyncThunk("standards/addTubeOD", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${V_URL}/standards/tube-ods`, data, { withCredentials: true });
    return response.data;
  } catch (error) { return rejectWithValue(error.response?.data || { message: error.message }); }
});
export const updateTubeOD = createAsyncThunk("standards/updateTubeOD", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${V_URL}/standards/tube-ods/${id}`, data, { withCredentials: true });
    return response.data;
  } catch (error) { return rejectWithValue(error.response?.data || { message: error.message }); }
});
export const deleteTubeOD = createAsyncThunk("standards/deleteTubeOD", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${V_URL}/standards/tube-ods/${id}`, { withCredentials: true });
    return { ...response.data, id };
  } catch (error) { return rejectWithValue(error.response?.data || { message: error.message }); }
});

// ----------------------
// Flange Ratings
// ----------------------
export const fetchFlangeRatings = createAsyncThunk("standards/fetchFlangeRatings", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${V_URL}/standards/flange-ratings`, { withCredentials: true });
    return response.data.data;
  } catch (error) { return rejectWithValue(error.response?.data || error.message); }
});
export const addFlangeRating = createAsyncThunk("standards/addFlangeRating", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${V_URL}/standards/flange-ratings`, data, { withCredentials: true });
    return response.data;
  } catch (error) { return rejectWithValue(error.response?.data || { message: error.message }); }
});
export const updateFlangeRating = createAsyncThunk("standards/updateFlangeRating", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${V_URL}/standards/flange-ratings/${id}`, data, { withCredentials: true });
    return response.data;
  } catch (error) { return rejectWithValue(error.response?.data || { message: error.message }); }
});
export const deleteFlangeRating = createAsyncThunk("standards/deleteFlangeRating", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${V_URL}/standards/flange-ratings/${id}`, { withCredentials: true });
    return { ...response.data, id };
  } catch (error) { return rejectWithValue(error.response?.data || { message: error.message }); }
});

// ----------------------
// Dependencies API (for UI dropdowns)
// ----------------------
export const fetchDependencies = createAsyncThunk("standards/fetchDependencies", async (nbId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${V_URL}/standards/dependencies?nbId=${nbId}`, { withCredentials: true });
    return response.data.data; 
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const initialState = {
  nbSizes: [],
  pipeSchedules: [],
  tubeODs: [],
  flangeRatings: [],
  dependencies: { schedules: [], flanges: [] },
  loading: false,
  error: null,
};

const standardsSlice = createSlice({
  name: "standards",
  initialState,
  reducers: {
    clearDependencies: (state) => {
      state.dependencies = { schedules: [], flanges: [] };
    }
  },
  extraReducers: (builder) => {
    // Boilerplate for loading/error states
    const setLoading = (state) => { state.loading = true; state.error = null; };
    const setError = (state, action) => { state.loading = false; state.error = action.payload; };
    const setDone = (state) => { state.loading = false; };

    builder
      // NB Sizes
      .addCase(fetchNBSizes.pending, setLoading)
      .addCase(fetchNBSizes.fulfilled, (state, action) => { state.loading = false; state.nbSizes = action.payload; })
      .addCase(fetchNBSizes.rejected, setError)
      .addCase(addNBSize.pending, setLoading).addCase(addNBSize.fulfilled, setDone).addCase(addNBSize.rejected, setError)
      .addCase(updateNBSize.pending, setLoading).addCase(updateNBSize.fulfilled, setDone).addCase(updateNBSize.rejected, setError)
      .addCase(deleteNBSize.pending, setLoading).addCase(deleteNBSize.fulfilled, setDone).addCase(deleteNBSize.rejected, setError)

      // Pipe Schedules
      .addCase(fetchPipeSchedules.pending, setLoading)
      .addCase(fetchPipeSchedules.fulfilled, (state, action) => { state.loading = false; state.pipeSchedules = action.payload; })
      .addCase(fetchPipeSchedules.rejected, setError)
      .addCase(addPipeSchedule.pending, setLoading).addCase(addPipeSchedule.fulfilled, setDone).addCase(addPipeSchedule.rejected, setError)
      .addCase(updatePipeSchedule.pending, setLoading).addCase(updatePipeSchedule.fulfilled, setDone).addCase(updatePipeSchedule.rejected, setError)
      .addCase(deletePipeSchedule.pending, setLoading).addCase(deletePipeSchedule.fulfilled, setDone).addCase(deletePipeSchedule.rejected, setError)

      // Tube ODs
      .addCase(fetchTubeODs.pending, setLoading)
      .addCase(fetchTubeODs.fulfilled, (state, action) => { state.loading = false; state.tubeODs = action.payload; })
      .addCase(fetchTubeODs.rejected, setError)
      .addCase(addTubeOD.pending, setLoading).addCase(addTubeOD.fulfilled, setDone).addCase(addTubeOD.rejected, setError)
      .addCase(updateTubeOD.pending, setLoading).addCase(updateTubeOD.fulfilled, setDone).addCase(updateTubeOD.rejected, setError)
      .addCase(deleteTubeOD.pending, setLoading).addCase(deleteTubeOD.fulfilled, setDone).addCase(deleteTubeOD.rejected, setError)

      // Flange Ratings
      .addCase(fetchFlangeRatings.pending, setLoading)
      .addCase(fetchFlangeRatings.fulfilled, (state, action) => { state.loading = false; state.flangeRatings = action.payload; })
      .addCase(fetchFlangeRatings.rejected, setError)
      .addCase(addFlangeRating.pending, setLoading).addCase(addFlangeRating.fulfilled, setDone).addCase(addFlangeRating.rejected, setError)
      .addCase(updateFlangeRating.pending, setLoading).addCase(updateFlangeRating.fulfilled, setDone).addCase(updateFlangeRating.rejected, setError)
      .addCase(deleteFlangeRating.pending, setLoading).addCase(deleteFlangeRating.fulfilled, setDone).addCase(deleteFlangeRating.rejected, setError)

      // Dependencies
      .addCase(fetchDependencies.pending, setLoading)
      .addCase(fetchDependencies.fulfilled, (state, action) => { state.loading = false; state.dependencies = action.payload; })
      .addCase(fetchDependencies.rejected, setError);
  },
});

export const { clearDependencies } = standardsSlice.actions;
export default standardsSlice.reducer;
