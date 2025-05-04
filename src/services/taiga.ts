import Cookies from 'js-cookie';
import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

import { useAuthStore } from '@/stores/auth';

/**
 * Creates and configures the Axios instance for Taiga API communication
 */
const createTaigaApi = () => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Request interceptor to add the token to the headers if it exists
  instance.interceptors.request.use((config) => {
    const auth_token = Cookies.get('auth_token');
    if (auth_token) {
      config.headers.Authorization = `Bearer ${auth_token}`;
    }
    return config;
  });

  // Response interceptor for token refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // Only attempt refresh if:
      // 1. Response is 401 (Unauthorized)
      // 2. This request hasn't been retried yet
      // 3. We have a refresh token
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        Cookies.get('refresh_token')
      ) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh the token
          const refreshToken = Cookies.get('refresh_token');
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            { refresh: refreshToken }
          );

          // Update the auth store
          const newToken = response.data.auth_token;
          const authStore = useAuthStore();
          authStore.updateToken(newToken);

          //! Kayaknya kode dibawah ngga perlu, karena kita udah set di function updateToken
          // Cookies.set('auth_token', newToken, {
          //   expires: 1, // 1 day expiration
          //   secure: true,
          //   sameSite: 'Strict',
          // });

          // Retry the original request with the new token
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return instance(originalRequest);
        } catch (refreshError) {
          // If refresh fails, log the user out
          const authStore = useAuthStore();
          authStore.logout();

          // Return the original error
          return Promise.reject(error);
        }
      }

      // If not a 401 or token refresh failed, reject with the original error
      return Promise.reject(error);
    }
  );

  return instance;
};

export const taigaApi = createTaigaApi();
