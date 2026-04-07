// frontend/src/store/api/adminApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Admin, ApiResponse } from '../../types';
import { RootState } from '../store';

const API_URL = import.meta.env['VITE_API_URL'] as string ?? 'http://localhost:5002';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  admin: Admin;
}

interface DashboardStats {
  totalProducts: number;
  visibleProducts: number;
  totalOrders: number;
  pendingOrders: number;
}

interface UploadResult {
  url: string;
  publicId: string;
}

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Admin', 'Stats'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    logout: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    getMe: builder.query<ApiResponse<Admin>, void>({
      query: () => '/auth/me',
      providesTags: ['Admin'],
    }),

    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => '/orders?limit=1&page=1',
      providesTags: ['Stats'],
      transformResponse: () => ({
        success: true,
        data: {
          totalProducts: 0,
          visibleProducts: 0,
          totalOrders: 0,
          pendingOrders: 0,
        },
      }),
    }),

    uploadImage: builder.mutation<ApiResponse<UploadResult>, FormData>({
      query: (formData) => ({
        url: '/upload/image',
        method: 'POST',
        body: formData,
      }),
    }),

    uploadImages: builder.mutation<ApiResponse<UploadResult[]>, FormData>({
      query: (formData) => ({
        url: '/upload/images',
        method: 'POST',
        body: formData,
      }),
    }),

    deleteImage: builder.mutation<ApiResponse<null>, string>({
      query: (publicId) => ({
        url: `/upload/${encodeURIComponent(publicId)}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useGetDashboardStatsQuery,
  useUploadImageMutation,
  useUploadImagesMutation,
  useDeleteImageMutation,
} = adminApi;
