import { baseApi } from './baseApi';
import { setCredentials, clearCredentials } from './authSlice';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    register: build.mutation({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
        } catch {}
      },
    }),

    login: build.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
        } catch {}
      },
    }),

    logout: build.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearCredentials());
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),

    getMe: build.query({
      query: () => '/auth/me',
      providesTags: ['Me'],
    }),

    updateProfile: build.mutation({
      query: (body) => ({ url: '/auth/update-profile', method: 'PATCH', body }),
      invalidatesTags: ['Me'],
      async onQueryStarted(_arg, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const token = getState().auth.token;
          dispatch(setCredentials({ user: data.user, accessToken: token }));
        } catch {}
      },
    }),

    changePassword: build.mutation({
      query: (body) => ({ url: '/auth/change-password', method: 'PATCH', body }),
    }),

    forgotPassword: build.mutation({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
    }),

    resetPassword: build.mutation({
      query: ({ token, password }) => ({
        url: `/auth/reset-password/${token}`,
        method: 'POST',
        body: { password },
      }),
    }),

    sendVerification: build.mutation({
      query: () => ({ url: '/auth/send-verification', method: 'POST' }),
    }),

    verifyEmail: build.mutation({
      query: (token) => ({ url: `/auth/verify-email/${token}`, method: 'GET' }),
      invalidatesTags: ['Me'],
    }),

  }),
  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendVerificationMutation,
  useVerifyEmailMutation,
} = authApi;
