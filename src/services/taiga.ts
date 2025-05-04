import { useAuthStore } from '@/stores/auth';
import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

// Create axios instance
const taigaApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor to add the token to the headers if it exists
taigaApi.interceptors.request.use((config) => {
  const auth_token = localStorage.getItem('auth_token');
  if (auth_token) {
    config.headers.Authorization = `Bearer ${auth_token}`;
  }
  return config;
});

// Response interceptor for token refresh
taigaApi.interceptors.response.use(
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
      localStorage.getItem('refresh_token')
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refresh: refreshToken }
        );

        // Update tokens in localStorage and auth store
        const newToken = response.data.auth_token;
        localStorage.setItem('auth_token', newToken);

        // Update the auth store
        const authStore = useAuthStore();
        authStore.updateToken(newToken);

        // Retry the original request with the new token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return taigaApi(originalRequest);
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

export const taigaService = {
  login: async (username: string, password: string) => {
    const response = await taigaApi.post('/auth', {
      username,
      password,
      type: 'normal',
    });
    return response.data;
  },
};
