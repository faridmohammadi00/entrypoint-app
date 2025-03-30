import { API_URL } from '../config/api';
import { store } from '../store';

interface ProfileType {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  idNumber: string;
  city: string;
  address: string;
  avatar?: string;
}

interface ChangePasswordType {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export const profileService = {
  getHeaders() {
    const token = store.getState().auth.token;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  },

  getProfile: async () => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        headers: profileService.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (profileData: Partial<ProfileType>) => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: profileService.getHeaders(),
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (passwordData: ChangePasswordType) => {
    try {
      const response = await fetch(`${API_URL}/profile/change-password`, {
        method: 'PUT',
        headers: profileService.getHeaders(),
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};
