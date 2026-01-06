import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue')
    },
    {
      path: '/reservations/frontdesk',
      name: 'frontdesk-reservation',
      component: () => import('@/views/Reservations/FrontdeskReservation.vue')
    },
    {
      path: '/reservations/online',
      name: 'online-reservation',
      component: () => import('@/views/Reservations/OnlineReservation.vue')
    },
    {
      path: '/checkin',
      name: 'checkin',
      component: () => import('@/views/CheckIn.vue')
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/CheckOut.vue')
    },
    {
      path: '/room-shifting',
      name: 'room-shifting',
      component: () => import('@/views/RoomShifting.vue')
    },
    {
      path: '/activities',
      name: 'activities',
      component: () => import('@/views/Activities.vue')
    },
    {
      path: '/housekeeping',
      name: 'housekeeping',
      component: () => import('@/views/Housekeeping.vue')
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: () => import('@/views/Rooms.vue')
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/Reports.vue')
    }
  ]
})

export default router
