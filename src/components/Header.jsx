export default function Header({ total, expiringSoonCount }) {
  return (
    <header className="header">
      <h1 className="header__title">Stub</h1>
      <p className="header__subtitle">
        {total} {total === 1 ? 'purchase' : 'purchases'} tracked
        {expiringSoonCount > 0 &&
          `, ${expiringSoonCount} expiring soon`}
      </p>
    </header>
  )
}
