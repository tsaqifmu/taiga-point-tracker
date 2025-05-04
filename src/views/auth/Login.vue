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

// Composables
const authStore = useAuthStore();

// Methods
const handleLogin = async () => {
  try {
    const success = await authStore.login(username.value, password.value);

    if (success) {
      toast.success('Login berhasil', {
        description: 'Selamat datang kembali!',
        duration: 3000,
      });
      router.push({ name: 'dashboard' });
    }
  } catch (error) {
    toast.error('Terjadi kesalahan', {
      description:
        error instanceof Error ? error.message : 'Silakan coba lagi nanti',
      duration: 5000,
    });
  }
};
</script>

<template>
  <div class="flex h-screen w-full items-center justify-center bg-gray-100">
    <div
      class="flex h-1/2 w-1/3 flex-col justify-center rounded-lg bg-white p-8 shadow-lg"
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
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            v-model="password"
          />
        </div>

        <!-- Submit button -->
        <Button type="submit" class="w-full text-lg font-bold text-white"
          >Login</Button
        >
      </form>
    </div>
  </div>
</template>

<style scoped></style>
