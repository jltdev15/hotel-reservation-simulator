<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Guest Check-out</h1>
      <p class="mt-2 text-gray-600">Process guest check-out and generate invoice</p>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Search Reservation</h2>
      <div class="flex gap-4">
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
    </div>

    <div v-if="selectedReservation" class="space-y-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Reservation Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Reservation ID</p>
            <p class="font-semibold text-gray-800">{{ selectedReservation.id }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Guest</p>
            <p class="font-semibold text-gray-800">{{ getGuestName(selectedReservation.guestId) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Room</p>
            <p class="font-semibold text-gray-800">{{ selectedReservation.roomNumber }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Status</p>
            <span
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="getStatusClass(selectedReservation.status)"
            >
              {{ selectedReservation.status }}
            </span>
          </div>
          <div>
            <p class="text-sm text-gray-600">Check-in</p>
            <p class="font-semibold text-gray-800">{{ formatDateTime(selectedReservation.checkIn) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Check-out</p>
            <p class="font-semibold text-gray-800">{{ formatDateTime(selectedReservation.checkOut) }}</p>
          </div>
        </div>
      </div>

      <div v-if="invoice" class="bg-white rounded-lg shadow-md p-6">
        <InvoiceDisplay :invoice="invoice" />
        <div v-if="invoice.paymentStatus === 'Pending'" class="mt-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Process Payment</h3>
          <PaymentForm
            :invoice-total="invoice.total"
            @submit="handlePayment"
            @cancel="invoice = null"
          />
        </div>
      </div>

      <div v-else-if="selectedReservation.status === 'Checked In'" class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Ready to Check Out</h3>
            <p class="text-sm text-gray-600">Generate invoice and process payment</p>
          </div>
          <button
            @click="generateInvoice"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Generate Invoice
          </button>
        </div>
      </div>

      <div v-if="invoice && invoice.paymentStatus === 'Paid'" class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Payment Processed</h3>
            <p class="text-sm text-gray-600">Complete check-out process</p>
          </div>
          <button
            @click="handleCheckOut"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Complete Check-out
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="searchQuery && filteredReservations.length === 0" class="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
      No reservations found matching your search
    </div>

    <div v-else-if="!searchQuery" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Checked In Reservations</h2>
      <div v-if="checkedInReservations.length > 0" class="space-y-4">
        <div
          v-for="reservation in checkedInReservations"
          :key="reservation.id"
          class="border-l-4 border-green-500 pl-4 py-2 hover:bg-gray-50 cursor-pointer"
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
              Check Out
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-600 text-center py-4">
        No checked-in reservations
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReservationsStore } from '@/stores/reservations'
import { useGuestsStore } from '@/stores/guests'
import { useBillingStore } from '@/stores/billing'
import { formatDateTime } from '@/utils/dateHelpers'
import InvoiceDisplay from '@/components/Billing/InvoiceDisplay.vue'
import PaymentForm from '@/components/Billing/PaymentForm.vue'
import type { Invoice, PaymentMethod } from '@/types'

const route = useRoute()
const router = useRouter()
const reservationsStore = useReservationsStore()
const guestsStore = useGuestsStore()
const billingStore = useBillingStore()

const searchQuery = ref('')
const filteredReservations = ref<typeof reservationsStore.reservations>([])
const selectedReservation = ref<typeof reservationsStore.reservations[0] | null>(null)
const invoice = ref<Invoice | null>(null)

const checkedInReservations = computed(() => reservationsStore.checkedInReservations)

onMounted(() => {
  const reservationId = route.query.reservation as string
  if (reservationId) {
    const reservation = reservationsStore.getReservationById(reservationId)
    if (reservation) {
      selectReservation(reservationId)
    }
  }
})

function getGuestName(guestId: string): string {
  const guest = guestsStore.getGuestById(guestId)
  if (!guest) return 'N/A'
  return `${guest.firstName} ${guest.lastName}`
}

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
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
  filteredReservations.value = reservationsStore.checkedInReservations.filter((r) => {
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
    const existingInvoice = billingStore.getInvoiceByReservation(reservationId)
    invoice.value = existingInvoice || null
  }
}

function generateInvoice() {
  if (!selectedReservation.value) return
  
  try {
    const newInvoice = billingStore.generateInvoice(selectedReservation.value.id)
    invoice.value = newInvoice
  } catch (error) {
    alert('Error generating invoice: ' + (error as Error).message)
  }
}

function handlePayment(method: PaymentMethod, amount: number) {
  if (!invoice.value) return
  
  billingStore.processPayment(invoice.value.id, method, amount)
  invoice.value = billingStore.getInvoiceById(invoice.value.id) || null
  alert('Payment processed successfully!')
}

function handleCheckOut() {
  if (!selectedReservation.value) return
  
  if (confirm('Complete check-out for this reservation?')) {
    reservationsStore.checkOut(selectedReservation.value.id)
    alert('Check-out completed successfully!')
    selectedReservation.value = null
    invoice.value = null
    searchQuery.value = ''
  }
}
</script>

