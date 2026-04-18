import { baseApi } from './baseApi';
import { transformComment } from '../utils/transforms';

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    getComments: build.query({
      query: (articleId) => `/comments?articleId=${articleId}`,
      transformResponse: (res) => (res.data || []).map(transformComment),
      providesTags: (_res, _err, articleId) => [{ type: 'Comment', id: articleId }],
    }),

    createComment: build.mutation({
      query: ({ text, articleId, parentId }) => ({
        url: '/comments',
        method: 'POST',
        body: { text, articleId, parentId },
      }),
      invalidatesTags: (_res, _err, { articleId }) => [{ type: 'Comment', id: articleId }],
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

  }),
  overrideExisting: false,
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
} = commentsApi;
