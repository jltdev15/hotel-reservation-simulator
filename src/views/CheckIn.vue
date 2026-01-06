<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Guest Check-in</h1>
      <p class="mt-2 text-gray-600">Process guest check-in and assign rooms</p>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Search Reservation</h2>
      <div class="flex gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by Reservation ID, Guest Name, or Email"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="searchReservations"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </div>

    <div v-if="filteredReservations.length > 0" class="space-y-4">
      <div
        v-for="reservation in filteredReservations"
        :key="reservation.id"
        class="bg-white rounded-lg shadow-md p-6"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Reservation {{ reservation.id }}</h3>
            <p class="text-sm text-gray-600">
              Guest: {{ getGuestName(reservation.guestId) }}
            </p>
            <p class="text-sm text-gray-600">
              Room: {{ reservation.roomNumber }}
            </p>
            <p class="text-sm text-gray-600">
              Check-in: {{ formatDateTime(reservation.checkIn) }}
            </p>
            <p class="text-sm text-gray-600">
              Check-out: {{ formatDateTime(reservation.checkOut) }}
            </p>
          </div>
          <span
            class="px-3 py-1 text-sm font-semibold rounded-full"
            :class="getStatusClass(reservation.status)"
          >
            {{ reservation.status }}
          </span>
        </div>

        <div v-if="reservation.status === 'Confirmed'" class="flex space-x-3">
          <button
            @click="handleCheckIn(reservation.id)"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Check In
          </button>
          <button
            @click="viewReservationDetails(reservation.id)"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            View Details
          </button>
        </div>
        <div v-else-if="reservation.status === 'Checked In'" class="text-green-600 font-medium">
          Already checked in on {{ formatDateTime(reservation.checkedInAt) }}
        </div>
      </div>
    </div>

    <div v-else-if="searchQuery" class="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
      No reservations found matching your search
    </div>

    <div v-else class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Confirmed Reservations (Today)</h2>
      <div v-if="todayReservations.length > 0" class="space-y-4">
        <div
          v-for="reservation in todayReservations"
          :key="reservation.id"
          class="border-l-4 border-blue-500 pl-4 py-2"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="font-semibold text-gray-800">{{ reservation.id }}</p>
              <p class="text-sm text-gray-600">{{ getGuestName(reservation.guestId) }}</p>
              <p class="text-sm text-gray-600">Room {{ reservation.roomNumber }}</p>
            </div>
            <button
              @click="handleCheckIn(reservation.id)"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              Check In
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-600 text-center py-4">
        No confirmed reservations for today
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useReservationsStore } from '@/stores/reservations'
import { useGuestsStore } from '@/stores/guests'
import { formatDateTime } from '@/utils/dateHelpers'

const router = useRouter()
const reservationsStore = useReservationsStore()
const guestsStore = useGuestsStore()

const searchQuery = ref('')
const filteredReservations = ref<typeof reservationsStore.reservations>([])

const todayReservations = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return reservationsStore.confirmedReservations.filter((r) => {
    const checkInDate = new Date(r.checkIn).toISOString().split('T')[0]
    return checkInDate === today
  })
})

function getGuestName(guestId: string): string {
  const guest = guestsStore.getGuestById(guestId)
  if (!guest) return 'N/A'
  return `${guest.firstName} ${guest.lastName}`
}

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    Confirmed: 'bg-blue-100 text-blue-800',
    'Checked In': 'bg-green-100 text-green-800',
    'Checked Out': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function searchReservations() {
  if (!searchQuery.value.trim()) {
    filteredReservations.value = []
    return
  }

  const query = searchQuery.value.toLowerCase()
  filteredReservations.value = reservationsStore.reservations.filter((r) => {
    if (r.id.toLowerCase().includes(query)) return true
    
    const guest = guestsStore.getGuestById(r.guestId)
    if (guest) {
      if (guest.firstName.toLowerCase().includes(query)) return true
      if (guest.lastName.toLowerCase().includes(query)) return true
      if (guest.email.toLowerCase().includes(query)) return true
    }
    
    return false
  })
}

function handleCheckIn(reservationId: string) {
  if (confirm('Confirm check-in for this reservation?')) {
    reservationsStore.checkIn(reservationId)
    alert('Check-in successful!')
    searchQuery.value = ''
    filteredReservations.value = []
  }
}

function viewReservationDetails(reservationId: string) {
  router.push(`/checkout?reservation=${reservationId}`)
}
</script>

