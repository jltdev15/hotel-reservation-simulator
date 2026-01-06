<template>
  <!-- Mobile menu button (fixed top) -->
  <button
    v-if="!mobileMenuOpen"
    @click="mobileMenuOpen = true"
    class="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-900 text-white hover:bg-blue-800 shadow-lg transition-colors"
    aria-label="Toggle menu"
  >
    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>

  <!-- Sidebar -->
  <nav 
    class="fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl transform transition-transform duration-300 ease-in-out"
    :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
  >
    <!-- Overlay for mobile -->
    <div 
      v-if="mobileMenuOpen"
      @click="mobileMenuOpen = false"
      class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
    ></div>

    <div class="flex flex-col h-full">
        <!-- Logo/Brand Section -->
      <div class="flex items-center space-x-3 px-6 py-5 border-b border-blue-700">
          <div class="shrink-0">
            <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <span class="text-2xl">🏨</span>
            </div>
          </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-lg font-bold tracking-tight truncate">Hotel Reservation</h1>
          <p class="text-xs text-blue-200 truncate">Management System</p>
        </div>
        <!-- Close button for mobile -->
        <button
          @click="mobileMenuOpen = false"
          class="lg:hidden p-1 rounded-md text-white hover:bg-blue-700 focus:outline-none"
          aria-label="Close menu"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
    </div>

      <!-- Navigation Menu -->
      <div class="flex-1 overflow-y-auto py-4">
        <div class="space-y-1 px-3">
          <!-- Dashboard -->
          <router-link
            to="/"
            @click="mobileMenuOpen = false"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-700/50"
            :class="isActive('/') ? 'bg-blue-700 text-white shadow-md' : 'text-blue-100'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </router-link>

          <!-- Rooms -->
          <router-link
            to="/rooms"
            @click="mobileMenuOpen = false"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-700/50"
            :class="isActive('/rooms') ? 'bg-blue-700 text-white shadow-md' : 'text-blue-100'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Rooms
          </router-link>
          
          <!-- Reservations Section -->
          <div class="px-4 py-2">
            <p class="text-xs font-semibold text-blue-300 uppercase tracking-wider">Reservations</p>
          </div>
          
          <router-link
            to="/reservations/frontdesk"
            @click="mobileMenuOpen = false"
            class="flex items-center px-4 py-2.5 ml-4 text-sm rounded-lg transition-all duration-200 hover:bg-blue-700/50"
            :class="route.path === '/reservations/frontdesk' ? 'bg-blue-700 text-white' : 'text-blue-100'"
          >
            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Frontdesk Booking
          </router-link>
          
          <router-link
            to="/reservations/online"
            @click="mobileMenuOpen = false"
            class="flex items-center px-4 py-2.5 ml-4 text-sm rounded-lg transition-all duration-200 hover:bg-blue-700/50"
            :class="route.path === '/reservations/online' ? 'bg-blue-700 text-white' : 'text-blue-100'"
          >
            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Online Booking
          </router-link>

          <!-- Operations Section -->
          <div class="px-4 py-2 mt-4">
            <p class="text-xs font-semibold text-blue-300 uppercase tracking-wider">Operations</p>
          </div>

          <router-link
            to="/checkin"
            @click="mobileMenuOpen = false"
            class="flex items-center px-4 py-2.5 ml-4 text-sm rounded-lg transition-all duration-200 hover:bg-blue-700/50"
            :class="route.path === '/checkin' ? 'bg-blue-700 text-white' : 'text-blue-100'"
          >
            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Check-in
          </router-link>

          <router-link
            to="/checkout"
            @click="mobileMenuOpen = false"
            class="flex items-center px-4 py-2.5 ml-4 text-sm rounded-lg transition-all duration-200 hover:bg-blue-700/50"
            :class="route.path === '/checkout' ? 'bg-blue-700 text-white' : 'text-blue-100'"
          >
            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Check-out
          </router-link>

          <router-link
            to="/room-shifting"
            @click="mobileMenuOpen = false"
            class="flex items-center px-4 py-2.5 ml-4 text-sm rounded-lg transition-all duration-200 hover:bg-blue-700/50"
            :class="route.path === '/room-shifting' ? 'bg-blue-700 text-white' : 'text-blue-100'"
          >
            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Room Shifting
          </router-link>

          <router-link
            to="/activities"
            @click="mobileMenuOpen = false"
            class="flex items-center px-4 py-2.5 ml-4 text-sm rounded-lg transition-all duration-200 hover:bg-blue-700/50"
            :class="route.path === '/activities' ? 'bg-blue-700 text-white' : 'text-blue-100'"
          >
            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Activities
          </router-link>

          <router-link
            to="/housekeeping"
            @click="mobileMenuOpen = false"
            class="flex items-center px-4 py-2.5 ml-4 text-sm rounded-lg transition-all duration-200 hover:bg-blue-700/50"
            :class="route.path === '/housekeeping' ? 'bg-blue-700 text-white' : 'text-blue-100'"
          >
            <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Housekeeping
          </router-link>

          <!-- Reports -->
          <router-link
            to="/reports"
            @click="mobileMenuOpen = false"
            class="flex items-center px-4 py-3 mt-4 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-700/50"
            :class="isActive('/reports') ? 'bg-blue-700 text-white shadow-md' : 'text-blue-100'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Reports
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const mobileMenuOpen = ref(false)

// Close mobile menu when route changes
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

