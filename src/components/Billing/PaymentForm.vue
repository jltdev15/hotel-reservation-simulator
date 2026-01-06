<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Payment Method <span class="text-red-500">*</span>
      </label>
      <select
        v-model="paymentMethod"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Payment Method</option>
        <option value="Cash">Cash</option>
        <option value="Credit Card">Credit Card</option>
        <option value="Debit Card">Debit Card</option>
        <option value="Bank Transfer">Bank Transfer</option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Amount <span class="text-red-500">*</span>
      </label>
      <input
        v-model.number="amount"
        type="number"
        :min="0"
        :max="invoiceTotal"
        step="0.01"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p class="text-xs text-gray-500 mt-1">
        Invoice Total: ₱{{ invoiceTotal.toLocaleString() }}
      </p>
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Process Payment
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PaymentMethod } from '@/types'

const props = defineProps<{
  invoiceTotal: number
}>()

const emit = defineEmits<{
  submit: [method: PaymentMethod, amount: number]
  cancel: []
}>()

const paymentMethod = ref<PaymentMethod>(null)
const amount = ref<number>(props.invoiceTotal)

function handleSubmit() {
  if (paymentMethod.value) {
    emit('submit', paymentMethod.value, amount.value)
  }
}
</script>

