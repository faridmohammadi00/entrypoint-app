import { API_URL } from '../config/api';
import { store } from '../store';

export interface IDoorman {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  idNumber: string;
  city?: string;
  address?: string;
  status: 'active' | 'inactive';
  role: 'doorman';
  buildings?: Array<{
    _id: string;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    type: string;
    userId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
}

export interface IDoormanAssignment {
  buildingId: string;
  userId: string;
  status: 'active' | 'inactive';
  assignedAt: Date;
}

export const doormanService = {
  getHeaders() {
    const token = store.getState().auth.token;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  },

  listDoormen: async () => {
    try {
      const response = await fetch(`${API_URL}/app/doorman`, {
        method: 'GET',
        headers: doormanService.getHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch doormen');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  registerDoorman: async (doormanData: Partial<IDoorman>) => {
    try {
      const response = await fetch(`${API_URL}/app/doorman/register`, {
        method: 'POST',
        headers: doormanService.getHeaders(),
        body: JSON.stringify(doormanData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register doorman');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  editDoorman: async (userId: string, doormanData: Partial<IDoorman>) => {
    try {
      const response = await fetch(`${API_URL}/app/doorman/${userId}`, {
        method: 'PUT',
        headers: doormanService.getHeaders(),
        body: JSON.stringify(doormanData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to edit doorman');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  assignDoorman: async (buildingId: string, userId: string) => {
    try {
      const response = await fetch(`${API_URL}/app/doorman/assign`, {
        method: 'POST',
        headers: doormanService.getHeaders(),
        body: JSON.stringify({ buildingId, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign doorman');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  removeDoorman: async (buildingId: string, userId: string) => {
    try {
      const response = await fetch(`${API_URL}/app/doorman/remove`, {
        method: 'DELETE',
        headers: doormanService.getHeaders(),
        body: JSON.stringify({ buildingId, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove doorman');
      }
    } catch (error) {
      throw error;
    }
  },

  getDoormenForBuilding: async (buildingId: string) => {
    try {
      const response = await fetch(`${API_URL}/app/doorman/${buildingId}/doormen`, {
        method: 'GET',
        headers: doormanService.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch doormen for building');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getDoormanAssignment: async (buildingId: string, userId: string) => {
    try {
      const response = await fetch(`${API_URL}/app/doorman/${buildingId}/doorman/${userId}`, {
        method: 'GET',
        headers: doormanService.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch doorman assignment');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getDoormanById: async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/app/doorman/${userId}`, {
        method: 'GET',
        headers: doormanService.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch doorman details');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  activateAssignment: async (buildingId: string, userId: string) => {
    try {
      const response = await fetch(`${API_URL}/app/doorman/assignment/activate`, {
        method: 'POST',
        headers: doormanService.getHeaders(),
        body: JSON.stringify({ buildingId, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to activate assignment');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  deactivateAssignment: async (buildingId: string, userId: string) => {
    try {
      const response = await fetch(`${API_URL}/app/doorman/assignment/deactivate`, {
        method: 'POST',
        headers: doormanService.getHeaders(),
        body: JSON.stringify({ buildingId, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to deactivate assignment');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};
