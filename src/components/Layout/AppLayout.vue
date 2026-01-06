<template>
  <div class="min-h-screen bg-gray-50 flex">
    <NavBar />
    <main class="flex-1 lg:ml-64 transition-all duration-300 py-6 px-4 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore - Vue SFC with script setup auto-exports
import NavBar from './NavBar.vue'
</script>

