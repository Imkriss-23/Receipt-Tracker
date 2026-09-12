export default function AddPurchaseButton({ onClick }) {
  return (
    <div className="add-button-wrap">
      <button className="add-button" onClick={onClick}>
        <span aria-hidden="true">+</span> Add Purchase
      </button>
    </div>
  )
}
