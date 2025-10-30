import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE = import.meta.env.VITE_API_URL;

export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE }),
  endpoints: (builder) => ({
    getAnalyticsSummary: builder.query({
      query: () => "/analytics/summary",
      transformResponse: (resp) => resp,
    }),
  }),
});

export const { useGetAnalyticsSummaryQuery } = analyticsApi;

export default analyticsApi;
