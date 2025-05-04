<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
};
</script>

<template>
  <div class="p-6">
    <div class="flex gap-x-6">
      <img
        :src="authStore.user?.photo ?? undefined"
        alt="photo profle"
        class="border-border shadow-shadow rounded-xl border-2"
      />
      <div>
        <h1 class="text-3xl font-bold">haloo {{ authStore.user?.username }}</h1>
        <Button @click="handleLogout" class="mt-5 text-white"> Logout </Button>
      </div>
    </div>
    <div></div>
  </div>
</template>
