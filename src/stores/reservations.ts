import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Reservation, ReservationStatus } from '@/types'
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage, shouldStartEmpty } from '@/utils/localStorage'
import { generateId } from '@/utils/calculations'
import { isDateOverlapping } from '@/utils/dateHelpers'
import reservationsData from '@/data/reservations.json'
import { useRoomsStore } from './rooms'

export const useReservationsStore = defineStore('reservations', () => {
  // If startEmpty flag is set and localStorage is empty, start with empty array
  const defaultReservations = shouldStartEmpty() ? [] : (reservationsData as Reservation[])
  const reservations = ref<Reservation[]>(
    loadFromLocalStorage<Reservation[]>(STORAGE_KEYS.RESERVATIONS, defaultReservations)
  )

  // Computed properties
  const activeReservations = computed(() =>
    reservations.value.filter((r) => r.status === 'Confirmed' || r.status === 'Checked In')
  )
  const checkedInReservations = computed(() =>
    reservations.value.filter((r) => r.status === 'Checked In')
  )
  const confirmedReservations = computed(() =>
    reservations.value.filter((r) => r.status === 'Confirmed')
  )

  // Actions
  function createReservation(reservationData: Omit<Reservation, 'id' | 'createdAt' | 'status'>): Reservation {
    const newReservation: Reservation = {
      ...reservationData,
      id: generateId('RES', reservations.value.map((r) => r.id)),
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    }
    reservations.value.push(newReservation)
    saveToLocalStorage(STORAGE_KEYS.RESERVATIONS, reservations.value)
    return newReservation
  }

  function getReservationById(reservationId: string): Reservation | undefined {
    return reservations.value.find((r) => r.id === reservationId)
  }

  function getReservationsByGuest(guestId: string): Reservation[] {
    return reservations.value.filter((r) => r.guestId === guestId)
  }

  function getReservationsByRoom(roomId: string): Reservation[] {
    return reservations.value.filter((r) => r.roomId === roomId)
  }

  function checkIn(reservationId: string): void {
    const reservation = getReservationById(reservationId)
    if (reservation && reservation.status === 'Confirmed') {
      reservation.status = 'Checked In'
      reservation.checkedInAt = new Date().toISOString()
      
      const roomsStore = useRoomsStore()
      roomsStore.updateRoomStatus(reservation.roomId, 'Occupied')
      
      saveToLocalStorage(STORAGE_KEYS.RESERVATIONS, reservations.value)
    }
  }

  function checkOut(reservationId: string): void {
    const reservation = getReservationById(reservationId)
    if (reservation && reservation.status === 'Checked In') {
      reservation.status = 'Checked Out'
      reservation.checkedOutAt = new Date().toISOString()
      
      const roomsStore = useRoomsStore()
      roomsStore.updateRoomStatus(reservation.roomId, 'Cleaning')
      
      saveToLocalStorage(STORAGE_KEYS.RESERVATIONS, reservations.value)
    }
  }

  function isRoomAvailableForDates(roomId: string, checkIn: string, checkOut: string, excludeReservationId?: string): boolean {
    const conflictingReservations = reservations.value.filter((r) => {
      if (r.id === excludeReservationId) return false
      if (r.status === 'Checked Out' || r.status === 'Cancelled') return false
      return r.roomId === roomId && isDateOverlapping(r.checkIn, r.checkOut, checkIn, checkOut)
    })
    return conflictingReservations.length === 0
  }

  function getAvailableRoomsForDates(checkIn: string, checkOut: string, roomType?: string): string[] {
    const roomsStore = useRoomsStore()
    const allRooms = roomType
      ? roomsStore.getAvailableRoomsByType(roomType)
      : roomsStore.availableRooms

    return allRooms
      .filter((room) => isRoomAvailableForDates(room.id, checkIn, checkOut))
      .map((room) => room.id)
  }

  function updateReservationStatus(reservationId: string, status: ReservationStatus): void {
    const reservation = getReservationById(reservationId)
    if (reservation) {
      reservation.status = status
      saveToLocalStorage(STORAGE_KEYS.RESERVATIONS, reservations.value)
    }
  }

  function shiftRoom(reservationId: string, newRoomId: string, newRoomNumber: string): void {
    const reservation = getReservationById(reservationId)
    if (reservation) {
      const roomsStore = useRoomsStore()
      
      // Free old room if checked in
      if (reservation.status === 'Checked In') {
        roomsStore.updateRoomStatus(reservation.roomId, 'Cleaning')
      }
      
      // Update reservation
      reservation.roomId = newRoomId
      reservation.roomNumber = newRoomNumber
      
      // Occupy new room if checked in
      if (reservation.status === 'Checked In') {
        roomsStore.updateRoomStatus(newRoomId, 'Occupied')
      }
      
      saveToLocalStorage(STORAGE_KEYS.RESERVATIONS, reservations.value)
    }
  }

  function resetReservations() {
    reservations.value = [...(reservationsData as Reservation[])]
    saveToLocalStorage(STORAGE_KEYS.RESERVATIONS, reservations.value)
  }

  function clearReservations() {
    reservations.value = []
    saveToLocalStorage(STORAGE_KEYS.RESERVATIONS, reservations.value)
  }

  return {
    reservations,
    activeReservations,
    checkedInReservations,
    confirmedReservations,
    createReservation,
    getReservationById,
    getReservationsByGuest,
    getReservationsByRoom,
    checkIn,
    checkOut,
    isRoomAvailableForDates,
    getAvailableRoomsForDates,
    updateReservationStatus,
    shiftRoom,
    resetReservations,
    clearReservations
  }
})

