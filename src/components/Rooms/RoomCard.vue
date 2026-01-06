<template>
  <div
    class="bg-white rounded-lg shadow-md p-4 border-2 transition-all hover:shadow-lg"
    :class="statusClasses"
  >
    <div class="flex justify-between items-start mb-2">
      <div>
        <h3 class="text-lg font-semibold text-gray-800">Room {{ room.number }}</h3>
        <p class="text-sm text-gray-600">{{ room.type }}</p>
      </div>
      <span
        class="px-2 py-1 text-xs font-semibold rounded-full"
        :class="statusBadgeClasses"
      >
        {{ room.status }}
      </span>
    </div>
    <div class="mt-3">
      <p class="text-sm text-gray-600">
        <span class="font-medium">Floor:</span> {{ room.floor }}
      </p>
      <p class="text-sm text-gray-600">
        <span class="font-medium">Rate:</span> ₱{{ room.rate.toLocaleString() }}/night
      </p>
      <p class="text-sm text-gray-600">
        <span class="font-medium">Max Occupancy:</span> {{ room.maxOccupancy }}
      </p>
      <div class="mt-2">
        <p class="text-xs text-gray-500 font-medium mb-1">Amenities:</p>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="amenity in room.amenities"
            :key="amenity"
            class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
          >
            {{ amenity }}
          </span>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Room } from '@/types'

const props = defineProps<{
  room: Room
}>()

const statusClasses = computed(() => {
  const classes: Record<string, string> = {
    Available: 'border-green-300',
    Occupied: 'border-red-300',
    Cleaning: 'border-yellow-300',
    Maintenance: 'border-gray-300'
  }
  return classes[props.room.status] || 'border-gray-300'
})

const statusBadgeClasses = computed(() => {
  const classes: Record<string, string> = {
    Available: 'bg-green-100 text-green-800',
    Occupied: 'bg-red-100 text-red-800',
    Cleaning: 'bg-yellow-100 text-yellow-800',
    Maintenance: 'bg-gray-100 text-gray-800'
  }
  return classes[props.room.status] || 'bg-gray-100 text-gray-800'
})
</script>

