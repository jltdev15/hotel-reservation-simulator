<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-gray-600">Hotel operations overview</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <ReportCard
        title="Total Rooms"
        :value="roomsStore.totalRooms"
        icon="🏨"
        :subtitle="`${roomsStore.availableRooms.length} available`"
      />
      <ReportCard
        title="Occupancy Rate"
        :value="`${roomsStore.occupancyRate}%`"
        icon="📊"
        :subtitle="`${roomsStore.occupiedRooms.length} occupied`"
      />
      <ReportCard
        title="Active Reservations"
        :value="reservationsStore.activeReservations.length"
        icon="📅"
        :subtitle="`${reservationsStore.checkedInReservations.length} checked in`"
      />
      <ReportCard
        title="Total Revenue"
        :value="`₱${billingStore.totalRevenue.toLocaleString()}`"
        icon="💰"
        subtitle="All time"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Room Status</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">Available</span>
            <span class="font-semibold text-green-600">{{ roomsStore.availableRooms.length }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Occupied</span>
            <span class="font-semibold text-red-600">{{ roomsStore.occupiedRooms.length }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Cleaning</span>
            <span class="font-semibold text-yellow-600">{{ roomsStore.cleaningRooms.length }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Maintenance</span>
            <span class="font-semibold text-gray-600">{{ roomsStore.maintenanceRooms.length }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Pending Tasks</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">Housekeeping</span>
            <span class="font-semibold text-yellow-600">{{ housekeepingStore.pendingTasks.length }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Activities</span>
            <span class="font-semibold text-blue-600">{{ activitiesStore.pendingActivities.length }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Pending Payments</span>
            <span class="font-semibold text-orange-600">{{ billingStore.pendingInvoices.length }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Recent Reservations</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reservation ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="reservation in recentReservations"
              :key="reservation.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ reservation.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ getGuestName(reservation.guestId) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ reservation.roomNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(reservation.status)"
                >
                  {{ reservation.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ formatDate(reservation.checkIn) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoomsStore } from '@/stores/rooms'
import { useReservationsStore } from '@/stores/reservations'
import { useGuestsStore } from '@/stores/guests'
import { useHousekeepingStore } from '@/stores/housekeeping'
import { useActivitiesStore } from '@/stores/activities'
import { useBillingStore } from '@/stores/billing'
import { formatDate } from '@/utils/dateHelpers'
import ReportCard from '@/components/Reports/ReportCard.vue'

const roomsStore = useRoomsStore()
const reservationsStore = useReservationsStore()
const guestsStore = useGuestsStore()
const housekeepingStore = useHousekeepingStore()
const activitiesStore = useActivitiesStore()
const billingStore = useBillingStore()

const recentReservations = computed(() => {
  return [...reservationsStore.reservations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
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
    'Checked Out': 'bg-gray-100 text-gray-800',
    Cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
</script>

