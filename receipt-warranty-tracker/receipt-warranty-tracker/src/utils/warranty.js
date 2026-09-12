// All the date math for warranties lives here, in one place, so the
// components can stay focused on rendering.

/**
 * Given a purchase date (YYYY-MM-DD string) and a warranty length in
 * months, return the expiry date as a YYYY-MM-DD string.
 */
export function calculateExpiryDate(purchaseDate, warrantyMonths) {
  const date = new Date(purchaseDate + 'T00:00:00')
  date.setMonth(date.getMonth() + Number(warrantyMonths))
  return date.toISOString().slice(0, 10)
}

/**
 * Classify a warranty as 'active', 'expiring-soon', or 'expired' based
 * on today's date. "Expiring soon" means 30 days or less remain.
 */
export function getWarrantyStatus(expiryDate) {
  const today = startOfToday()
  const expiry = new Date(expiryDate + 'T00:00:00')
  const msPerDay = 1000 * 60 * 60 * 24
  const daysLeft = Math.round((expiry - today) / msPerDay)

  if (daysLeft < 0) return 'expired'
  if (daysLeft <= 30) return 'expiring-soon'
  return 'active'
}

export function daysUntil(expiryDate) {
  const today = startOfToday()
  const expiry = new Date(expiryDate + 'T00:00:00')
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.round((expiry - today) / msPerDay)
}

function startOfToday() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

export const STATUS_LABELS = {
  active: 'Active',
  'expiring-soon': 'Expiring soon',
  expired: 'Expired',
}

// Warranty length options shown in the form, stored internally as months.
export const WARRANTY_OPTIONS = [
  { label: '3 months', months: 3 },
  { label: '6 months', months: 6 },
  { label: '1 year', months: 12 },
  { label: '2 years', months: 24 },
  { label: '3 years', months: 36 },
  { label: '5 years', months: 60 },
]

export function formatDate(isoDate) {
  const date = new Date(isoDate + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Currencies available in the "Add Purchase" form. Add more here if you
// need one that isn't listed — just needs a valid ISO 4217 code.
export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD — US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR — Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP — British Pound' },
  { code: 'INR', symbol: '₹', label: 'INR — Indian Rupee' },
  { code: 'JPY', symbol: '¥', label: 'JPY — Japanese Yen' },
  { code: 'AUD', symbol: 'A$', label: 'AUD — Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'CAD — Canadian Dollar' },
]

export const DEFAULT_CURRENCY = 'USD'

// Formats a price with the right symbol, decimal places, and grouping
// for its currency (e.g. JPY shows no decimals, USD shows two).
// Falls back to USD for purchases saved before currency support existed.
export function formatPrice(price, currencyCode = DEFAULT_CURRENCY) {
  const number = Number(price)
  if (Number.isNaN(number)) return price
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || DEFAULT_CURRENCY,
    }).format(number)
  } catch (err) {
    // Unrecognized currency code — fall back to a plain number.
    return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
}
