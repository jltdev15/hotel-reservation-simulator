<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Room Shifting</h1>
      <p class="mt-2 text-gray-600">Transfer guests to different rooms</p>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Select Reservation</h2>
      <div class="flex gap-4 mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by Reservation ID, Guest Name, or Room Number"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="searchReservations"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <div v-if="selectedReservation" class="bg-blue-50 p-4 rounded-lg mb-4">
        <h3 class="font-semibold text-gray-800 mb-2">Current Reservation</h3>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span class="text-gray-600">Reservation ID:</span>
            <span class="font-medium ml-2">{{ selectedReservation.id }}</span>
          </div>
          <div>
            <span class="text-gray-600">Guest:</span>
            <span class="font-medium ml-2">{{ getGuestName(selectedReservation.guestId) }}</span>
          </div>
          <div>
            <span class="text-gray-600">Current Room:</span>
            <span class="font-medium ml-2">{{ selectedReservation.roomNumber }}</span>
          </div>
          <div>
            <span class="text-gray-600">Status:</span>
            <span class="font-medium ml-2">{{ selectedReservation.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedReservation" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Select New Room</h2>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Room Type Filter
        </label>
        <select
          v-model="selectedRoomType"
          class="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="Standard">Standard</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Suite">Suite</option>
          <option value="Presidential">Presidential</option>
        </select>
      </div>

      <div v-if="availableRooms.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RoomCard
          v-for="room in availableRooms"
          :key="room.id"
          :room="room"
        >
          <button
            @click="selectNewRoom(room.id, room.number)"
            class="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Select Room {{ room.number }}
          </button>
        </RoomCard>
      </div>
      <div v-else class="text-yellow-600 text-center py-4">
        No available rooms matching the criteria
      </div>

      <div v-if="newRoomId" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 class="font-semibold text-gray-800 mb-2">Ready to Shift</h3>
        <p class="text-sm text-gray-600 mb-4">
          Move guest from Room {{ selectedReservation.roomNumber }} to Room {{ newRoomNumber }}
        </p>
        <div class="flex space-x-3">
          <button
            @click="handleRoomShift"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Confirm Room Shift
          </button>
          <button
            @click="cancelShift"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="searchQuery && filteredReservations.length === 0" class="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
      No reservations found matching your search
    </div>

    <div v-else-if="!searchQuery" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Active Reservations</h2>
      <div v-if="activeReservations.length > 0" class="space-y-4">
        <div
          v-for="reservation in activeReservations"
          :key="reservation.id"
          class="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 cursor-pointer"
          @click="selectReservation(reservation.id)"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="font-semibold text-gray-800">{{ reservation.id }}</p>
              <p class="text-sm text-gray-600">{{ getGuestName(reservation.guestId) }}</p>
              <p class="text-sm text-gray-600">Room {{ reservation.roomNumber }}</p>
            </div>
            <button
              @click.stop="selectReservation(reservation.id)"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Shift Room
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-600 text-center py-4">
        No active reservations
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useReservationsStore } from '@/stores/reservations'
import { useGuestsStore } from '@/stores/guests'
import { useRoomsStore } from '@/stores/rooms'
import RoomCard from '@/components/Rooms/RoomCard.vue'

const reservationsStore = useReservationsStore()
const guestsStore = useGuestsStore()
const roomsStore = useRoomsStore()

const searchQuery = ref('')
const filteredReservations = ref<typeof reservationsStore.reservations>([])
const selectedReservation = ref<typeof reservationsStore.reservations[0] | null>(null)
const selectedRoomType = ref<string>('')
const newRoomId = ref<string>('')
const newRoomNumber = ref<string>('')

const activeReservations = computed(() => {
  return reservationsStore.activeReservations.filter((r) => r.status === 'Checked In')
})

const availableRooms = computed(() => {
  if (!selectedReservation.value) return []

  const rooms = roomsStore.availableRooms.filter((room) => {
    // Exclude current room
    if (room.id === selectedReservation.value!.roomId) return false
    
    // Filter by type if selected
    if (selectedRoomType.value && room.type !== selectedRoomType.value) return false
    
    // Check availability for reservation dates
    return reservationsStore.isRoomAvailableForDates(
      room.id,
      selectedReservation.value.checkIn,
      selectedReservation.value.checkOut,
      selectedReservation.value.id
    )
  })

  return rooms
})

function getGuestName(guestId: string): string {
  const guest = guestsStore.getGuestById(guestId)
  if (!guest) return 'N/A'
  return `${guest.firstName} ${guest.lastName}`
}

function searchReservations() {
  if (!searchQuery.value.trim()) {
    filteredReservations.value = []
    return
  }

  const query = searchQuery.value.toLowerCase()
  filteredReservations.value = activeReservations.value.filter((r) => {
    if (r.id.toLowerCase().includes(query)) return true
    if (r.roomNumber.toLowerCase().includes(query)) return true
    
    const guest = guestsStore.getGuestById(r.guestId)
    if (guest) {
      if (guest.firstName.toLowerCase().includes(query)) return true
      if (guest.lastName.toLowerCase().includes(query)) return true
    }
    
    return false
  })
}

function selectReservation(reservationId: string) {
  const reservation = reservationsStore.getReservationById(reservationId)
  if (reservation) {
    selectedReservation.value = reservation
    newRoomId.value = ''
    newRoomNumber.value = ''
  }
}

function selectNewRoom(roomId: string, roomNumber: string) {
  newRoomId.value = roomId
  newRoomNumber.value = roomNumber
}

function handleRoomShift() {
  if (!selectedReservation.value || !newRoomId.value) return

  if (confirm(`Confirm shifting guest from Room ${selectedReservation.value.roomNumber} to Room ${newRoomNumber.value}?`)) {
    reservationsStore.shiftRoom(selectedReservation.value.id, newRoomId.value, newRoomNumber.value)
    alert('Room shift completed successfully!')
    selectedReservation.value = null
    newRoomId.value = ''
    newRoomNumber.value = ''
    searchQuery.value = ''
  }
}

function cancelShift() {
  newRoomId.value = ''
  newRoomNumber.value = ''
}
</script>

