import { API_URL } from '../config/api';
import { store } from '../store';

export interface PlanData {
  _id: string;
  planName: string;
  buildingCredit: number;
  userCredit: number;
  monthlyVisits: number;
  price: number;
  status: 'active' | 'inactive';
  date: string;
  createdAt: string;
  updatedAt: string;
}

class PlanService {
  private getHeaders() {
    const token = store.getState().auth.token;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getActivePlans() {
    const response = await fetch(`${API_URL}/plans`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getPlanById(id: string) {
    const response = await fetch(`${API_URL}/plans/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return response.json();
  }
}

export const planService = new PlanService();
