import { API_URL } from '../config/api';
import { store } from '../store';

interface VisitType {
  _id?: string;
  building_id: string;
  user_id: string;
  visitor_id: string;
  purpose: string;
  unit: string;
  check_in_date: Date;
  check_out_date?: Date;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export const visitService = {
  getHeaders() {
    const token = store.getState().auth.token;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  },

  createVisit: async (visitData: Omit<VisitType, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`${API_URL}/app/visits`, {
        method: 'POST',
        headers: visitService.getHeaders(),
        body: JSON.stringify(visitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create visit');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getAllVisits: async () => {
    try {
      const response = await fetch(`${API_URL}/app/visits`, {
        method: 'GET',
        headers: visitService.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch visits');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getVisitById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/app/visits/${id}`, {
        method: 'GET',
        headers: visitService.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch visit');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateVisit: async (id: string, visitData: Partial<VisitType>) => {
    try {
      const response = await fetch(`${API_URL}/app/visits/${id}`, {
        method: 'PUT',
        headers: visitService.getHeaders(),
        body: JSON.stringify(visitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update visit');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
}; 