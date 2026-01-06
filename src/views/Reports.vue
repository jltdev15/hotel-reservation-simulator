<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Reports</h1>
      <p class="mt-2 text-gray-600">Hotel operational and analytics reports</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <ReportCard
        title="Total Revenue"
        :value="`₱${billingStore.totalRevenue.toLocaleString()}`"
        icon="💰"
        subtitle="All time"
      />
      <ReportCard
        title="Occupancy Rate"
        :value="`${roomsStore.occupancyRate}%`"
        icon="📊"
        :subtitle="`${roomsStore.occupiedRooms.length}/${roomsStore.totalRooms} rooms`"
      />
      <ReportCard
        title="Total Reservations"
        :value="reservationsStore.reservations.length"
        icon="📅"
        subtitle="All time"
      />
      <ReportCard
        title="Total Guests"
        :value="guestsStore.totalGuests"
        icon="👥"
        subtitle="Registered"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Room Occupancy Report</h2>
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
          <div class="pt-2 border-t">
            <div class="flex justify-between">
              <span class="font-semibold text-gray-800">Total Rooms</span>
              <span class="font-semibold text-gray-800">{{ roomsStore.totalRooms }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Revenue Summary</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">Paid Invoices</span>
            <span class="font-semibold text-green-600">{{ billingStore.paidInvoices.length }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Pending Payments</span>
            <span class="font-semibold text-yellow-600">{{ billingStore.pendingInvoices.length }}</span>
          </div>
          <div class="pt-2 border-t">
            <div class="flex justify-between">
              <span class="font-semibold text-gray-800">Total Revenue</span>
              <span class="font-semibold text-blue-600">₱{{ billingStore.totalRevenue.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Guest History</h2>
      <DataTable
        title=""
        :columns="guestColumns"
        :data="guestHistory"
      >
        <template #cell-createdAt="{ value }">
          {{ formatDate(value as string) }}
        </template>
      </DataTable>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Reservation History</h2>
      <DataTable
        title=""
        :columns="reservationColumns"
        :data="reservationHistory"
      >
        <template #cell-checkIn="{ value }">
          {{ formatDate(value as string) }}
        </template>
        <template #cell-checkOut="{ value }">
          {{ formatDate(value as string) }}
        </template>
        <template #cell-status="{ value }">
          <span
            class="px-2 py-1 text-xs font-semibold rounded-full"
            :class="getStatusClass(value as string)"
          >
            {{ value }}
          </span>
        </template>
      </DataTable>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Payment History</h2>
      <DataTable
        title=""
        :columns="paymentColumns"
        :data="paymentHistory"
      >
        <template #cell-total="{ value }">
          ₱{{ Number(value).toLocaleString() }}
        </template>
        <template #cell-paymentDate="{ value }">
          {{ formatDateTime(value as string) }}
        </template>
        <template #cell-paymentStatus="{ value }">
          <span
            class="px-2 py-1 text-xs font-semibold rounded-full"
            :class="getPaymentStatusClass(value as string)"
          >
            {{ value }}
          </span>
        </template>
      </DataTable>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Housekeeping Performance</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-gray-600">Pending Tasks</p>
          <p class="text-2xl font-bold text-blue-600">{{ housekeepingStore.pendingTasks.length }}</p>
        </div>
        <div class="p-4 bg-yellow-50 rounded-lg">
          <p class="text-sm text-gray-600">In Progress</p>
          <p class="text-2xl font-bold text-yellow-600">{{ housekeepingStore.inProgressTasks.length }}</p>
        </div>
        <div class="p-4 bg-green-50 rounded-lg">
          <p class="text-sm text-gray-600">Completed</p>
          <p class="text-2xl font-bold text-green-600">{{ housekeepingStore.completedTasks.length }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoomsStore } from '@/stores/rooms'
import { useReservationsStore } from '@/stores/reservations'
import { useGuestsStore } from '@/stores/guests'
import { useBillingStore } from '@/stores/billing'
import { useHousekeepingStore } from '@/stores/housekeeping'
import { formatDate, formatDateTime } from '@/utils/dateHelpers'
import ReportCard from '@/components/Reports/ReportCard.vue'
import DataTable from '@/components/Reports/DataTable.vue'

const roomsStore = useRoomsStore()
const reservationsStore = useReservationsStore()
const guestsStore = useGuestsStore()
const billingStore = useBillingStore()
const housekeepingStore = useHousekeepingStore()

const guestColumns = [
  { key: 'id', label: 'Guest ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'nationality', label: 'Nationality' },
  { key: 'loyaltyPoints', label: 'Loyalty Points' },
  { key: 'createdAt', label: 'Registered', type: 'date' as const }
]

const reservationColumns = [
  { key: 'id', label: 'Reservation ID' },
  { key: 'roomNumber', label: 'Room' },
  { key: 'checkIn', label: 'Check-in', type: 'date' as const },
  { key: 'checkOut', label: 'Check-out', type: 'date' as const },
  { key: 'status', label: 'Status' },
  { key: 'source', label: 'Source' }
]

const paymentColumns = [
  { key: 'id', label: 'Invoice ID' },
  { key: 'reservationId', label: 'Reservation' },
  { key: 'roomNumber', label: 'Room' },
  { key: 'total', label: 'Total', type: 'currency' as const },
  { key: 'paymentMethod', label: 'Payment Method' },
  { key: 'paymentStatus', label: 'Status' },
  { key: 'paymentDate', label: 'Payment Date', type: 'datetime' as const }
]

const guestHistory = computed(() => {
  return [...guestsStore.guests].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
})

const reservationHistory = computed(() => {
  return [...reservationsStore.reservations].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
})

const paymentHistory = computed(() => {
  return [...billingStore.invoices]
    .filter((inv) => inv.paymentStatus === 'Paid')
    .sort((a, b) => {
      const dateA = a.paymentDate ? new Date(a.paymentDate).getTime() : 0
      const dateB = b.paymentDate ? new Date(b.paymentDate).getTime() : 0
      return dateB - dateA
    })
})

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    Confirmed: 'bg-blue-100 text-blue-800',
    'Checked In': 'bg-green-100 text-green-800',
    'Checked Out': 'bg-gray-100 text-gray-800',
    Cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getPaymentStatusClass(status: string): string {
  const classes: Record<string, string> = {
    Paid: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Refunded: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
</script>

