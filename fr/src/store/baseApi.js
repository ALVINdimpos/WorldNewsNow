import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Local `npm run dev`: use same-origin `/api` so Vite's proxy forwards to your bn server (see vite.config.js).
// Production build: use `VITE_API_URL` (e.g. Render) — set in hosting env.
const apiBaseUrl =
  import.meta.env.DEV
    ? '/api'
    : `${String(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api`;

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Article', 'Comment', 'Journalist', 'Dashboard', 'Me', 'Notification', 'Bookmark'],
  endpoints: () => ({}),
});
