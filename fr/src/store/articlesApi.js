import { baseApi } from './baseApi';
import { transformArticle, transformComment } from '../utils/transforms';

export const articlesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    getArticles: build.query({
      query: ({ category = 'ALL', page = 1, limit = 20, search, featured, breaking, sort } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (category && category !== 'ALL') params.set('category', category);
        if (search)   params.set('search', search);
        if (featured) params.set('featured', 'true');
        if (breaking) params.set('breaking', 'true');
        if (sort)     params.set('sort', sort);
        return `/articles?${params}`;
      },
      transformResponse: (res) => ({
        articles:   (res.data || []).map(transformArticle),
        pagination: res.pagination,
      }),
      providesTags: (res) =>
        res
          ? [...res.articles.map(({ id }) => ({ type: 'Article', id })), { type: 'Article', id: 'LIST' }]
          : [{ type: 'Article', id: 'LIST' }],
    }),

    getArticle: build.query({
      query: (id) => `/articles/${id}`,
      transformResponse: (res) => ({
        article:  transformArticle(res.data.article),
        comments: (res.data.comments || []).map(transformComment),
      }),
      providesTags: (_res, _err, id) => [{ type: 'Article', id }, { type: 'Comment', id }],
    }),

    getJournalistArticles: build.query({
      query: ({ userId, page = 1, limit = 50, status }) => {
        const params = new URLSearchParams({ page, limit });
        if (status) params.set('status', status);
        return `/articles/journalist/${userId}?${params}`;
      },
      transformResponse: (res) => ({
        articles:   (res.data || []).map(transformArticle),
        pagination: res.pagination,
      }),
      providesTags: [{ type: 'Article', id: 'MINE' }],
    }),

    getBookmarks: build.query({
      query: ({ page = 1, limit = 12 } = {}) => `/articles/bookmarks?page=${page}&limit=${limit}`,
      transformResponse: (res) => ({
        articles:   (res.data || []).map(transformArticle),
        pagination: res.pagination,
      }),
      providesTags: [{ type: 'Bookmark', id: 'LIST' }],
    }),

    createArticle: build.mutation({
      query: (body) => ({ url: '/articles', method: 'POST', body }),
      invalidatesTags: [{ type: 'Article', id: 'LIST' }, { type: 'Article', id: 'MINE' }, { type: 'Dashboard' }],
    }),

    updateArticle: build.mutation({
      query: ({ id, ...body }) => ({ url: `/articles/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Article', id }, { type: 'Article', id: 'LIST' }, { type: 'Article', id: 'MINE' }],
    }),

    deleteArticle: build.mutation({
      query: (id) => ({ url: `/articles/${id}`, method: 'DELETE' }),
      invalidatesTags: (_res, _err, id) => [{ type: 'Article', id }, { type: 'Article', id: 'LIST' }, { type: 'Article', id: 'MINE' }, { type: 'Dashboard' }],
    }),

    publishArticle: build.mutation({
      query: (id) => ({ url: `/articles/${id}/publish`, method: 'POST' }),
      invalidatesTags: (_res, _err, id) => [{ type: 'Article', id }, { type: 'Article', id: 'LIST' }, { type: 'Article', id: 'MINE' }, { type: 'Dashboard' }],
    }),

    unpublishArticle: build.mutation({
      query: (id) => ({ url: `/articles/${id}/unpublish`, method: 'POST' }),
      invalidatesTags: (_res, _err, id) => [{ type: 'Article', id }, { type: 'Article', id: 'LIST' }, { type: 'Article', id: 'MINE' }, { type: 'Dashboard' }],
    }),

    likeArticle: build.mutation({
      query: (id) => ({ url: `/articles/${id}/like`, method: 'POST' }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const activeCat = 'ALL';
          dispatch(
            articlesApi.util.updateQueryData('getArticles', { category: activeCat }, (draft) => {
              const art = draft.articles.find((a) => a.id === id);
              if (art) art.likes = data.likesCount;
            })
          );
        } catch {}
      },
    }),

    bookmarkArticle: build.mutation({
      query: (id) => ({ url: `/articles/${id}/bookmark`, method: 'POST' }),
      invalidatesTags: [{ type: 'Bookmark', id: 'LIST' }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            articlesApi.util.updateQueryData('getArticles', { category: 'ALL' }, (draft) => {
              const art = draft.articles.find((a) => a.id === id);
              if (art) art.isBookmarked = data.bookmarked;
            })
          );
        } catch {}
      },
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useGetJournalistArticlesQuery,
  useGetBookmarksQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  usePublishArticleMutation,
  useUnpublishArticleMutation,
  useLikeArticleMutation,
  useBookmarkArticleMutation,
} = articlesApi;
