/**
 * Simulation utility functions for managing hotel data
 */

import { STORAGE_KEYS, clearLocalStorage, setStartEmpty } from './localStorage'
import { useGuestsStore } from '@/stores/guests'
import { useReservationsStore } from '@/stores/reservations'
import { useRoomsStore } from '@/stores/rooms'
import { useBillingStore } from '@/stores/billing'
import { useHousekeepingStore } from '@/stores/housekeeping'
import { useActivitiesStore } from '@/stores/activities'

/**
 * Clear all guests and reservations data
 * This allows starting the simulation with no guest or reservation data
 */
export function clearGuestsAndReservations(): void {
  const guestsStore = useGuestsStore()
  const reservationsStore = useReservationsStore()
  
  guestsStore.clearGuests()
  reservationsStore.clearReservations()
}

/**
 * Clear all simulation data (guests, reservations, billing, housekeeping, activities)
 * Rooms are preserved as they are the base inventory
 */
export function clearAllSimulationData(): void {
  const guestsStore = useGuestsStore()
  const reservationsStore = useReservationsStore()
  const billingStore = useBillingStore()
  const housekeepingStore = useHousekeepingStore()
  const activitiesStore = useActivitiesStore()
  
  guestsStore.clearGuests()
  reservationsStore.clearReservations()
  billingStore.clearBilling()
  housekeepingStore.clearHousekeeping()
  activitiesStore.clearActivities()
}

/**
 * Enable starting with empty data on next app load
 * This sets a flag so that when the app loads fresh (no localStorage data),
 * it will start with empty arrays instead of seed data
 */
export function enableStartEmpty(): void {
  setStartEmpty(true)
}

/**
 * Disable starting with empty data (will use seed data on fresh load)
 */
export function disableStartEmpty(): void {
  setStartEmpty(false)
}

/**
 * Clear all localStorage data and set start empty flag
 * This completely resets the simulation to a fresh state
 */
export function resetToEmptyState(): void {
  // Clear all localStorage keys
  Object.values(STORAGE_KEYS).forEach((key) => {
    if (key !== STORAGE_KEYS.START_EMPTY) {
      clearLocalStorage(key)
    }
  })
  
  // Set flag to start empty
  setStartEmpty(true)
  
  // Reload the page to apply changes
  window.location.reload()
}

