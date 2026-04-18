import { baseApi } from './baseApi';
import { transformJournalist } from '../utils/transforms';
import { transformArticle } from '../utils/transforms';

export const journalistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    getJournalists: build.query({
      query: () => '/journalists',
      transformResponse: (res) => (res.data || []).map(transformJournalist),
      providesTags: [{ type: 'Journalist', id: 'LIST' }],
    }),

    getJournalist: build.query({
      query: (id) => `/journalists/${id}`,
      transformResponse: (res) => ({
        profile:  transformJournalist(res.data.profile),
        articles: (res.data.articles || []).map(transformArticle),
      }),
      providesTags: (_res, _err, id) => [{ type: 'Journalist', id }],
    }),

    getDashboard: build.query({
      query: () => '/journalists/dashboard',
      providesTags: ['Dashboard'],
    }),

    updateJournalistProfile: build.mutation({
      query: (body) => ({ url: '/journalists/profile', method: 'PATCH', body }),
      invalidatesTags: [{ type: 'Journalist', id: 'LIST' }, 'Dashboard'],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetJournalistsQuery,
  useGetJournalistQuery,
  useGetDashboardQuery,
  useUpdateJournalistProfileMutation,
} = journalistsApi;
