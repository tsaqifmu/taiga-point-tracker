<script setup lang="ts">
import { ref } from 'vue';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLoginMutation } from '@/composable/mutations/useAuthMutation';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icons';

// State
const username = ref('');
const password = ref('');
const showPassword = ref(false);

// Use login mutation
const { mutate: login, isPending } = useLoginMutation();

// Methods
const handleLogin = () => {
  login({
    username: username.value,
    password: password.value,
  });
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
              <EyeIcon v-if="!showPassword" />
              <EyeOffIcon v-else />
            </button>
          </div>
        </div>

        <!-- Submit button -->
        <Button
          type="submit"
          class="w-full text-lg font-bold text-white"
          :disabled="isPending"
          >{{ isPending ? 'Logging in...' : 'Login' }}</Button
        >
      </form>
    </div>
  </div>
</template>
