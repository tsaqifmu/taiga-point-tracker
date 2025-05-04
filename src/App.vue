<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
</script>

<template>
  <Toaster />
  <RouterView />
  <VueQueryDevtools />
</template>

<style scoped></style>
