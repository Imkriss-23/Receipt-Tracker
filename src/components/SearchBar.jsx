export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <div className="search-bar__input-wrap">
        <span className="search-bar__icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.4" />
            <line x1="11" y1="11" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
        <input
          className="search-bar__input"
          type="text"
          inputMode="search"
          placeholder="Search purchases or stores"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Search purchases"
        />
      </div>
    </div>
  )
}
