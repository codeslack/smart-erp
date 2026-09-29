import { apiSlice } from "@/store/apiSlice";
import type { AuthResponse, LaravelTenantResponse, User } from "../types";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // STEP 1: Verify credentials and fetch tenant options mapping
    fetchUserTenants: builder.mutation<
      LaravelTenantResponse,
      Record<string, string>
    >({
      query: (credentials) => ({
        url: "/api/tenants", // https://smart-erp-api.test/api/tenants
        method: "GET",
        data: credentials,
      }),
    }),

    // STEP 2: Finalize full session mapping via the selected tenant environment
    loginWithTenant: builder.mutation<AuthResponse, Record<string, any>>({
      query: (payload) => ({
        url: "/api/auth/login",
        method: "POST",
        data: payload, // Pass { email, password, tenant_slug }
      }),
      invalidatesTags: ["Auth"],
    }),

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

export const {
  useFetchUserTenantsMutation,
  useLoginWithTenantMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;
