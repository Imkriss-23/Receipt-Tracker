import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import SearchBar from './components/SearchBar.jsx'
import PurchaseList from './components/PurchaseList.jsx'
import AddPurchaseButton from './components/AddPurchaseButton.jsx'
import PurchaseForm from './components/PurchaseForm.jsx'
import { loadPurchases, savePurchases, createId } from './utils/storage.js'
import { getWarrantyStatus } from './utils/warranty.js'

export default function App() {
  // Lazy initializer so we only read localStorage once, on first render.
  const [purchases, setPurchases] = useState(() => loadPurchases())
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPurchase, setEditingPurchase] = useState(null)

  // Every time `purchases` changes, mirror it to localStorage.
  useEffect(() => {
    savePurchases(purchases)
  }, [purchases])

  const filteredPurchases = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    const sorted = [...purchases].sort(
      (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)
    )
    if (!term) return sorted
    return sorted.filter(
      (p) =>
        p.productName.toLowerCase().includes(term) ||
        p.store.toLowerCase().includes(term)
    )
  }, [purchases, searchTerm])

  const expiringSoonCount = useMemo(
    () => purchases.filter((p) => getWarrantyStatus(p.expiryDate) === 'expiring-soon').length,
    [purchases]
  )

  function handleOpenAddForm() {
    setEditingPurchase(null)
    setIsFormOpen(true)
  }

  function handleOpenEditForm(purchase) {
    setEditingPurchase(purchase)
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setIsFormOpen(false)
    setEditingPurchase(null)
  }

  function handleSavePurchase(formData) {
    if (editingPurchase) {
      setPurchases((prev) =>
        prev.map((p) => (p.id === editingPurchase.id ? { ...formData, id: p.id } : p))
      )
    } else {
      setPurchases((prev) => [...prev, { ...formData, id: createId() }])
    }
    handleCloseForm()
  }

  function handleDeletePurchase(id) {
    const target = purchases.find((p) => p.id === id)
    const confirmed = window.confirm(
      `Delete "${target?.productName ?? 'this purchase'}"? This can't be undone.`
    )
    if (confirmed) {
      setPurchases((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="app">
      <Header total={purchases.length} expiringSoonCount={expiringSoonCount} />
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <PurchaseList
        purchases={filteredPurchases}
        onEdit={handleOpenEditForm}
        onDelete={handleDeletePurchase}
        hasAnyPurchases={purchases.length > 0}
        searchTerm={searchTerm}
      />
      <AddPurchaseButton onClick={handleOpenAddForm} />

      {isFormOpen && (
        <PurchaseForm
          initialData={editingPurchase}
          onSave={handleSavePurchase}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}
