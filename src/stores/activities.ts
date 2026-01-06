import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Activity, ActivityStatus } from '@/types'
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage'
import { generateId } from '@/utils/calculations'
import activitiesData from '@/data/activities.json'

export const useActivitiesStore = defineStore('activities', () => {
  const activities = ref<Activity[]>(
    loadFromLocalStorage<Activity[]>(STORAGE_KEYS.ACTIVITIES, activitiesData as Activity[])
  )

  // Computed properties
  const pendingActivities = computed(() => activities.value.filter((a) => a.status === 'Pending'))
  const completedActivities = computed(() => activities.value.filter((a) => a.status === 'Completed'))

  // Actions
  function createActivity(activityData: Omit<Activity, 'id' | 'createdAt' | 'status' | 'completedAt'>): Activity {
    const newActivity: Activity = {
      ...activityData,
      id: generateId('ACT', activities.value.map((a) => a.id)),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    activities.value.push(newActivity)
    saveToLocalStorage(STORAGE_KEYS.ACTIVITIES, activities.value)
    return newActivity
  }

  function getActivityById(activityId: string): Activity | undefined {
    return activities.value.find((a) => a.id === activityId)
  }

  function getActivitiesByReservation(reservationId: string): Activity[] {
    return activities.value.filter((a) => a.reservationId === reservationId)
  }

  function getActivitiesByGuest(guestId: string): Activity[] {
    return activities.value.filter((a) => a.guestId === guestId)
  }

  function completeActivity(activityId: string): void {
    const activity = getActivityById(activityId)
    if (activity && activity.status === 'Pending') {
      activity.status = 'Completed'
      activity.completedAt = new Date().toISOString()
      saveToLocalStorage(STORAGE_KEYS.ACTIVITIES, activities.value)
    }
  }

  function updateActivityStatus(activityId: string, status: ActivityStatus): void {
    const activity = getActivityById(activityId)
    if (activity) {
      activity.status = status
      if (status === 'Completed' && !activity.completedAt) {
        activity.completedAt = new Date().toISOString()
      }
      saveToLocalStorage(STORAGE_KEYS.ACTIVITIES, activities.value)
    }
  }

  function resetActivities() {
    activities.value = [...(activitiesData as Activity[])]
    saveToLocalStorage(STORAGE_KEYS.ACTIVITIES, activities.value)
  }

  function clearActivities() {
    activities.value = []
    saveToLocalStorage(STORAGE_KEYS.ACTIVITIES, activities.value)
  }

  return {
    activities,
    pendingActivities,
    completedActivities,
    createActivity,
    getActivityById,
    getActivitiesByReservation,
    getActivitiesByGuest,
    completeActivity,
    updateActivityStatus,
    resetActivities,
    clearActivities
  }
})

