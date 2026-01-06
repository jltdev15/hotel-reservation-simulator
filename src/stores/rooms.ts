import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Room, RoomStatus } from '@/types'
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage'
import roomsData from '@/data/rooms.json'

export const useRoomsStore = defineStore('rooms', () => {
  const rooms = ref<Room[]>(loadFromLocalStorage<Room[]>(STORAGE_KEYS.ROOMS, roomsData as Room[]))

  // Computed properties
  const availableRooms = computed(() => rooms.value.filter((r) => r.status === 'Available'))
  const occupiedRooms = computed(() => rooms.value.filter((r) => r.status === 'Occupied'))
  const cleaningRooms = computed(() => rooms.value.filter((r) => r.status === 'Cleaning'))
  const maintenanceRooms = computed(() => rooms.value.filter((r) => r.status === 'Maintenance'))
  
  const totalRooms = computed(() => rooms.value.length)
  const occupancyRate = computed(() => {
    if (totalRooms.value === 0) return 0
    return Math.round((occupiedRooms.value.length / totalRooms.value) * 100)
  })

  // Actions
  function updateRoomStatus(roomId: string, status: RoomStatus) {
    const room = rooms.value.find((r) => r.id === roomId)
    if (room) {
      room.status = status
      saveToLocalStorage(STORAGE_KEYS.ROOMS, rooms.value)
    }
  }

  function getRoomById(roomId: string): Room | undefined {
    return rooms.value.find((r) => r.id === roomId)
  }

  function getRoomByNumber(roomNumber: string): Room | undefined {
    return rooms.value.find((r) => r.number === roomNumber)
  }

  function getAvailableRoomsByType(roomType: string): Room[] {
    return rooms.value.filter((r) => r.type === roomType && r.status === 'Available')
  }

  function isRoomAvailable(roomId: string, checkIn: string, checkOut: string): boolean {
    const room = getRoomById(roomId)
    if (!room || room.status !== 'Available') return false
    
    // Additional check can be done with reservations store
    return true
  }

  function resetRooms() {
    rooms.value = [...(roomsData as Room[])]
    saveToLocalStorage(STORAGE_KEYS.ROOMS, rooms.value)
  }

  return {
    rooms,
    availableRooms,
    occupiedRooms,
    cleaningRooms,
    maintenanceRooms,
    totalRooms,
    occupancyRate,
    updateRoomStatus,
    getRoomById,
    getRoomByNumber,
    getAvailableRoomsByType,
    isRoomAvailable,
    resetRooms
  }
})

