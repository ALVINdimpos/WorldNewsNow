import { baseApi } from './baseApi';

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    getNotifications: build.query({
      query: ({ page = 1, limit = 20 } = {}) => `/notifications?page=${page}&limit=${limit}`,
      providesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    markNotificationRead: build.mutation({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PATCH' }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    markAllNotificationsRead: build.mutation({
      query: () => ({ url: '/notifications/read-all', method: 'PATCH' }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    deleteNotification: build.mutation({
      query: (id) => ({ url: `/notifications/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
