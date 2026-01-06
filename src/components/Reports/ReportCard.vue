<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
      <div v-if="icon" class="text-3xl">{{ icon }}</div>
    </div>
    <div class="text-3xl font-bold text-blue-600 mb-2">{{ value }}</div>
    <p v-if="subtitle" class="text-sm text-gray-600">{{ subtitle }}</p>
    <div v-if="trend !== undefined" class="mt-2">
      <span
        class="text-sm font-medium"
        :class="trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'"
      >
        {{ trend > 0 ? '↑' : trend < 0 ? '↓' : '→' }} {{ Math.abs(trend) }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  subtitle?: string
  icon?: string
  trend?: number
}>()
</script>

