import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_URL;

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['Foods'],
  endpoints: (builder) => ({
    getFoods: builder.query({
      query: (params = {}) => {
        const qs = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== '') qs.set(k, v);
        });
        return `/foods?${qs.toString()}`;
      },
      transformResponse: (resp) => resp,
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map((f) => ({ type: 'Foods', id: f._id })),
              { type: 'Foods', id: 'LIST' },
            ]
          : [{ type: 'Foods', id: 'LIST' }],
    }),
  }),
});

export const { useGetFoodsQuery } = productApi;
export default productApi;
