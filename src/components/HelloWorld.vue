<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <Button class="bg-red-400 w-2xl text-white">Nganu baru testing testing aja</Button>
    
  </div>

  
</template>

<style scoped>

</style>
