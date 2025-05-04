import Cookies from 'js-cookie';
import { toast } from 'vue-sonner';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import router from '@/router';
import type { User } from '@/type/user';
// Constants
const AUTH_TOKEN_EXPIRY = 1; // days
const REFRESH_TOKEN_EXPIRY = 7; // days

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  // Computed
  const isAuthenticated = computed(() => !!Cookies.get('auth_token'));

  /**
   * Initializes auth state from localStorage
   */
  const initializeAuth = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  };

  /**
   * Sets user data and stores authentication tokens
   * @param response The authentication response from API
   * @returns boolean indicating success
   */
  const setUserData = (response: any): boolean => {
    console.log('Setting user data:', response);

    user.value = {
      id: response.id,
      username: response.username,
      fullName: response.full_name,
      email: response.email,
      photo: response.big_photo,
      roles: response.roles,
    };

    // Store tokens in cookies
    Cookies.set('auth_token', response.auth_token, {
      expires: AUTH_TOKEN_EXPIRY,
      secure: true,
      sameSite: 'Strict',
    });

    Cookies.set('refresh_token', response.refresh, {
      expires: REFRESH_TOKEN_EXPIRY, // 7 day expiration
      secure: true,
      sameSite: 'Strict',
    });

    // Store user info in localStorage (non-sensitive data)
    localStorage.setItem('user', JSON.stringify(user.value));
    return true;
  };

  /**
   * Updates the authentication token
   * @param token The new token to store
   */
  const updateToken = (token: string) => {
    Cookies.set('auth_token', token, {
      expires: AUTH_TOKEN_EXPIRY,
      secure: true,
      sameSite: 'Strict',
    });
  };

  /**
   * Logs the user out and clears auth state
   * @returns void
   */
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
    logout,
    updateToken,
    setUserData,
  };
});
