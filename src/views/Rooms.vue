<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Rooms Management</h1>
      <p class="mt-2 text-gray-600">View and manage all hotel rooms</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Available</p>
            <p class="text-3xl font-bold text-green-600 mt-2">{{ roomsStore.availableRooms.length }}</p>
          </div>
          <div class="text-4xl opacity-20">✅</div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Occupied</p>
            <p class="text-3xl font-bold text-red-600 mt-2">{{ roomsStore.occupiedRooms.length }}</p>
          </div>
          <div class="text-4xl opacity-20">🛏️</div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Cleaning</p>
            <p class="text-3xl font-bold text-yellow-600 mt-2">{{ roomsStore.cleaningRooms.length }}</p>
          </div>
          <div class="text-4xl opacity-20">🧹</div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Maintenance</p>
            <p class="text-3xl font-bold text-gray-600 mt-2">{{ roomsStore.maintenanceRooms.length }}</p>
          </div>
          <div class="text-4xl opacity-20">🔧</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="status in statusFilters"
            :key="status.value"
            @click="selectedStatus = status.value"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            :class="
              selectedStatus === status.value
                ? status.activeClass
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
          >
            {{ status.label }}
          </button>
        </div>
        <div class="flex gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by room number or type..."
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
          />
          <select
            v-model="selectedRoomType"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Presidential">Presidential</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Rooms Grid -->
    <div v-if="filteredRooms.length > 0">
      <div class="mb-4">
        <h2 class="text-xl font-semibold text-gray-800">
          {{ getStatusLabel(selectedStatus) }} Rooms
          <span class="text-gray-500 text-base font-normal">({{ filteredRooms.length }})</span>
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <RoomCard
          v-for="room in filteredRooms"
          :key="room.id"
          :room="room"
        >
          <div class="mt-4 pt-4 border-t border-gray-200">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Current Guest:</span>
              <span class="font-medium text-gray-800">
                {{ getCurrentGuest(room.id) || 'None' }}
              </span>
            </div>
            <div v-if="getCurrentReservation(room.id)" class="mt-2 text-xs text-gray-500">
              Reservation: {{ getCurrentReservation(room.id) }}
            </div>
          </div>
        </RoomCard>
      </div>
    </div>

    <div v-else class="bg-white rounded-lg shadow-md p-12 text-center">
      <div class="text-6xl mb-4">🏨</div>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">No rooms found</h3>
      <p class="text-gray-600">Try adjusting your filters</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoomsStore } from '@/stores/rooms'
import { useReservationsStore } from '@/stores/reservations'
import { useGuestsStore } from '@/stores/guests'
import RoomCard from '@/components/Rooms/RoomCard.vue'
import type { RoomStatus } from '@/types'

const roomsStore = useRoomsStore()
const reservationsStore = useReservationsStore()
const guestsStore = useGuestsStore()

const selectedStatus = ref<RoomStatus | 'All'>('All')
const searchQuery = ref('')
const selectedRoomType = ref<string>('')

const statusFilters = [
  { value: 'All' as const, label: 'All Rooms', activeClass: 'bg-blue-600 text-white shadow-md' },
  { value: 'Available' as const, label: 'Available', activeClass: 'bg-green-600 text-white shadow-md' },
  { value: 'Occupied' as const, label: 'Occupied', activeClass: 'bg-red-600 text-white shadow-md' },
  { value: 'Cleaning' as const, label: 'Cleaning', activeClass: 'bg-yellow-600 text-white shadow-md' },
  { value: 'Maintenance' as const, label: 'Maintenance', activeClass: 'bg-gray-600 text-white shadow-md' }
]

const filteredRooms = computed(() => {
  let rooms = roomsStore.rooms

  // Filter by status
  if (selectedStatus.value !== 'All') {
    rooms = rooms.filter((room) => room.status === selectedStatus.value)
  }

  // Filter by room type
  if (selectedRoomType.value) {
    rooms = rooms.filter((room) => room.type === selectedRoomType.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    rooms = rooms.filter(
      (room) =>
        room.number.toLowerCase().includes(query) ||
        room.type.toLowerCase().includes(query) ||
        room.floor.toString().includes(query)
    )
  }

  // Sort by room number
  return rooms.sort((a, b) => {
    const numA = parseInt(a.number)
    const numB = parseInt(b.number)
    return numA - numB
  })
})

function getStatusLabel(status: RoomStatus | 'All'): string {
  const labels: Record<string, string> = {
    All: 'All',
    Available: 'Available',
    Occupied: 'Occupied',
    Cleaning: 'Cleaning',
    Maintenance: 'Maintenance'
  }
  return labels[status] || 'All'
}

function getCurrentReservation(roomId: string): string | null {
  const reservation = reservationsStore.reservations.find(
    (r) => r.roomId === roomId && (r.status === 'Checked In' || r.status === 'Confirmed')
  )
  return reservation ? reservation.id : null
}

function getCurrentGuest(roomId: string): string | null {
  const reservation = reservationsStore.reservations.find(
    (r) => r.roomId === roomId && r.status === 'Checked In'
  )
  if (!reservation) return null

  const guest = guestsStore.getGuestById(reservation.guestId)
  if (!guest) return null

  return `${guest.firstName} ${guest.lastName}`
}
</script>

