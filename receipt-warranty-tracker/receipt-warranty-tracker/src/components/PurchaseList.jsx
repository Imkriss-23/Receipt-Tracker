import PurchaseCard from './PurchaseCard.jsx'

export default function PurchaseList({ purchases, onEdit, onDelete, hasAnyPurchases, searchTerm }) {
  if (purchases.length === 0) {
    return (
      <div className="purchase-list">
        <div className="empty-state">
          {hasAnyPurchases ? (
            <>
              <p className="empty-state__title">No matches for "{searchTerm}"</p>
              <p className="empty-state__body">Try a different product or store name.</p>
            </>
          ) : (
            <>
              <p className="empty-state__title">Nothing tracked yet</p>
              <p className="empty-state__body">
                Add your first purchase to start tracking its warranty.
              </p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="purchase-list">
      {purchases.map((purchase) => (
        <PurchaseCard
          key={purchase.id}
          purchase={purchase}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
