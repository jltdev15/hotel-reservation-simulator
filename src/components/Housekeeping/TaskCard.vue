<template>
  <div class="bg-white rounded-lg shadow-md p-4 border-l-4" :class="priorityBorderClass">
    <div class="flex justify-between items-start mb-2">
      <div>
        <h3 class="text-lg font-semibold text-gray-800">Room {{ task.roomNumber }}</h3>
        <p class="text-sm text-gray-600">{{ task.taskType }}</p>
      </div>
      <div class="flex flex-col items-end space-y-1">
        <span
          class="px-2 py-1 text-xs font-semibold rounded-full"
          :class="statusBadgeClasses"
        >
          {{ task.status }}
        </span>
        <span
          class="px-2 py-1 text-xs font-semibold rounded-full"
          :class="priorityBadgeClasses"
        >
          {{ task.priority }}
        </span>
      </div>
    </div>
    <div class="mt-3">
      <p class="text-sm text-gray-600">
        <span class="font-medium">Assigned to:</span> {{ task.assignedTo }}
      </p>
      <p v-if="task.startedAt" class="text-sm text-gray-600">
        <span class="font-medium">Started:</span> {{ formatDateTime(task.startedAt) }}
      </p>
      <p v-if="task.completedAt" class="text-sm text-gray-600">
        <span class="font-medium">Completed:</span> {{ formatDateTime(task.completedAt) }}
      </p>
      <p v-if="task.notes" class="text-sm text-gray-600 mt-2">
        <span class="font-medium">Notes:</span> {{ task.notes }}
      </p>
    </div>
    <div v-if="showActions" class="mt-4 flex space-x-2">
      <button
        v-if="task.status === 'Pending'"
        @click="$emit('start')"
        class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Start Task
      </button>
      <button
        v-if="task.status === 'In Progress'"
        @click="$emit('complete')"
        class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
      >
        Complete Task
      </button>
      <button
        v-if="task.status === 'In Progress' || task.status === 'Pending'"
        @click="$emit('makeAvailable')"
        class="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Make Available
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { HousekeepingTask } from '@/types'
import { formatDateTime } from '@/utils/dateHelpers'

const props = defineProps<{
  task: HousekeepingTask
  showActions?: boolean
}>()

defineEmits<{
  start: []
  complete: []
  makeAvailable: []
}>()

const priorityBorderClass = computed(() => {
  const classes: Record<string, string> = {
    High: 'border-red-500',
    Medium: 'border-yellow-500',
    Low: 'border-green-500'
  }
  return classes[props.task.priority] || 'border-gray-500'
})

const statusBadgeClasses = computed(() => {
  const classes: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800'
  }
  return classes[props.task.status] || 'bg-gray-100 text-gray-800'
})

const priorityBadgeClasses = computed(() => {
  const classes: Record<string, string> = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800'
  }
  return classes[props.task.priority] || 'bg-gray-100 text-gray-800'
})
</script>

