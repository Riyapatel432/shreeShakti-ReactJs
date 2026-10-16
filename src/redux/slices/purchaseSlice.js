import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Vendor Thunks (Calling the Client API with type=vendor)
export const fetchVendors = createAsyncThunk(
  'purchase/fetchVendors',
  async (params, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` }, params: { ...params, type: 'vendor' } };
      const response = await axios.get('/api/client', config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Purchase Order Thunks
export const fetchPurchaseOrders = createAsyncThunk(
  'purchase/fetchPurchaseOrders',
  async (params, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` }, params };
      const response = await axios.get('/api/purchase-order', config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getPurchaseOrderById = createAsyncThunk(
  'purchase/getPurchaseOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`/api/purchase-order/${id}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createPurchaseOrder = createAsyncThunk(
  'purchase/createPurchaseOrder',
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post('/api/purchase-order', data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updatePurchaseOrder = createAsyncThunk(
  'purchase/updatePurchaseOrder',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(`/api/purchase-order/${id}`, data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deletePurchaseOrder = createAsyncThunk(
  'purchase/deletePurchaseOrder',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.delete(`/api/purchase-order/${id}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updatePurchaseOrderStatus = createAsyncThunk(
  'purchase/updatePurchaseOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(`/api/purchase-order/${id}/status`, { status }, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Goods Receipt Thunks
export const fetchGoodsReceipts = createAsyncThunk(
  'purchase/fetchGoodsReceipts',
  async (purchaseOrderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` }, params: { purchaseOrderId } };
      const response = await axios.get('/api/goods-receipt', config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const createGoodsReceipt = createAsyncThunk(
  'purchase/createGoodsReceipt',
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post('/api/goods-receipt', data, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState: {
    vendors: [],
    purchaseOrders: [],
    goodsReceipts: [],
    currentPO: null,
    loading: false,
    error: null,
    pagination: null,
  },
  reducers: {
    clearCurrentPO: (state) => {
      state.currentPO = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Vendors
      .addCase(fetchVendors.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch vendors";
      })

      // Purchase Orders
      .addCase(fetchPurchaseOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrders = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch purchase orders";
      })

      // Create PO
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.purchaseOrders.unshift(action.payload.data);
      })

      // Delete PO
      .addCase(deletePurchaseOrder.fulfilled, (state, action) => {
        state.purchaseOrders = state.purchaseOrders.filter(po => po._id !== action.meta.arg);
      })

      // Status Update PO
      .addCase(updatePurchaseOrderStatus.fulfilled, (state, action) => {
        const index = state.purchaseOrders.findIndex(po => po._id === action.payload.data._id);
        if (index !== -1) {
          state.purchaseOrders[index] = action.payload.data;
        }
        if (state.currentPO?._id === action.payload.data._id) {
          state.currentPO = action.payload.data;
        }
      })

      // Goods Receipts
      .addCase(fetchGoodsReceipts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchGoodsReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.goodsReceipts = action.payload.data;
      })
      .addCase(createGoodsReceipt.fulfilled, (state, action) => {
        state.goodsReceipts.unshift(action.payload.data);
      });
  }
});

export const { clearCurrentPO } = purchaseSlice.actions;
export default purchaseSlice.reducer;
