import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE = import.meta.env.VITE_API_URL;

export const foodApi = createApi({
  reducerPath: 'foodApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE }),
  tagTypes: ['Food'],
  endpoints: (builder) => ({
    getFoods: builder.query({
      query: (params = {}) => ({
        url: '/foods',
        params,
      }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map((f) => ({ type: 'Food', id: f._id })),
              { type: 'Food', id: 'LIST' },
            ]
          : [{ type: 'Food', id: 'LIST' }],
    }),

    createFood: builder.mutation({
      query: (body) => ({
        url: '/foods',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Food', id: 'LIST' }],
    }),

    updateFood: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/foods/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Food', id },
        { type: 'Food', id: 'LIST' },
      ],
    }),

    deleteFood: builder.mutation({
      query: (id) => ({
        url: `/foods/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Food', id },
        { type: 'Food', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetFoodsQuery,
  useCreateFoodMutation,
  useUpdateFoodMutation,
  useDeleteFoodMutation,
} = foodApi;

export default foodApi;
