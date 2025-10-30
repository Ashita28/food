import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import userApi from './userApi';      
import productApi from './productApi'; 
import orderApi from './orderApi';    

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(
      userApi.middleware,
      productApi.middleware,
      orderApi.middleware
    )
});

setupListeners(store.dispatch);
