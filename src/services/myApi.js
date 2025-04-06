import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const myApi = createApi({
  reducerPath: "myApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://blog-platform.kata.academy/api", //
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getItems: builder.query({
      query: () => "items",
    }),

    getCurrentUser: builder.query({
      query: () => "/user",
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetItemsQuery,
  useGetCurrentUserQuery,
} = myApi;
