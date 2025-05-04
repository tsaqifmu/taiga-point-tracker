import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

import { taigaApi } from '@/services/taiga';
import { useAuthStore } from '@/stores/auth';
import { useMutation } from '@tanstack/vue-query';

interface LoginCredentials {
  username: string;
  password: string;
}

export const useLoginMutation = () => {
  const router = useRouter();
  const authStore = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await taigaApi.post('/auth', {
        username: credentials.username,
        password: credentials.password,
        type: 'normal',
      });
      return data;
    },
    onSuccess: (data) => {
      // Use the existing authStore functionality to handle token storage
      authStore.setUserData(data);

      toast.success('Login successful', {
        description: 'Welcome back!',
        duration: 3000,
      });

      router.push({ name: 'dashboard' });
      return data;
    },

    onError: (error: any) => {
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
    },
  });
};
