<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          First Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.firstName"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Last Name <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.lastName"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Email <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.email"
          type="email"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Phone <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.phone"
          type="tel"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
      <input
        v-model="formData.address"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Nationality <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.nationality"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          ID Type <span class="text-red-500">*</span>
        </label>
        <select
          v-model="formData.idType"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select ID Type</option>
          <option value="Passport">Passport</option>
          <option value="Driver's License">Driver's License</option>
          <option value="National ID">National ID</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        ID Number <span class="text-red-500">*</span>
      </label>
      <input
        v-model="formData.idNumber"
        type="text"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Preferences</label>
      <input
        v-model="preferencesInput"
        type="text"
        placeholder="Comma-separated preferences (e.g., Non-smoking, High floor)"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
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
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Guest } from '@/types'

const props = defineProps<{
  guest?: Guest
  submitLabel?: string
}>()

const emit = defineEmits<{
  submit: [data: Omit<Guest, 'id' | 'createdAt' | 'loyaltyPoints'>]
  cancel: []
}>()

const formData = ref({
  firstName: props.guest?.firstName || '',
  lastName: props.guest?.lastName || '',
  email: props.guest?.email || '',
  phone: props.guest?.phone || '',
  address: props.guest?.address || '',
  nationality: props.guest?.nationality || '',
  idType: props.guest?.idType || '',
  idNumber: props.guest?.idNumber || '',
  preferences: props.guest?.preferences || []
})

const preferencesInput = ref(props.guest?.preferences?.join(', ') ?? '')

watch(preferencesInput, (newVal) => {
  formData.value.preferences = newVal
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
})

function handleSubmit() {
  emit('submit', formData.value)
}
</script>

