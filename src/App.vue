<script setup lang="ts">
import { RouterView } from 'vue-router'
// @ts-ignore - Vue SFC with script setup auto-exports
import AppLayout from './components/Layout/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>

<style scoped></style>
