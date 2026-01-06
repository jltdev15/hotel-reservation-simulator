import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Invoice, PaymentMethod, PaymentStatus, InvoiceItem } from '@/types'
import { STORAGE_KEYS, saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage'
import { generateId, generateInvoiceTotal } from '@/utils/calculations'
import billingData from '@/data/billing.json'
import { useReservationsStore } from './reservations'
import { useRoomsStore } from './rooms'
import { useActivitiesStore } from './activities'

export const useBillingStore = defineStore('billing', () => {
  const invoices = ref<Invoice[]>(
    loadFromLocalStorage<Invoice[]>(STORAGE_KEYS.BILLING, billingData as Invoice[])
  )

  // Computed properties
  const paidInvoices = computed(() => invoices.value.filter((inv) => inv.paymentStatus === 'Paid'))
  const pendingInvoices = computed(() => invoices.value.filter((inv) => inv.paymentStatus === 'Pending'))
  const totalRevenue = computed(() => {
    return paidInvoices.value.reduce((total, inv) => total + inv.total, 0)
  })

  // Actions
  function getInvoiceById(invoiceId: string): Invoice | undefined {
    return invoices.value.find((inv) => inv.id === invoiceId)
  }

  function getInvoiceByReservation(reservationId: string): Invoice | undefined {
    return invoices.value.find((inv) => inv.reservationId === reservationId)
  }

  function getInvoicesByGuest(guestId: string): Invoice[] {
    return invoices.value.filter((inv) => inv.guestId === guestId)
  }

  function generateInvoice(reservationId: string): Invoice {
    const reservationsStore = useReservationsStore()
    const roomsStore = useRoomsStore()
    const activitiesStore = useActivitiesStore()

    const reservation = reservationsStore.getReservationById(reservationId)
    if (!reservation) {
      throw new Error('Reservation not found')
    }

    const room = roomsStore.getRoomById(reservation.roomId)
    if (!room) {
      throw new Error('Room not found')
    }

    const activities = activitiesStore.getActivitiesByReservation(reservationId)
    const totals = generateInvoiceTotal(reservation, room.rate, activities)

    const items: InvoiceItem[] = []

    // Add room charges
    if (totals.roomCharges > 0 && reservation.checkOut) {
      const nights = Math.ceil(
        (new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) /
          (1000 * 60 * 60 * 24)
      )
      items.push({
        description: `Room ${reservation.roomNumber} - ${room.type} (${nights} night${nights > 1 ? 's' : ''})`,
        quantity: nights,
        unitPrice: room.rate,
        total: totals.roomCharges
      })
    }

    // Add activity charges
    activities
      .filter((a) => a.status === 'Completed')
      .forEach((activity) => {
        items.push({
          description: activity.description,
          quantity: activity.quantity,
          unitPrice: activity.unitPrice,
          total: activity.totalPrice
        })
      })

    const newInvoice: Invoice = {
      id: generateId('INV', invoices.value.map((inv) => inv.id)),
      reservationId: reservation.id,
      guestId: reservation.guestId,
      roomId: reservation.roomId,
      roomNumber: reservation.roomNumber,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut || null,
      roomCharges: totals.roomCharges,
      activityCharges: totals.activityCharges,
      tax: totals.tax,
      total: totals.total,
      paymentStatus: 'Pending',
      paymentMethod: null,
      paymentDate: null,
      invoiceDate: new Date().toISOString(),
      items
    }

    invoices.value.push(newInvoice)
    saveToLocalStorage(STORAGE_KEYS.BILLING, invoices.value)
    return newInvoice
  }

  function processPayment(
    invoiceId: string,
    paymentMethod: PaymentMethod,
    amount?: number
  ): void {
    const invoice = getInvoiceById(invoiceId)
    if (invoice) {
      const paymentAmount = amount || invoice.total
      invoice.paymentStatus = 'Paid'
      invoice.paymentMethod = paymentMethod
      invoice.paymentDate = new Date().toISOString()
      
      // If overpayment, could handle refund logic here
      if (paymentAmount < invoice.total) {
        // Partial payment logic could be added
      }

      saveToLocalStorage(STORAGE_KEYS.BILLING, invoices.value)
    }
  }

  function getDailyRevenue(date: string): number {
    return invoices.value
      .filter((inv) => {
        if (inv.paymentStatus !== 'Paid' || !inv.paymentDate) return false
        const paymentDate = new Date(inv.paymentDate).toISOString().split('T')[0]
        return paymentDate === date
      })
      .reduce((total, inv) => total + inv.total, 0)
  }

  function getRevenueByDateRange(startDate: string, endDate: string): number {
    return invoices.value
      .filter((inv) => {
        if (inv.paymentStatus !== 'Paid' || !inv.paymentDate) return false
        const paymentDate = new Date(inv.paymentDate)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return paymentDate >= start && paymentDate <= end
      })
      .reduce((total, inv) => total + inv.total, 0)
  }

  function resetBilling() {
    invoices.value = [...(billingData as Invoice[])]
    saveToLocalStorage(STORAGE_KEYS.BILLING, invoices.value)
  }

  function clearBilling() {
    invoices.value = []
    saveToLocalStorage(STORAGE_KEYS.BILLING, invoices.value)
  }

  return {
    invoices,
    paidInvoices,
    pendingInvoices,
    totalRevenue,
    getInvoiceById,
    getInvoiceByReservation,
    getInvoicesByGuest,
    generateInvoice,
    processPayment,
    getDailyRevenue,
    getRevenueByDateRange,
    resetBilling,
    clearBilling
  }
})

