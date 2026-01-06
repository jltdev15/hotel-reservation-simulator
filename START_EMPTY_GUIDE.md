# Starting with Empty Data Guide

## Overview

The hotel reservation simulator now supports starting with **no guest or reservation data**. This is useful for:
- Fresh simulation scenarios
- Testing from scratch
- Educational demonstrations
- Clean slate testing

## Methods to Start Empty

### Method 1: Clear Data After App Loads (Recommended)

You can clear guests and reservations programmatically:

```typescript
import { clearGuestsAndReservations } from '@/utils/simulation'

// Clear only guests and reservations
clearGuestsAndReservations()
```

Or clear all simulation data (keeps rooms):

```typescript
import { clearAllSimulationData } from '@/utils/simulation'

// Clear guests, reservations, billing, housekeeping, and activities
clearAllSimulationData()
```

### Method 2: Set Flag for Next Fresh Load

If you want the app to start empty on the next fresh load (when localStorage is empty):

```typescript
import { enableStartEmpty, resetToEmptyState } from '@/utils/simulation'

// Enable starting empty on next fresh load
enableStartEmpty()

// Or completely reset everything and reload
resetToEmptyState() // This will reload the page
```

### Method 3: Use Store Methods Directly

You can also use the store methods directly:

```typescript
import { useGuestsStore } from '@/stores/guests'
import { useReservationsStore } from '@/stores/reservations'

const guestsStore = useGuestsStore()
const reservationsStore = useReservationsStore()

// Clear guests
guestsStore.clearGuests()

// Clear reservations
reservationsStore.clearReservations()
```

## Available Functions

### `clearGuestsAndReservations()`
Clears only guests and reservations data.

### `clearAllSimulationData()`
Clears all simulation data:
- Guests
- Reservations
- Billing/Invoices
- Housekeeping tasks
- Activities

**Note:** Rooms are preserved as they represent the hotel inventory.

### `enableStartEmpty()`
Sets a flag so that on the next fresh app load (when localStorage is empty), the app will start with empty arrays instead of seed data.

### `disableStartEmpty()`
Removes the flag so the app will use seed data on fresh load.

### `resetToEmptyState()`
Completely clears all localStorage data and reloads the page to start fresh.

## Usage Examples

### Example 1: Clear Data in Browser Console

Open browser console and run:

```javascript
// Import the function (if using modules)
// Or add a button in the UI that calls this

// Clear guests and reservations
localStorage.removeItem('hotel_guests')
localStorage.removeItem('hotel_reservations')
location.reload()
```

### Example 2: Add a Reset Button in UI

You can add a button in your Dashboard or Settings:

```vue
<template>
  <button @click="handleClearData" class="btn-danger">
    Clear All Data
  </button>
</template>

<script setup lang="ts">
import { clearAllSimulationData } from '@/utils/simulation'

function handleClearData() {
  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
    clearAllSimulationData()
    alert('All data cleared!')
  }
}
</script>
```

### Example 3: Start Fresh on First Load

If you want the app to always start empty on first load, you can:

1. Set the flag before the app initializes
2. Or modify the stores to default to empty arrays

## Current Behavior

- **If localStorage has data**: App loads existing data (normal behavior)
- **If localStorage is empty AND `START_EMPTY` flag is set**: App starts with empty arrays
- **If localStorage is empty AND `START_EMPTY` flag is NOT set**: App loads seed data from JSON files

## Notes

- Rooms are **always preserved** - they represent the hotel inventory
- Clearing data is **permanent** - make sure to save/export if needed
- The `START_EMPTY` flag only affects **fresh loads** (when localStorage is empty)
- If you have existing data in localStorage, you need to clear it first

## Testing

To test starting with empty data:

1. Clear browser localStorage:
   ```javascript
   localStorage.clear()
   ```

2. Set the start empty flag:
   ```javascript
   localStorage.setItem('hotel_start_empty', 'true')
   ```

3. Reload the page - guests and reservations should be empty

