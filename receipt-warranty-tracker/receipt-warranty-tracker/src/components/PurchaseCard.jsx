import {
  getWarrantyStatus,
  STATUS_LABELS,
  formatDate,
  formatPrice,
  daysUntil,
} from '../utils/warranty.js'

export default function PurchaseCard({ purchase, onEdit, onDelete }) {
  const status = getWarrantyStatus(purchase.expiryDate)
  const days = daysUntil(purchase.expiryDate)

  return (
    <article className="purchase-card">
      <div className="purchase-card__top">
        <div>
          <h2 className="purchase-card__name">{purchase.productName}</h2>
          <p className="purchase-card__store">{purchase.store}</p>
        </div>
        <span className="purchase-card__price">
          {formatPrice(purchase.price, purchase.currency)}
        </span>
      </div>

      <div className="purchase-card__meta">
        <span className="purchase-card__meta-item">
          <span>Bought </span>
          {formatDate(purchase.purchaseDate)}
        </span>
        <span className={`status-pill status-pill--${status}`}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      {purchase.note && <p className="purchase-card__note">{purchase.note}</p>}

      <div className="purchase-card__footer">
        <p className="purchase-card__expiry">
          {status === 'expired' ? (
            <>Expired <strong>{formatDate(purchase.expiryDate)}</strong></>
          ) : (
            <>Warranty ends <strong>{formatDate(purchase.expiryDate)}</strong>{' '}
              ({days} {days === 1 ? 'day' : 'days'})</>
          )}
        </p>
        <div className="purchase-card__actions">
          <button className="icon-button" onClick={() => onEdit(purchase)}>
            Edit
          </button>
          <button
            className="icon-button icon-button--danger"
            onClick={() => onDelete(purchase.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}
