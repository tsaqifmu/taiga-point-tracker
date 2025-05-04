<script setup lang="ts">
import { ref } from 'vue';
import { toast } from 'vue-sonner';

import router from '@/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth';

// State
const username = ref('');
const password = ref('');
const showPassword = ref(false);

// Composables
const authStore = useAuthStore();

// Methods
const handleLogin = async () => {
  try {
    const success = await authStore.login(username.value, password.value);

    if (success) {
      toast.success('Login successful', {
        description: 'Welcome back!',
        duration: 3000,
      });
      router.push({ name: 'dashboard' });
    }
  } catch (error) {
    toast.error('An error occurred', {
      description:
        error instanceof Error ? error.message : 'Please try again later',
      duration: 5000,
    });
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div
    class="flex h-screen w-full items-center justify-center bg-white bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] px-5"
  >
    <div
      class="shadow-shadow border-border flex h-1/2 w-100 flex-col justify-center rounded-lg border-2 bg-white p-8"
    >
      <h1 class="mb-8 text-center text-3xl font-bold">Taiga Point Tracker</h1>
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <!-- Username Field -->
        <div>
          <label for="username">Username</label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            v-model="username"
          />
        </div>

        <!-- Password field -->
        <div>
          <label for="password">Password</label>
          <div class="relative">
            <Input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              v-model="password"
              class="pr-10"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <!-- Show password icon when password is hidden -->
              <svg
                v-if="!showPassword"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <!-- Hide password icon when password is shown -->
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Submit button -->
        <Button type="submit" class="w-full text-lg font-bold text-white"
          >Login</Button
        >
      </form>
    </div>
  </div>
</template>
