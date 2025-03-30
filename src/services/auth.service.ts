import { API_URL } from '../config/api';

interface RegisterData {
  email: string;
  fullname: string;
  idNumber: string;
  phone: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  register: async (data: RegisterData) => {
    try {
      const response = await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log('register response', response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  login: async (data: LoginData) => {
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log('login response', response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};
