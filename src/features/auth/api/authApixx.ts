import { apiSlice } from "@/store/apiSlice";
import type { AuthResponse, User } from "../types";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Connects to Laravel Route: Route::post('/auth/login')
    login: builder.mutation<AuthResponse, Record<string, string>>({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        data: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    // Connects to Laravel Route: Route::get('/auth/me')
    getMe: builder.query<User, void>({
      query: () => ({
        url: "/api/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
    // Connects to Laravel Route: Route::post('/auth/logout')
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery, useLogoutMutation } = authApi;
