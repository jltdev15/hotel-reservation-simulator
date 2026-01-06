<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Invoice #{{ invoice.id }}</h2>
      <p class="text-sm text-gray-600 mt-1">
        Date: {{ formatDateTime(invoice.invoiceDate) }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <h3 class="font-semibold text-gray-700 mb-2">Guest Information</h3>
        <p class="text-sm text-gray-600">{{ guestName }}</p>
        <p class="text-sm text-gray-600">{{ guestEmail }}</p>
      </div>
      <div>
        <h3 class="font-semibold text-gray-700 mb-2">Reservation Details</h3>
        <p class="text-sm text-gray-600">Room: {{ invoice.roomNumber }}</p>
        <p class="text-sm text-gray-600">
          Check-in: {{ formatDate(invoice.checkIn) }}
        </p>
        <p v-if="invoice.checkOut" class="text-sm text-gray-600">
          Check-out: {{ formatDate(invoice.checkOut) }}
        </p>
      </div>
    </div>

    <div class="border-t border-gray-200 pt-4 mb-4">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left py-2 text-sm font-semibold text-gray-700">Description</th>
            <th class="text-center py-2 text-sm font-semibold text-gray-700">Qty</th>
            <th class="text-right py-2 text-sm font-semibold text-gray-700">Unit Price</th>
            <th class="text-right py-2 text-sm font-semibold text-gray-700">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in invoice.items" :key="index" class="border-b border-gray-100">
            <td class="py-3 text-sm text-gray-700">{{ item.description }}</td>
            <td class="py-3 text-center text-sm text-gray-700">{{ item.quantity }}</td>
            <td class="py-3 text-right text-sm text-gray-700">₱{{ item.unitPrice.toLocaleString() }}</td>
            <td class="py-3 text-right text-sm text-gray-700">₱{{ item.total.toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="border-t border-gray-200 pt-4">
      <div class="flex justify-between mb-2">
        <span class="text-sm text-gray-600">Room Charges:</span>
        <span class="text-sm font-medium text-gray-800">₱{{ invoice.roomCharges.toLocaleString() }}</span>
      </div>
      <div class="flex justify-between mb-2">
        <span class="text-sm text-gray-600">Activity Charges:</span>
        <span class="text-sm font-medium text-gray-800">₱{{ invoice.activityCharges.toLocaleString() }}</span>
      </div>
      <div class="flex justify-between mb-2">
        <span class="text-sm text-gray-600">Subtotal:</span>
        <span class="text-sm font-medium text-gray-800">
          ₱{{ (invoice.roomCharges + invoice.activityCharges).toLocaleString() }}
        </span>
      </div>
      <div class="flex justify-between mb-2">
        <span class="text-sm text-gray-600">Tax (12%):</span>
        <span class="text-sm font-medium text-gray-800">₱{{ invoice.tax.toLocaleString() }}</span>
      </div>
      <div class="flex justify-between pt-2 border-t-2 border-gray-300">
        <span class="text-lg font-bold text-gray-800">Total:</span>
        <span class="text-lg font-bold text-blue-600">₱{{ invoice.total.toLocaleString() }}</span>
      </div>
    </div>

    <div class="mt-4">
      <span
        class="px-3 py-1 text-sm font-semibold rounded-full"
        :class="paymentStatusClasses"
      >
        {{ invoice.paymentStatus }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Invoice } from '@/types'
import { formatDate, formatDateTime } from '@/utils/dateHelpers'
import { useGuestsStore } from '@/stores/guests'

const props = defineProps<{
  invoice: Invoice
}>()

const guestsStore = useGuestsStore()
const guest = computed(() => guestsStore.getGuestById(props.invoice.guestId))
const guestName = computed(() => {
  if (!guest.value) return 'N/A'
  return `${guest.value.firstName} ${guest.value.lastName}`
})
const guestEmail = computed(() => guest.value?.email || 'N/A')

const paymentStatusClasses = computed(() => {
  return props.invoice.paymentStatus === 'Paid'
    ? 'bg-green-100 text-green-800'
    : 'bg-yellow-100 text-yellow-800'
})
</script>

