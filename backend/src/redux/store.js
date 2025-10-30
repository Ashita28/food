import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import foodApi from './foodApi';
import tablesApi from './tablesApi';
import chefsApi from './chefsApi';
import orderApi from './orderApi';
import analyticsApi from './analyticsApi';

export const store = configureStore({
  reducer: {
    [foodApi.reducerPath]: foodApi.reducer,
    [tablesApi.reducerPath]: tablesApi.reducer,
    [chefsApi.reducerPath]: chefsApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer
  },
  middleware: (getDefault) =>
    getDefault()
      .concat(foodApi.middleware)
      .concat(tablesApi.middleware)
      .concat(chefsApi.middleware)
      .concat(orderApi.middleware)
      .concat(analyticsApi.middleware)
});

setupListeners(store.dispatch);
