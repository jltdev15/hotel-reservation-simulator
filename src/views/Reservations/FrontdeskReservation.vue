<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Frontdesk Reservation</h1>
      <p class="mt-2 text-gray-600">Create a new reservation at the front desk</p>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Guest Information</h2>
      <GuestForm
        v-if="!selectedGuest"
        @submit="handleGuestSubmit"
        @cancel="handleGuestCancel"
        submit-label="Continue"
      />
      <div v-else class="space-y-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="font-semibold text-gray-800">
            {{ selectedGuest.firstName }} {{ selectedGuest.lastName }}
          </p>
          <p class="text-sm text-gray-600">{{ selectedGuest.email }}</p>
          <p class="text-sm text-gray-600">{{ selectedGuest.phone }}</p>
        </div>
        <button
          @click="selectedGuest = null"
          class="text-sm text-blue-600 hover:text-blue-800"
        >
          Change Guest
        </button>
      </div>
    </div>

    <div v-if="selectedGuest" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Reservation Details</h2>
      <form @submit.prevent="handleReservationSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Check-in Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="reservationData.checkIn"
              type="datetime-local"
              required
              :min="minDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Check-out Date <span class="text-red-500">*</span>
            </label>
            <input
              v-model="reservationData.checkOut"
              type="datetime-local"
              required
              :min="reservationData.checkIn || minDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Adults <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="reservationData.adults"
              type="number"
              min="1"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Children
            </label>
            <input
              v-model.number="reservationData.children"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Room Type
          </label>
          <select
            v-model="selectedRoomType"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Presidential">Presidential</option>
          </select>
        </div>

        <div v-if="availableRooms.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Select Room <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="room in availableRooms"
              :key="room.id"
              @click="reservationData.roomId = room.id; reservationData.roomNumber = room.number"
              class="p-4 border-2 rounded-lg cursor-pointer transition-all"
              :class="
                reservationData.roomId === room.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              "
            >
              <p class="font-semibold">Room {{ room.number }}</p>
              <p class="text-sm text-gray-600">{{ room.type }}</p>
              <p class="text-sm font-medium text-gray-800">₱{{ room.rate.toLocaleString() }}/night</p>
            </div>
          </div>
        </div>
        <div v-else-if="reservationData.checkIn && reservationData.checkOut" class="text-yellow-600">
          No available rooms for the selected dates
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Special Requests
          </label>
          <textarea
            v-model="reservationData.specialRequests"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="$router.push('/')"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!reservationData.roomId"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Create Reservation
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGuestsStore } from '@/stores/guests'
import { useReservationsStore } from '@/stores/reservations'
import { useRoomsStore } from '@/stores/rooms'
import GuestForm from '@/components/Guests/GuestForm.vue'
import type { Guest } from '@/types'

const router = useRouter()
const guestsStore = useGuestsStore()
const reservationsStore = useReservationsStore()
const roomsStore = useRoomsStore()

const selectedGuest = ref<Guest | null>(null)
const selectedRoomType = ref<string>('')

const reservationData = ref({
  checkIn: '',
  checkOut: '',
  adults: 1,
  children: 0,
  roomId: '',
  roomNumber: '',
  specialRequests: null as string | null
})

const minDate = new Date().toISOString().slice(0, 16)

const availableRooms = computed(() => {
  if (!reservationData.value.checkIn || !reservationData.value.checkOut) {
    return []
  }

  const checkInISO = new Date(reservationData.value.checkIn).toISOString()
  const checkOutISO = new Date(reservationData.value.checkOut).toISOString()
  
  const availableRoomIds = reservationsStore.getAvailableRoomsForDates(
    checkInISO,
    checkOutISO,
    selectedRoomType.value || undefined
  )

  return roomsStore.rooms
    .filter((room) => availableRoomIds.includes(room.id))
    .filter((room) => !selectedRoomType.value || room.type === selectedRoomType.value)
})

watch([() => reservationData.value.checkIn, () => reservationData.value.checkOut], () => {
  reservationData.value.roomId = ''
  reservationData.value.roomNumber = ''
})

function handleGuestSubmit(guestData: Omit<Guest, 'id' | 'createdAt' | 'loyaltyPoints'>) {
  const newGuest = guestsStore.createGuest(guestData)
  selectedGuest.value = newGuest
}

function handleGuestCancel() {
  // Do nothing, stay on form
}

function handleReservationSubmit() {
  if (!selectedGuest.value || !reservationData.value.roomId) return

  const checkInISO = new Date(reservationData.value.checkIn).toISOString()
  const checkOutISO = new Date(reservationData.value.checkOut).toISOString()

  const reservation = reservationsStore.createReservation({
    guestId: selectedGuest.value.id,
    roomId: reservationData.value.roomId,
    roomNumber: reservationData.value.roomNumber,
    checkIn: checkInISO,
    checkOut: checkOutISO,
    adults: reservationData.value.adults,
    children: reservationData.value.children,
    source: 'Frontdesk',
    specialRequests: reservationData.value.specialRequests
  })

  alert(`Reservation ${reservation.id} created successfully!`)
  router.push('/')
}
</script>

