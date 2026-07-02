import { configureStore } from '@reduxjs/toolkit';
import erpReducer from './slices/erpSlice';
import clientReducer from './slices/clientSlice';
export const store = configureStore({
  reducer: {
    erp: erpReducer,
    clients: clientReducer
  }
});

export default store;
