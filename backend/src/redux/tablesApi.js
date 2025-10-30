import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE = import.meta.env.VITE_API_URL;

export const tablesApi = createApi({
  reducerPath: 'tablesApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE }),
  tagTypes: ['Tables'],
  endpoints: (b) => ({
    getTables: b.query({
      query: (params = { sort: 'tableNum', dir: 'asc', limit: 100 }) => ({
        url: '/tables',
        params,
      }),
      providesTags: (res) =>
        res?.items
          ? [
              ...res.items.map((t) => ({ type: 'Tables', id: t._id })),
              { type: 'Tables', id: 'LIST' },
            ]
          : [{ type: 'Tables', id: 'LIST' }],
    }),

    getTable: b.query({
      query: ({ id, byNum }) =>
        byNum
          ? { url: `/tables/dummy`, params: { byNum } }
          : { url: `/tables/${id}` },
      providesTags: (_res, _err, arg) => [{ type: 'Tables', id: arg?.id || `byNum:${arg?.byNum}` }],
    }),

    createTables: b.mutation({
      query: (body) => ({ url: '/tables', method: 'POST', body }),
      invalidatesTags: [{ type: 'Tables', id: 'LIST' }],
    }),

    updateTable: b.mutation({
      query: ({ id, body }) => ({ url: `/tables/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_res, _err, arg) => [
        { type: 'Tables', id: arg?.id },
        { type: 'Tables', id: 'LIST' },
      ],
    }),

    deleteTable: b.mutation({
      query: (arg) => {
        if (typeof arg === 'string') {
          return { url: `/tables/${arg}`, method: 'DELETE' };
        }
        const { id, byNum } = arg;
        return {
          url: `/tables/${id || 'dummy'}`,
          method: 'DELETE',
          params: byNum ? { byNum } : {},
        };
      },
      invalidatesTags: (_res, _err, arg) => {
        const id = typeof arg === 'string' ? arg : arg?.id;
        return [{ type: 'Tables', id }, { type: 'Tables', id: 'LIST' }];
      },
    }),
  }),
});

export const {
  useGetTablesQuery,
  useGetTableQuery,
  useCreateTablesMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
} = tablesApi;

export default tablesApi;
