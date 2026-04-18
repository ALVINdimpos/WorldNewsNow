import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './baseApi';
import authReducer from './authSlice';

// import all API slices so their endpoints are registered
import './articlesApi';
import './commentsApi';
import './authApi';
import './journalistsApi';
import './contactApi';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});
