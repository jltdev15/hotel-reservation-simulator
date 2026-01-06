<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Activities & Services</h1>
      <p class="mt-2 text-gray-600">Log extra services and activities for guests</p>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Add New Activity</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Select Reservation <span class="text-red-500">*</span>
            </label>
            <select
              v-model="activityData.reservationId"
              required
              @change="onReservationChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Reservation</option>
              <option
                v-for="reservation in checkedInReservations"
                :key="reservation.id"
                :value="reservation.id"
              >
                {{ reservation.id }} - Room {{ reservation.roomNumber }} ({{ getGuestName(reservation.guestId) }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Activity Type <span class="text-red-500">*</span>
            </label>
            <select
              v-model="activityData.activityType"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="Spa Service">Spa Service</option>
              <option value="Room Service">Room Service</option>
              <option value="Shuttle Service">Shuttle Service</option>
              <option value="Extra Bed">Extra Bed</option>
              <option value="Amenities">Amenities</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Description <span class="text-red-500">*</span>
          </label>
          <input
            v-model="activityData.description"
            type="text"
            required
            placeholder="e.g., Full Body Massage, Airport Transfer, etc."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Quantity <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="activityData.quantity"
              type="number"
              min="1"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Unit Price (₱) <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="activityData.unitPrice"
              type="number"
              min="0"
              step="0.01"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Total Price (₱)
            </label>
            <input
              :value="totalPrice"
              type="text"
              readonly
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Activity
          </button>
        </div>
      </form>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
      <div v-if="recentActivities.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reservation</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="activity in recentActivities" :key="activity.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ activity.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ activity.reservationId }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ activity.activityType }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ activity.description }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ activity.quantity }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₱{{ activity.totalPrice.toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(activity.status)"
                >
                  {{ activity.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  v-if="activity.status === 'Pending'"
                  @click="completeActivity(activity.id)"
                  class="text-green-600 hover:text-green-800"
                >
                  Complete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-gray-600 text-center py-4">
        No activities logged yet
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useActivitiesStore } from '@/stores/activities'
import { useReservationsStore } from '@/stores/reservations'
import { useGuestsStore } from '@/stores/guests'
import type { Activity } from '@/types'

const activitiesStore = useActivitiesStore()
const reservationsStore = useReservationsStore()
const guestsStore = useGuestsStore()

const checkedInReservations = computed(() => reservationsStore.checkedInReservations)

const activityData = ref({
  reservationId: '',
  guestId: '',
  roomId: '',
  activityType: '' as Activity['activityType'],
  description: '',
  quantity: 1,
  unitPrice: 0
})

const totalPrice = computed(() => {
  return (activityData.value.quantity * activityData.value.unitPrice).toFixed(2)
})

const recentActivities = computed(() => {
  return [...activitiesStore.activities]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20)
})

function getGuestName(guestId: string): string {
  const guest = guestsStore.getGuestById(guestId)
  if (!guest) return 'N/A'
  return `${guest.firstName} ${guest.lastName}`
}

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function onReservationChange() {
  const reservation = reservationsStore.getReservationById(activityData.value.reservationId)
  if (reservation) {
    activityData.value.guestId = reservation.guestId
    activityData.value.roomId = reservation.roomId
  }
}

function handleSubmit() {
  const reservation = reservationsStore.getReservationById(activityData.value.reservationId)
  if (!reservation) {
    alert('Please select a reservation')
    return
  }

  const newActivity = activitiesStore.createActivity({
    reservationId: activityData.value.reservationId,
    guestId: reservation.guestId,
    roomId: reservation.roomId,
    activityType: activityData.value.activityType,
    description: activityData.value.description,
    quantity: activityData.value.quantity,
    unitPrice: activityData.value.unitPrice,
    totalPrice: activityData.value.quantity * activityData.value.unitPrice
  })

  alert(`Activity ${newActivity.id} added successfully!`)
  resetForm()
}

function resetForm() {
  activityData.value = {
    reservationId: '',
    guestId: '',
    roomId: '',
    activityType: '' as Activity['activityType'],
    description: '',
    quantity: 1,
    unitPrice: 0
  }
}

function completeActivity(activityId: string) {
  activitiesStore.completeActivity(activityId)
  alert('Activity marked as completed!')
}
</script>

