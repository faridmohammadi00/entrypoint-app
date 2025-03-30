import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doormanService, IDoorman, IDoormanAssignment } from '../../services/doorman.service';

interface DoormanState {
  doormen: IDoorman[];
  assignments: IDoormanAssignment[];
  loading: boolean;
  error: string | null;
}

const initialState: DoormanState = {
  doormen: [],
  assignments: [],
  loading: false,
  error: null,
};

export const fetchDoormen = createAsyncThunk(
  'doorman/fetchDoormen',
  async () => {
    const response = await doormanService.listDoormen();
    return response;
  }
);

export const registerDoorman = createAsyncThunk(
  'doorman/registerDoorman',
  async (doormanData: Partial<IDoorman>) => {
    const response = await doormanService.registerDoorman(doormanData);
    return response;
  }
);

export const editDoorman = createAsyncThunk(
  'doorman/editDoorman',
  async ({ userId, doormanData }: { userId: string; doormanData: Partial<IDoorman> }) => {
    const response = await doormanService.editDoorman(userId, doormanData);
    return response;
  }
);

export const assignDoorman = createAsyncThunk(
  'doorman/assignDoorman',
  async ({ buildingId, userId }: { buildingId: string; userId: string }) => {
    const response = await doormanService.assignDoorman(buildingId, userId);
    return response;
  }
);

export const removeDoorman = createAsyncThunk(
  'doorman/removeDoorman',
  async ({ buildingId, userId }: { buildingId: string; userId: string }) => {
    await doormanService.removeDoorman(buildingId, userId);
    return { buildingId, userId };
  }
);

export const fetchDoormenForBuilding = createAsyncThunk(
  'doorman/fetchDoormenForBuilding',
  async (buildingId: string) => {
    const response = await doormanService.getDoormenForBuilding(buildingId);
    return response;
  }
);

const doormanSlice = createSlice({
  name: 'doorman',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Doormen
      .addCase(fetchDoormen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoormen.fulfilled, (state, action) => {
        state.loading = false;
        state.doormen = action.payload;
      })
      .addCase(fetchDoormen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch doormen';
      })
      // Register Doorman
      .addCase(registerDoorman.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerDoorman.fulfilled, (state, action) => {
        state.loading = false;
        state.doormen.push(action.payload);
      })
      .addCase(registerDoorman.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to register doorman';
      })
      // Edit Doorman
      .addCase(editDoorman.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editDoorman.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.doormen.findIndex(d => d._id === action.payload._id);
        if (index !== -1) {
          state.doormen[index] = action.payload;
        }
      })
      .addCase(editDoorman.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to edit doorman';
      })
      // Assign Doorman
      .addCase(assignDoorman.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignDoorman.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.push(action.payload);
      })
      .addCase(assignDoorman.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to assign doorman';
      })
      // Remove Doorman
      .addCase(removeDoorman.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeDoorman.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = state.assignments.filter(
          a => !(a.buildingId === action.payload.buildingId && a.userId === action.payload.userId)
        );
      })
      .addCase(removeDoorman.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove doorman';
      })
      // Fetch Doormen for Building
      .addCase(fetchDoormenForBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoormenForBuilding.fulfilled, (state, action) => {
        state.loading = false;
        state.doormen = action.payload;
      })
      .addCase(fetchDoormenForBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch doormen for building';
      });
  },
});

export const { clearError } = doormanSlice.actions;
export default doormanSlice.reducer;
