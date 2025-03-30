import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { planService, PlanData } from '../../services/plan.service';

export const fetchActivePlans = createAsyncThunk(
  'plans/fetchActivePlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await planService.getActivePlans();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPlanById = createAsyncThunk(
  'plans/fetchPlanById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await planService.getPlanById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface PlanState {
  plans: PlanData[];
  selectedPlan: PlanData | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlanState = {
  plans: [],
  selectedPlan: null,
  loading: false,
  error: null,
};

const planSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    clearSelectedPlan: (state) => {
      state.selectedPlan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivePlans.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivePlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
        state.error = null;
      })
      .addCase(fetchActivePlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPlanById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPlan = action.payload;
        state.error = null;
      })
      .addCase(fetchPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedPlan } = planSlice.actions;
export default planSlice.reducer;
