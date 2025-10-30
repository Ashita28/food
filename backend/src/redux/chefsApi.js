import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_URL;

export const chefsApi = createApi({
  reducerPath: 'chefsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['Chefs'],
  endpoints: (builder) => ({
    getChefs: builder.query({
      query: () => `/chefs`,
      providesTags: (result) =>
        result?.chefs
          ? [
              ...result.chefs.map((c) => ({ type: 'Chefs', id: c._id })),
              { type: 'Chefs', id: 'LIST' },
            ]
          : [{ type: 'Chefs', id: 'LIST' }],
    }),

    assignChef: builder.mutation({
      query: (body) => ({
        url: `/chefs/assign`,
        method: 'PATCH',
        body: body ?? {}, 
      }),
      invalidatesTags: [{ type: 'Chefs', id: 'LIST' }],
    }),

    createChefs: builder.mutation({
      query: (payload) => ({
        url: `/chefs`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Chefs', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetChefsQuery,
  useAssignChefMutation,
  useCreateChefsMutation,
} = chefsApi;

export default chefsApi;
