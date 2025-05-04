import { toast } from 'vue-sonner';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { taigaService } from '@/services/taiga';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<any | null>(null);
  const authToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);

  // Computed
  const isAuthenticated = computed(() => !!authToken.value);

  // Initilaize from local storage
  const initializeAuth = () => {
    const storedAuthToken = localStorage.getItem('auth_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');
    const storedUser = localStorage.getItem('user');

    if (storedAuthToken) authToken.value = storedAuthToken;
    if (storedRefreshToken) refreshToken.value = storedRefreshToken;
    if (storedUser) user.value = JSON.parse(storedUser);
  };

  // Actions
  const login = async (username: string, password: string) => {
    try {
      const response = await taigaService.login(username, password);

      // Set state
      authToken.value = response.auth_token;
      refreshToken.value = response.refresh;
      user.value = {
        id: response.id,
        username: response.username,
        fullName: response.full_name,
        email: response.email,
        photo: response.photo,
      };

      // Store in local storage
      localStorage.setItem('auth_token', response.auth_token);
      localStorage.setItem('refresh_token', response.refresh);
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

  // New method to update token
  const updateToken = (token: string) => {
    authToken.value = token;
    localStorage.setItem('auth_token', token);
  };

  // New method for logout
  const logout = () => {
    // Clear state
    user.value = null;
    authToken.value = null;
    refreshToken.value = null;

    // Remove from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
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
    authToken,
    refreshToken,
    isAuthenticated,
    login,
    logout,
    updateToken,
  };
});
