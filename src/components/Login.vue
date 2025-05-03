<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// State
const username = ref('');
const password = ref('');

// Methods
const handleLogin = () => {
  // Handle login logic here
  console.log('Login button clicked', {
    username: username.value,
    password: password.value,
  });
};
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center bg-gray-100">
    <div
      class="w-1/3 h-1/2 bg-white shadow-lg rounded-lg flex flex-col justify-center p-8"
    >
      <h1 class="text-3xl font-bold text-center mb-8">Taiga Point Tracker</h1>
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <!-- Username Field -->
        <div>
          <label for="username">Username</label>
          <Input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter your username"
          />
        </div>

        <!-- Password field -->
        <div>
          <label for="password">Password</label>
          <Input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
          />
        </div>

        <!-- Submit button -->
        <Button type="submit" class="w-full text-white text-lg font-bold"
          >Login</Button
        >
      </form>
    </div>
  </div>
</template>

<style scoped></style>
