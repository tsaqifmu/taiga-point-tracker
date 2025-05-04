<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
};
</script>

<template>
  <div>this is dashboard page</div>
  <div>
    <Button @click="handleLogout" class="text-white"> Logout </Button>
  </div>
</template>
