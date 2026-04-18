import { createSlice } from '@reduxjs/toolkit';

const stored = (() => {
  try { return JSON.parse(localStorage.getItem('wnn_auth') || 'null'); } catch { return null; }
})();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:  stored?.user  || null,
    token: stored?.token || null,
  },
  reducers: {
    setCredentials(state, { payload: { user, accessToken } }) {
      state.user  = user;
      state.token = accessToken;
      localStorage.setItem('wnn_auth', JSON.stringify({ user, token: accessToken }));
    },
    clearCredentials(state) {
      state.user  = null;
      state.token = null;
      localStorage.removeItem('wnn_auth');
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser  = (s) => s.auth.user;
export const selectCurrentToken = (s) => s.auth.token;
