import Cookies from 'js-cookie';
import { toast } from 'vue-sonner';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import router from '@/router';
import { taigaService } from '@/services/taiga';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<any | null>(null);
  // Computed
  const isAuthenticated = computed(() => !!Cookies.get('auth_token'));

  // Initialize from cookies and localStorage
  const initializeAuth = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
  };

  // Actions
  const login = async (username: string, password: string) => {
    try {
      const response = await taigaService.login(username, password);

      user.value = {
        id: response.id,
        username: response.username,
        fullName: response.full_name,
        email: response.email,
        photo: response.photo,
      };

      // Store tokens in cookies
      Cookies.set('auth_token', response.auth_token, {
        expires: 1, // 1 day expiration
        secure: true,
        sameSite: 'Strict',
      });

      Cookies.set('refresh_token', response.refresh, {
        expires: 7, // 7 day expiration
        secure: true,
        sameSite: 'Strict',
      });

      // Store user info in localStorage (non-sensitive data)
      localStorage.setItem('user', JSON.stringify(user.value));
      return true;
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        let errorMessage = '';

        // Case 1: Error with detail format (invalid credentials)
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
        // Case 2, 3, 4: Field validation errors
        else {
          const errorMessages: any = [];

          // Process all existing field errors
          Object.keys(errorData).forEach((field) => {
            if (Array.isArray(errorData[field])) {
              errorMessages.push(`${field}: ${errorData[field].join(', ')}`);
            }
          });

          errorMessage = errorMessages.join('; ');
        }

        toast.error('Login failed', {
          description: errorMessage,
          duration: 5000,
        });
      } else {
        // Handle errors without response.data
        toast.error('Login failed', {
          description: 'An error occurred while connecting to the server',
          duration: 5000,
        });
      }
      console.error('Login failed:', error);
      return false;
    }
  };

  // Method to update token
  const updateToken = (token: string) => {
    Cookies.set('auth_token', token, {
      expires: 1, // 1 day expiration
      secure: true,
      sameSite: 'Strict',
    });
  };

  // Method for logout
  const logout = () => {
    // Clear state
    user.value = null;

    // Remove tokens from cookies
    Cookies.remove('auth_token');
    Cookies.remove('refresh_token');

    // Remove from localStorage
    localStorage.removeItem('user');

    // Navigate to login
    router.push({ name: 'login' });

    toast.info('Logged out', {
      description: 'You have been logged out of your account',
    });
  };

  // Initialize on store creation
  initializeAuth();

  return {
    user,
    isAuthenticated,
    login,
    logout,
    updateToken,
  };
});
