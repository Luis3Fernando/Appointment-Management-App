import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  role: 'user' | 'admin' | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  role: null,
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserRole: (state, action: PayloadAction<'user' | 'admin'>) => {
      state.role = action.payload;
      if (action.payload === 'admin') {
        state.isLoggedIn = true;
      }
    },
    logout: (state) => {
      state.role = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUserRole, logout } = authSlice.actions;
export default authSlice.reducer;