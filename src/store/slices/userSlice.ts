import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService, UserData } from '../../services/user.service';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUsers();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: UserData, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'users/updateUserStatus',
  async ({ id, status }: { id: string; status: 'active' | 'inactive' }, { rejectWithValue }) => {
    try {
      if (status === 'active') {
        return await userService.activateUser(id);
      } else {
        return await userService.inactivateUser(id);
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface UserState {
  users: UserData[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  },
});

export default userSlice.reducer;
