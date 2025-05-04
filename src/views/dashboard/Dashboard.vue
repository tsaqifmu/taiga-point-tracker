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
        class="border-border rounded-xl border-2"
      />
      <div>
        <h1 class="text-3xl font-bold">haloo {{ authStore.user?.username }}</h1>
      </div>
    </div>
    <div>
      <Button @click="handleLogout" class="text-white"> Logout </Button>
    </div>
  </div>
</template>
