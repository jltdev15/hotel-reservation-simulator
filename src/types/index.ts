export type RoomStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance'

export interface Room {
  id: string
  number: string
  type: string
  floor: number
  rate: number
  status: RoomStatus
  maxOccupancy: number
  amenities: string[]
}

export interface Guest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  nationality: string
  idType: string
  idNumber: string
  preferences: string[]
  loyaltyPoints: number
  createdAt: string
}

export type ReservationStatus = 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled'

export interface Reservation {
  id: string
  guestId: string
  roomId: string
  roomNumber: string
  checkIn: string
  checkOut: string
  status: ReservationStatus
  adults: number
  children: number
  source: 'Frontdesk' | 'Online'
  specialRequests: string | null
  createdAt: string
  checkedInAt?: string
  checkedOutAt?: string
}

export type HousekeepingTaskType = 'Checkout Cleaning' | 'Daily Cleaning' | 'Deep Cleaning' | 'Maintenance'
export type HousekeepingStatus = 'Pending' | 'In Progress' | 'Completed'

export interface HousekeepingTask {
  id: string
  roomId: string
  roomNumber: string
  taskType: HousekeepingTaskType
  status: HousekeepingStatus
  assignedTo: string
  priority: 'Low' | 'Medium' | 'High'
  createdAt: string
  startedAt: string | null
  completedAt: string | null
  notes: string
}

export type ActivityType = 'Spa Service' | 'Room Service' | 'Shuttle Service' | 'Extra Bed' | 'Amenities' | 'Other'
export type ActivityStatus = 'Pending' | 'Completed' | 'Cancelled'

export interface Activity {
  id: string
  reservationId: string
  guestId: string
  roomId: string
  activityType: ActivityType
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  status: ActivityStatus
  createdAt: string
  completedAt: string | null
}

export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | null
export type PaymentStatus = 'Pending' | 'Paid' | 'Refunded'

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  reservationId: string
  guestId: string
  roomId: string
  roomNumber: string
  checkIn: string
  checkOut: string | null
  roomCharges: number
  activityCharges: number
  tax: number
  total: number
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  paymentDate: string | null
  invoiceDate: string
  items: InvoiceItem[]
}

export interface AuditLog {
  id: string
  action: string
  entityType: 'Reservation' | 'Guest' | 'Room' | 'Housekeeping' | 'Activity' | 'Billing'
  entityId: string
  userId: string
  timestamp: string
  details: Record<string, unknown>
}

