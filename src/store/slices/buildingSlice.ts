import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { buildingService } from '../../services/building.service';

interface BuildingType {
  _id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  type: 'building' | 'complex' | 'tower';
  userId: string;
}

interface BuildingState {
  buildings: BuildingType[];
  loading: boolean;
  error: string | null;
}

const initialState: BuildingState = {
  buildings: [],
  loading: false,
  error: null,
};

export const createBuilding = createAsyncThunk(
  'building/create',
  async (buildingData: Omit<BuildingType, '_id' | 'userId'>) => {
    const response = await buildingService.createBuilding(buildingData);
    return response;
  }
);

export const fetchBuildings = createAsyncThunk(
  'building/fetchAll',
  async () => {
    const response = await buildingService.getAllBuildings();
    return response;
  }
);

export const updateBuilding = createAsyncThunk(
  'building/update',
  async ({ id, data }: { id: string; data: Partial<BuildingType> }) => {
    const response = await buildingService.updateBuilding(id, data);
    return response;
  }
);

export const deleteBuilding = createAsyncThunk(
  'building/delete',
  async (id: string) => {
    await buildingService.deleteBuilding(id);
    return id;
  }
);

const buildingSlice = createSlice({
  name: 'building',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create building
      .addCase(createBuilding.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBuilding.fulfilled, (state, action) => {
        state.buildings.push(action.payload);
        state.loading = false;
      })
      .addCase(createBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create building';
      })
      // Fetch buildings
      .addCase(fetchBuildings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBuildings.fulfilled, (state, action) => {
        state.buildings = action.payload;
        state.loading = false;
      })
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch buildings';
      })
      // Update building
      .addCase(updateBuilding.fulfilled, (state, action) => {
        const index = state.buildings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.buildings[index] = action.payload;
        }
      })
      // Delete building
      .addCase(deleteBuilding.fulfilled, (state, action) => {
        state.buildings = state.buildings.filter(b => b._id !== action.payload);
      });
  },
});

export default buildingSlice.reducer;
