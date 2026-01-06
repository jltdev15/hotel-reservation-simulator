<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(row, index) in data" :key="index" class="hover:bg-gray-50">
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ formatValue(row[column.key], column.type) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate, formatDateTime } from '@/utils/dateHelpers'

defineProps<{
  title: string
  columns: Array<{ key: string; label: string; type?: 'date' | 'datetime' | 'currency' | 'text' }>
  data: Record<string, unknown>[]
}>()

function formatValue(value: unknown, type?: string): string {
  if (value === null || value === undefined) return 'N/A'
  
  switch (type) {
    case 'date':
      return formatDate(value as string)
    case 'datetime':
      return formatDateTime(value as string)
    case 'currency':
      return `₱${Number(value).toLocaleString()}`
    default:
      return String(value)
  }
}
</script>

