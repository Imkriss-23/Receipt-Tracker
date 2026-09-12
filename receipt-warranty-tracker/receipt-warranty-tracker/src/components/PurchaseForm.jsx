import { useState } from 'react'
import {
  WARRANTY_OPTIONS,
  CURRENCIES,
  DEFAULT_CURRENCY,
  calculateExpiryDate,
  formatDate,
} from '../utils/warranty.js'

const emptyForm = {
  productName: '',
  price: '',
  currency: DEFAULT_CURRENCY,
  purchaseDate: new Date().toISOString().slice(0, 10),
  store: '',
  warrantyMonths: WARRANTY_OPTIONS[2].months, // default: 1 year
  note: '',
}

export default function PurchaseForm({ initialData, onSave, onClose }) {
  const [form, setForm] = useState(
    initialData ? { ...emptyForm, ...initialData } : emptyForm
  )
  const [errors, setErrors] = useState({})

  const isEditing = Boolean(initialData)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function validate() {
    const nextErrors = {}
    if (!form.productName.trim()) nextErrors.productName = 'Enter a product name.'
    if (!form.price || Number(form.price) <= 0) {
      nextErrors.price = 'Enter a price greater than 0.'
    }
    if (!form.purchaseDate) nextErrors.purchaseDate = 'Pick a purchase date.'
    if (!form.store.trim()) nextErrors.store = 'Enter a store or seller.'
    return nextErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const expiryDate = calculateExpiryDate(form.purchaseDate, form.warrantyMonths)

    onSave({
      ...form,
      price: Number(form.price),
      warrantyMonths: Number(form.warrantyMonths),
      expiryDate,
    })
  }

  const previewExpiry =
    form.purchaseDate && form.warrantyMonths
      ? calculateExpiryDate(form.purchaseDate, form.warrantyMonths)
      : null

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="form-sheet__header">
          <h2 className="form-sheet__title">
            {isEditing ? 'Edit Purchase' : 'Add Purchase'}
          </h2>
          <button className="form-sheet__close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className={`form-field ${errors.productName ? 'form-field--invalid' : ''}`}>
            <label htmlFor="productName">Product name</label>
            <input
              id="productName"
              type="text"
              value={form.productName}
              onChange={(e) => updateField('productName', e.target.value)}
              placeholder="e.g. Sony WH-1000XM5"
              autoFocus
            />
            {errors.productName && <p className="form-field__error">{errors.productName}</p>}
          </div>

          <div className="form-row">
            <div
              className="form-field form-field--currency"
              style={{ flex: '0 0 108px' }}
            >
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                value={form.currency}
                onChange={(e) => updateField('currency', e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} {c.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div className={`form-field ${errors.price ? 'form-field--invalid' : ''}`}>
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                placeholder="0.00"
              />
              {errors.price && <p className="form-field__error">{errors.price}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className={`form-field ${errors.purchaseDate ? 'form-field--invalid' : ''}`}>
              <label htmlFor="purchaseDate">Purchase date</label>
              <input
                id="purchaseDate"
                type="date"
                value={form.purchaseDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => updateField('purchaseDate', e.target.value)}
              />
              {errors.purchaseDate && <p className="form-field__error">{errors.purchaseDate}</p>}
            </div>
          </div>

          <div className={`form-field ${errors.store ? 'form-field--invalid' : ''}`}>
            <label htmlFor="store">Store / seller</label>
            <input
              id="store"
              type="text"
              value={form.store}
              onChange={(e) => updateField('store', e.target.value)}
              placeholder="e.g. Amazon, Croma, Apple Store"
            />
            {errors.store && <p className="form-field__error">{errors.store}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="warrantyMonths">Warranty duration</label>
            <select
              id="warrantyMonths"
              value={form.warrantyMonths}
              onChange={(e) => updateField('warrantyMonths', e.target.value)}
            >
              {WARRANTY_OPTIONS.map((opt) => (
                <option key={opt.months} value={opt.months}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {previewExpiry && (
            <p className="form-preview">
              Warranty will expire on {formatDate(previewExpiry)}
            </p>
          )}

          <div className="form-field">
            <label htmlFor="note">Note (optional)</label>
            <textarea
              id="note"
              value={form.note}
              onChange={(e) => updateField('note', e.target.value)}
              placeholder="Serial number, box location, anything worth remembering"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="button button--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button--primary">
              {isEditing ? 'Save changes' : 'Save purchase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
