// Every read/write to localStorage goes through here, so the rest of
// the app just deals with plain JS arrays and objects.

const STORAGE_KEY = 'stub.purchases.v1'

export function loadPurchases() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('Could not read purchases from localStorage:', err)
    return []
  }
}

export function savePurchases(purchases) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases))
  } catch (err) {
    console.error('Could not save purchases to localStorage:', err)
  }
}

export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
