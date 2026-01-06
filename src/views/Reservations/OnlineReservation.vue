<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Online Booking</h1>
      <p class="mt-2 text-gray-600">Book a room online</p>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Guest Information</h2>
          <GuestForm
            :guest="guestData"
            @submit="handleGuestSubmit"
            @cancel="handleGuestCancel"
            submit-label="Continue"
          />
        </div>

        <div v-if="guestData.firstName" class="border-t pt-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Reservation Details</h2>
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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Room Type Preference
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

          <div v-if="availableRooms.length > 0" class="mt-4">
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
                <p class="text-xs text-gray-500 mt-2">
                  Max: {{ room.maxOccupancy }} guests
                </p>
              </div>
            </div>
          </div>
          <div v-else-if="reservationData.checkIn && reservationData.checkOut" class="mt-4 text-yellow-600">
            No available rooms for the selected dates
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Special Requests
            </label>
            <textarea
              v-model="reservationData.specialRequests"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div v-if="guestData.firstName" class="flex justify-end space-x-3 pt-4 border-t">
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
            Book Now
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

const guestData = ref<Partial<Guest>>({})
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

function handleGuestSubmit(data: Omit<Guest, 'id' | 'createdAt' | 'loyaltyPoints'>) {
  guestData.value = data
}

function handleGuestCancel() {
  guestData.value = {}
}

function handleSubmit() {
  if (!guestData.value.firstName || !reservationData.value.roomId) return

  const newGuest = guestsStore.createGuest(guestData.value as Omit<Guest, 'id' | 'createdAt' | 'loyaltyPoints'>)

  const checkInISO = new Date(reservationData.value.checkIn).toISOString()
  const checkOutISO = new Date(reservationData.value.checkOut).toISOString()

  const reservation = reservationsStore.createReservation({
    guestId: newGuest.id,
    roomId: reservationData.value.roomId,
    roomNumber: reservationData.value.roomNumber,
    checkIn: checkInISO,
    checkOut: checkOutISO,
    adults: reservationData.value.adults,
    children: reservationData.value.children,
    source: 'Online',
    specialRequests: reservationData.value.specialRequests
  })

  alert(`Reservation ${reservation.id} created successfully!`)
  router.push('/')
}
</script>

