import { API_URL } from '../config/api';
import { store } from '../store';

export interface UserData {
  id: string;
  fullName: string;
  birthdate: string;
  email: string;
  gender: string;
  phone: string;
  plan: string;
  status: 'Active' | 'Not Active';
  password?: string;
  idNumber?: string;
  city?: string;
  address?: string;
  role?: 'user' | 'doorman' | 'admin';
}

class UserService {
  private getHeaders() {
    const token = store.getState().auth.token;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getAllUsers() {
    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async createUser(userData: UserData) {
    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    return response.json();
  }

  async updateUser(id: string, userData: Partial<UserData>) {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    return response.json();
  }

  async deleteUser(id: string) {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async activateUser(id: string) {
    const response = await fetch(`${API_URL}/admin/users/${id}/activate`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async inactivateUser(id: string) {
    const response = await fetch(`${API_URL}/admin/users/${id}/inactivate`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });
    return response.json();
  }
}

export const userService = new UserService();
