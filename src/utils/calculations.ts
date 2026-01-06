import type { Invoice, Activity, Reservation } from '@/types'
import { calculateNights } from './dateHelpers'

const TAX_RATE = 0.12 // 12% tax

export function calculateTax(amount: number): number {
  return Math.round(amount * TAX_RATE * 100) / 100
}

export function calculateTotalWithTax(subtotal: number): number {
  const tax = calculateTax(subtotal)
  return Math.round((subtotal + tax) * 100) / 100
}

export function calculateRoomCharges(
  roomRate: number,
  checkIn: string,
  checkOut: string
): number {
  const nights = calculateNights(checkIn, checkOut)
  return roomRate * nights
}

export function calculateActivityCharges(activities: Activity[]): number {
  return activities.reduce((total, activity) => {
    if (activity.status === 'Completed') {
      return total + activity.totalPrice
    }
    return total
  }, 0)
}

export function generateInvoiceTotal(
  reservation: Reservation,
  roomRate: number,
  activities: Activity[]
): { roomCharges: number; activityCharges: number; tax: number; total: number } {
  const roomCharges = reservation.checkOut
    ? calculateRoomCharges(roomRate, reservation.checkIn, reservation.checkOut)
    : 0
  const activityCharges = calculateActivityCharges(activities)
  const subtotal = roomCharges + activityCharges
  const tax = calculateTax(subtotal)
  const total = subtotal + tax

  return {
    roomCharges: Math.round(roomCharges * 100) / 100,
    activityCharges: Math.round(activityCharges * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100
  }
}

export function calculateRevenue(invoices: Invoice[]): number {
  return invoices
    .filter((inv) => inv.paymentStatus === 'Paid')
    .reduce((total, inv) => total + inv.total, 0)
}

export function calculateOccupancyRate(
  totalRooms: number,
  occupiedRooms: number
): number {
  if (totalRooms === 0) return 0
  return Math.round((occupiedRooms / totalRooms) * 100)
}

export function generateId(prefix: string, existingIds: string[]): string {
  let counter = 1
  let newId = `${prefix}${String(counter).padStart(3, '0')}`
  while (existingIds.includes(newId)) {
    counter++
    newId = `${prefix}${String(counter).padStart(3, '0')}`
  }
  return newId
}

