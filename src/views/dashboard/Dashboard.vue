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
    <h1>haloo {{ authStore.user.username }}</h1>
    <div>
      <Button @click="handleLogout" class="text-white"> Logout </Button>
    </div>
  </div>
</template>
