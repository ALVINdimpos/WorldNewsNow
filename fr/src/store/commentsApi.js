import { baseApi } from './baseApi';
import { transformComment } from '../utils/transforms';

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    getComments: build.query({
      query: ({ articleId, page = 1, limit = 10 }) => `/comments?articleId=${articleId}&page=${page}&limit=${limit}`,
      transformResponse: (res) => ({
        comments: (res.data || []).map(transformComment),
        pagination: res.pagination,
      }),
      providesTags: (_res, _err, { articleId }) => [{ type: 'Comment', id: articleId }],
    }),

    createComment: build.mutation({
      query: ({ text, articleId, parentId, anonymous }) => ({
        url: '/comments',
        method: 'POST',
        body: {
          text,
          articleId,
          ...(parentId ? { parentId } : {}),
          anonymous: Boolean(anonymous),
        },
      }),
      invalidatesTags: (_res, _err, { articleId }) => [
        { type: 'Comment', id: articleId },
        { type: 'Article', id: articleId },
      ],
    }),

    updateComment: build.mutation({
      query: ({ id, text }) => ({ url: `/comments/${id}`, method: 'PATCH', body: { text } }),
      invalidatesTags: [{ type: 'Comment' }],
    }),

    deleteComment: build.mutation({
      query: (id) => ({ url: `/comments/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Comment' }],
    }),

    likeComment: build.mutation({
      query: (id) => ({ url: `/comments/${id}/like`, method: 'POST' }),
    }),

    reportComment: build.mutation({
      query: ({ id, reason, details }) => ({
        url: `/comments/${id}/report`,
        method: 'POST',
        body: { reason, details },
      }),
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useReportCommentMutation,
} = commentsApi;
