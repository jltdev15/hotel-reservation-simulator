import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Guest } from '@/types'
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage, shouldStartEmpty } from '@/utils/localStorage'
import { generateId } from '@/utils/calculations'
import guestsData from '@/data/guests.json'

export const useGuestsStore = defineStore('guests', () => {
  // If startEmpty flag is set and localStorage is empty, start with empty array
  const defaultGuests = shouldStartEmpty() ? [] : (guestsData as Guest[])
  const guests = ref<Guest[]>(loadFromLocalStorage<Guest[]>(STORAGE_KEYS.GUESTS, defaultGuests))

  // Computed properties
  const totalGuests = computed(() => guests.value.length)

  // Actions
  function getGuestById(guestId: string): Guest | undefined {
    return guests.value.find((g) => g.id === guestId)
  }

  function searchGuests(query: string): Guest[] {
    const lowerQuery = query.toLowerCase()
    return guests.value.filter(
      (g) =>
        g.firstName.toLowerCase().includes(lowerQuery) ||
        g.lastName.toLowerCase().includes(lowerQuery) ||
        g.email.toLowerCase().includes(lowerQuery) ||
        g.phone.includes(query) ||
        g.idNumber.includes(query)
    )
  }

  function createGuest(guestData: Omit<Guest, 'id' | 'createdAt' | 'loyaltyPoints'>): Guest {
    const newGuest: Guest = {
      ...guestData,
      id: generateId('G', guests.value.map((g) => g.id)),
      loyaltyPoints: 0,
      createdAt: new Date().toISOString()
    }
    guests.value.push(newGuest)
    saveToLocalStorage(STORAGE_KEYS.GUESTS, guests.value)
    return newGuest
  }

  function updateGuest(guestId: string, updates: Partial<Guest>): void {
    const index = guests.value.findIndex((g) => g.id === guestId)
    if (index !== -1) {
      guests.value[index] = { ...guests.value[index], ...updates } as Guest
      saveToLocalStorage(STORAGE_KEYS.GUESTS, guests.value)
    }
  }

  function addLoyaltyPoints(guestId: string, points: number): void {
    const guest = getGuestById(guestId)
    if (guest) {
      guest.loyaltyPoints += points
      saveToLocalStorage(STORAGE_KEYS.GUESTS, guests.value)
    }
  }

  function resetGuests() {
    guests.value = [...(guestsData as Guest[])]
    saveToLocalStorage(STORAGE_KEYS.GUESTS, guests.value)
  }

  function clearGuests() {
    guests.value = []
    saveToLocalStorage(STORAGE_KEYS.GUESTS, guests.value)
  }

  return {
    guests,
    totalGuests,
    getGuestById,
    searchGuests,
    createGuest,
    updateGuest,
    addLoyaltyPoints,
    resetGuests,
    clearGuests
  }
})

