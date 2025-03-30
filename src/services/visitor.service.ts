import { API_URL } from '../config/api';
import { store } from '../store';

interface VisitorType {
  _id?: string;
  fullname: string;
  id_number: string;
  birthday: Date;
  gender: 'male' | 'female' | 'other';
  region: string;
  expire_date: Date;
  phone: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export const visitorService = {
  getHeaders() {
    const token = store.getState().auth.token;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  },

  createVisitor: async (visitorData: Omit<VisitorType, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`${API_URL}/app/visitors`, {
        method: 'POST',
        headers: visitorService.getHeaders(),
        body: JSON.stringify(visitorData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create visitor');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getAllVisitors: async () => {
    try {
      const response = await fetch(`${API_URL}/app/visitors`, {
        method: 'GET',
        headers: visitorService.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch visitors');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getVisitorById: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/app/visitors/${id}`, {
        method: 'GET',
        headers: visitorService.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch visitor');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateVisitor: async (id: string, visitorData: Partial<VisitorType>) => {
    try {
      const response = await fetch(`${API_URL}/app/visitors/${id}`, {
        method: 'PUT',
        headers: visitorService.getHeaders(),
        body: JSON.stringify(visitorData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update visitor');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  deleteVisitor: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/app/visitors/${id}`, {
        method: 'DELETE',
        headers: visitorService.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete visitor');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
}; 