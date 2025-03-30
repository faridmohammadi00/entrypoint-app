import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { activePlanService, ActivePlanData } from '../../services/activePlan.service';

export const createActivePlan = createAsyncThunk(
  'activePlans/create',
  async (planId: string, { rejectWithValue }) => {
    try {
      const response = await activePlanService.createActivePlan(planId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserActivePlans = createAsyncThunk(
  'activePlans/fetchUserPlans',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await activePlanService.getUserActivePlans(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelActivePlan = createAsyncThunk(
  'activePlans/cancel',
  async (planId: string, { rejectWithValue }) => {
    try {
      const response = await activePlanService.cancelActivePlan(planId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface ActivePlanState {
  activePlans: ActivePlanData[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivePlanState = {
  activePlans: [],
  loading: false,
  error: null,
};

const activePlanSlice = createSlice({
  name: 'activePlans',
  initialState,
  reducers: {
    clearActivePlans: (state) => {
      state.activePlans = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Active Plan
      .addCase(createActivePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createActivePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.activePlans.push(action.payload);
      })
      .addCase(createActivePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Active Plans
      .addCase(fetchUserActivePlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserActivePlans.fulfilled, (state, action) => {
        state.loading = false;
        state.activePlans = action.payload;
      })
      .addCase(fetchUserActivePlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Cancel Active Plan
      .addCase(cancelActivePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelActivePlan.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.activePlans.findIndex(plan => plan.id === action.payload.id);
        if (index !== -1) {
          state.activePlans[index] = action.payload;
        }
      })
      .addCase(cancelActivePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearActivePlans } = activePlanSlice.actions;
export default activePlanSlice.reducer;
