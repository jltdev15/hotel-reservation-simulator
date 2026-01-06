import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { HousekeepingTask, HousekeepingStatus } from '@/types'
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage'
import { generateId } from '@/utils/calculations'
import housekeepingData from '@/data/housekeeping.json'
import { useRoomsStore } from './rooms'

export const useHousekeepingStore = defineStore('housekeeping', () => {
  const tasks = ref<HousekeepingTask[]>(
    loadFromLocalStorage<HousekeepingTask[]>(STORAGE_KEYS.HOUSEKEEPING, housekeepingData as HousekeepingTask[])
  )

  // Computed properties
  const pendingTasks = computed(() => tasks.value.filter((t) => t.status === 'Pending'))
  const inProgressTasks = computed(() => tasks.value.filter((t) => t.status === 'In Progress'))
  const completedTasks = computed(() => tasks.value.filter((t) => t.status === 'Completed'))
  const highPriorityTasks = computed(() => tasks.value.filter((t) => t.priority === 'High'))

  // Actions
  function createTask(taskData: Omit<HousekeepingTask, 'id' | 'createdAt' | 'status'>): HousekeepingTask {
    const newTask: HousekeepingTask = {
      ...taskData,
      id: generateId('HK', tasks.value.map((t) => t.id)),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null
    }
    tasks.value.push(newTask)
    saveToLocalStorage(STORAGE_KEYS.HOUSEKEEPING, tasks.value)
    return newTask
  }

  function getTaskById(taskId: string): HousekeepingTask | undefined {
    return tasks.value.find((t) => t.id === taskId)
  }

  function getTasksByRoom(roomId: string): HousekeepingTask[] {
    return tasks.value.filter((t) => t.roomId === roomId)
  }

  function startTask(taskId: string): void {
    const task = getTaskById(taskId)
    if (task && task.status === 'Pending') {
      task.status = 'In Progress'
      task.startedAt = new Date().toISOString()
      
      const roomsStore = useRoomsStore()
      roomsStore.updateRoomStatus(task.roomId, 'Cleaning')
      
      saveToLocalStorage(STORAGE_KEYS.HOUSEKEEPING, tasks.value)
    }
  }

  function completeTask(taskId: string): void {
    const task = getTaskById(taskId)
    if (task && task.status === 'In Progress') {
      task.status = 'Completed'
      task.completedAt = new Date().toISOString()
      
      const roomsStore = useRoomsStore()
      roomsStore.updateRoomStatus(task.roomId, 'Available')
      
      saveToLocalStorage(STORAGE_KEYS.HOUSEKEEPING, tasks.value)
    }
  }

  function makeRoomAvailable(roomId: string): void {
    const roomsStore = useRoomsStore()
    roomsStore.updateRoomStatus(roomId, 'Available')
    
    // Complete any pending/in-progress tasks for this room
    const roomTasks = getTasksByRoom(roomId)
    roomTasks.forEach((task) => {
      if (task.status !== 'Completed') {
        task.status = 'Completed'
        task.completedAt = new Date().toISOString()
        if (!task.startedAt) {
          task.startedAt = new Date().toISOString()
        }
      }
    })
    
    saveToLocalStorage(STORAGE_KEYS.HOUSEKEEPING, tasks.value)
  }

  function updateTaskStatus(taskId: string, status: HousekeepingStatus): void {
    const task = getTaskById(taskId)
    if (task) {
      task.status = status
      if (status === 'In Progress' && !task.startedAt) {
        task.startedAt = new Date().toISOString()
      }
      if (status === 'Completed' && !task.completedAt) {
        task.completedAt = new Date().toISOString()
      }
      saveToLocalStorage(STORAGE_KEYS.HOUSEKEEPING, tasks.value)
    }
  }

  function resetHousekeeping() {
    tasks.value = [...(housekeepingData as HousekeepingTask[])]
    saveToLocalStorage(STORAGE_KEYS.HOUSEKEEPING, tasks.value)
  }

  function clearHousekeeping() {
    tasks.value = []
    saveToLocalStorage(STORAGE_KEYS.HOUSEKEEPING, tasks.value)
  }

  return {
    tasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    highPriorityTasks,
    createTask,
    getTaskById,
    getTasksByRoom,
    startTask,
    completeTask,
    makeRoomAvailable,
    updateTaskStatus,
    resetHousekeeping,
    clearHousekeeping
  }
})

