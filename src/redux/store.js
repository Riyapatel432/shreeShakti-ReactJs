import { configureStore } from '@reduxjs/toolkit';
import erpReducer from './slices/erpSlice';
import clientReducer from './slices/clientSlice';
import productCategoryReducer from './slices/productCategorySlice';
import productReducer from './slices/productSlice';
import unitReducer from './slices/unitSlice';
import mocReducer from './slices/moc.Slice';
import priceReducer from './slices/priceSlice';
import quotationReducer from './slices/quotationSlice';
import costingSheetReducer from './slices/costingSheet/costingSheetSlice';
export const store = configureStore({
  reducer: {
    erp: erpReducer,
    clients: clientReducer,
    productCategories: productCategoryReducer,
    products: productReducer,
    units: unitReducer,
    mocs: mocReducer,
    prices: priceReducer,
    quotations: quotationReducer,
    costingSheets: costingSheetReducer,
  }
});

export default store;
