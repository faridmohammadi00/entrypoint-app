import { API_URL } from '../config/api';
import { store } from '../store';

export interface ActivePlanData {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

class ActivePlanService {
  private getHeaders() {
    const token = store.getState().auth.token;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async createActivePlan(planId: string) {
    const response = await fetch(`${API_URL}/active-plans`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ planId }),
    });
    return response.json();
  }

  async getUserActivePlans(userId: string) {
    const response = await fetch(`${API_URL}/active-plans/${userId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async cancelActivePlan(id: string) {
    const response = await fetch(`${API_URL}/active-plans/${id}/cancel`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });
    return response.json();
  }
}

export const activePlanService = new ActivePlanService();
