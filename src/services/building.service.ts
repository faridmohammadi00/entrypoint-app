import { API_URL } from '../config/api';
import { store } from '../store';

interface BuildingType {
  _id?: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  type: 'building' | 'complex' | 'tower';
  userId?: string;
}

export const buildingService = {
  getHeaders() {
    const token = store.getState().auth.token;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  },

  createBuilding: async (buildingData: Omit<BuildingType, '_id' | 'userId'>) => {
    try {
      const response = await fetch(`${API_URL}/app/buildings`, {
        method: 'POST',
        headers: buildingService.getHeaders(),
        body: JSON.stringify(buildingData),
      });
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create building');
      }
      console.log(await response.json());
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getAllBuildings: async () => {
    try {
      const response = await fetch(`${API_URL}/app/buildings`, {
        method: 'GET',
        headers: buildingService.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch buildings');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getBuildingById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/app/buildings/${id}`, {
        method: 'GET',
        headers: buildingService.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch building');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateBuilding: async (id: string, buildingData: Partial<BuildingType>) => {
    try {
      const response = await fetch(`${API_URL}/app/buildings/${id}`, {
        method: 'PUT',
        headers: buildingService.getHeaders(),
        body: JSON.stringify(buildingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update building');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  deleteBuilding: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/app/buildings/${id}`, {
        method: 'DELETE',
        headers: buildingService.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete building');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  activateBuilding: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/app/buildings/${id}/activate`, {
        method: 'PUT',
        headers: buildingService.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to activate building');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  deactivateBuilding: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/app/buildings/${id}/deactivate`, {
        method: 'PUT',
        headers: buildingService.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to deactivate building');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};
