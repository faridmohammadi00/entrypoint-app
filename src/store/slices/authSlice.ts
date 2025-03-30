import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface RegisterData {
  email: string;
  fullname: string;
  idNumber: string;
  phone: string;
  password: string;
}

interface AuthState {
  token: string | null;
  user: {
    id: string;
    email: string;
    fullName: string;
  } | null;
  loading: boolean;
  error: string | null;
}

export const login = createAsyncThunk<LoginResponse, { email: string; password: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (credentials: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    loading: false,
    error: null,
  } as AuthState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
