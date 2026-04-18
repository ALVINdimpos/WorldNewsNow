import { baseApi } from './baseApi';

export const contactApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    subscribe: build.mutation({
      query: (body) => ({ url: '/contact/subscribe', method: 'POST', body }),
    }),

    unsubscribe: build.mutation({
      query: (body) => ({ url: '/contact/unsubscribe', method: 'POST', body }),
    }),

    advertiseInquiry: build.mutation({
      query: (body) => ({ url: '/contact/advertise', method: 'POST', body }),
    }),

    careersNotify: build.mutation({
      query: (body) => ({ url: '/contact/careers', method: 'POST', body }),
    }),

  }),
  overrideExisting: false,
});

export const {
  useSubscribeMutation,
  useUnsubscribeMutation,
  useAdvertiseInquiryMutation,
  useCareersNotifyMutation,
} = contactApi;
