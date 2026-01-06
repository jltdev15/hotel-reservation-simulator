export const STORAGE_KEYS = {
  ROOMS: 'hotel_rooms',
  GUESTS: 'hotel_guests',
  RESERVATIONS: 'hotel_reservations',
  HOUSEKEEPING: 'hotel_housekeeping',
  ACTIVITIES: 'hotel_activities',
  BILLING: 'hotel_billing',
  AUDIT_LOGS: 'hotel_audit_logs',
  START_EMPTY: 'hotel_start_empty' // Flag to start with empty data
} as const

export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error)
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return defaultValue
    }
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error)
    return defaultValue
  }
}

export function clearLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error clearing localStorage (${key}):`, error)
  }
}

export function setStartEmpty(enable: boolean): void {
  try {
    if (enable) {
      localStorage.setItem(STORAGE_KEYS.START_EMPTY, 'true')
    } else {
      localStorage.removeItem(STORAGE_KEYS.START_EMPTY)
    }
  } catch (error) {
    console.error('Error setting start empty flag:', error)
  }
}

export function shouldStartEmpty(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.START_EMPTY) === 'true'
  } catch (error) {
    return false
  }
}

