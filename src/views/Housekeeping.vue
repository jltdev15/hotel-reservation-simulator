<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Housekeeping</h1>
      <p class="mt-2 text-gray-600">Manage cleaning tasks and room status</p>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Create New Task</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Room <span class="text-red-500">*</span>
            </label>
            <select
              v-model="taskData.roomId"
              required
              @change="onRoomChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Room</option>
              <option
                v-for="room in roomsStore.rooms"
                :key="room.id"
                :value="room.id"
              >
                Room {{ room.number }} - {{ room.type }} ({{ room.status }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Task Type <span class="text-red-500">*</span>
            </label>
            <select
              v-model="taskData.taskType"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Task Type</option>
              <option value="Checkout Cleaning">Checkout Cleaning</option>
              <option value="Daily Cleaning">Daily Cleaning</option>
              <option value="Deep Cleaning">Deep Cleaning</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Assigned To <span class="text-red-500">*</span>
            </label>
            <input
              v-model="taskData.assignedTo"
              type="text"
              required
              placeholder="e.g., Housekeeper A"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Priority <span class="text-red-500">*</span>
            </label>
            <select
              v-model="taskData.priority"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            v-model="taskData.notes"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Pending Tasks</h3>
        <div class="space-y-4">
          <TaskCard
            v-for="task in housekeepingStore.pendingTasks"
            :key="task.id"
            :task="task"
            :show-actions="true"
            @start="handleStartTask(task.id)"
            @complete="handleCompleteTask(task.id)"
            @make-available="handleMakeAvailable(task.roomId)"
          />
          <div v-if="housekeepingStore.pendingTasks.length === 0" class="text-gray-600 text-center py-4">
            No pending tasks
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">In Progress</h3>
        <div class="space-y-4">
          <TaskCard
            v-for="task in housekeepingStore.inProgressTasks"
            :key="task.id"
            :task="task"
            :show-actions="true"
            @complete="handleCompleteTask(task.id)"
            @make-available="handleMakeAvailable(task.roomId)"
          />
          <div v-if="housekeepingStore.inProgressTasks.length === 0" class="text-gray-600 text-center py-4">
            No tasks in progress
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Completed</h3>
        <div class="space-y-4">
          <TaskCard
            v-for="task in recentCompletedTasks"
            :key="task.id"
            :task="task"
            :show-actions="false"
          />
          <div v-if="recentCompletedTasks.length === 0" class="text-gray-600 text-center py-4">
            No completed tasks
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Room Status Overview</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="room in roomsStore.rooms"
          :key="room.id"
          class="p-4 border-2 rounded-lg"
          :class="getRoomStatusClass(room.status)"
        >
          <div class="flex justify-between items-start mb-2">
            <h4 class="font-semibold text-gray-800">Room {{ room.number }}</h4>
            <span
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="getStatusBadgeClass(room.status)"
            >
              {{ room.status }}
            </span>
          </div>
          <p class="text-sm text-gray-600">{{ room.type }}</p>
          <button
            v-if="room.status === 'Cleaning'"
            @click="handleMakeAvailable(room.id)"
            class="mt-2 w-full px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Make Available
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHousekeepingStore } from '@/stores/housekeeping'
import { useRoomsStore } from '@/stores/rooms'
import TaskCard from '@/components/Housekeeping/TaskCard.vue'
import type { HousekeepingTask } from '@/types'

const housekeepingStore = useHousekeepingStore()
const roomsStore = useRoomsStore()

const taskData = ref({
  roomId: '',
  roomNumber: '',
  taskType: '' as HousekeepingTask['taskType'],
  assignedTo: '',
  priority: '' as HousekeepingTask['priority'],
  notes: ''
})

const recentCompletedTasks = computed(() => {
  return [...housekeepingStore.completedTasks]
    .sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0
      return dateB - dateA
    })
    .slice(0, 5)
})

function getRoomStatusClass(status: string): string {
  const classes: Record<string, string> = {
    Available: 'border-green-300 bg-green-50',
    Occupied: 'border-red-300 bg-red-50',
    Cleaning: 'border-yellow-300 bg-yellow-50',
    Maintenance: 'border-gray-300 bg-gray-50'
  }
  return classes[status] || 'border-gray-300'
}

function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    Available: 'bg-green-100 text-green-800',
    Occupied: 'bg-red-100 text-red-800',
    Cleaning: 'bg-yellow-100 text-yellow-800',
    Maintenance: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function onRoomChange() {
  const room = roomsStore.getRoomById(taskData.value.roomId)
  if (room) {
    taskData.value.roomNumber = room.number
  }
}

function handleSubmit() {
  const newTask = housekeepingStore.createTask({
    roomId: taskData.value.roomId,
    roomNumber: taskData.value.roomNumber,
    taskType: taskData.value.taskType,
    assignedTo: taskData.value.assignedTo,
    priority: taskData.value.priority,
    notes: taskData.value.notes
  })

  alert(`Task ${newTask.id} created successfully!`)
  resetForm()
}

function resetForm() {
  taskData.value = {
    roomId: '',
    roomNumber: '',
    taskType: '' as HousekeepingTask['taskType'],
    assignedTo: '',
    priority: '' as HousekeepingTask['priority'],
    notes: ''
  }
}

function handleStartTask(taskId: string) {
  housekeepingStore.startTask(taskId)
  alert('Task started!')
}

function handleCompleteTask(taskId: string) {
  housekeepingStore.completeTask(taskId)
  alert('Task completed!')
}

function handleMakeAvailable(roomId: string) {
  if (confirm('Make this room available?')) {
    housekeepingStore.makeRoomAvailable(roomId)
    alert('Room is now available!')
  }
}
</script>

