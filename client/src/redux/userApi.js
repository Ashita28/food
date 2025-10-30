import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_URL;

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user?._id) {
            dispatch(userApi.util.invalidateTags([{ type: 'User', id: data.user._id }]));
          }
        } catch {}
      },
    }),
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'User', id }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({ url: `/users/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'User', id }],
    }),
  }),
});

export const { useCreateUserMutation, useGetUserQuery, useUpdateUserMutation } = userApi;
export default userApi