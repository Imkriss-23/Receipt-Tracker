# Stub — Receipt & Warranty Tracker (V1)

A mobile-first PWA for tracking purchases and their warranty status.
Built with React + JSX + CSS, persisted with `localStorage`. No backend,
no database, no TypeScript.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).
Open it on your phone (same Wi-Fi, use your computer's local IP instead
of `localhost`) to see the mobile layout, or shrink your browser window.

## Build for production

```bash
npm run build
npm run preview
```

`npm run build` outputs static files to `dist/` — that's the whole app.
You can deploy `dist/` to any static host (Vercel, Netlify, GitHub
Pages, etc.) and it'll work as an installable PWA.

## Project structure

```
src/
  App.jsx                  — top-level state: the purchases array, search term, form open/closed
  components/
    Header.jsx              — title + running counts
    SearchBar.jsx            — filters the list as you type
    PurchaseList.jsx         — renders cards, or an empty state
    PurchaseCard.jsx         — one purchase: name, price, dates, status pill, edit/delete
    AddPurchaseButton.jsx    — fixed bottom button that opens the form
    PurchaseForm.jsx         — add/edit form, used for both flows
  utils/
    warranty.js              — all date math: expiry calculation, status, formatting
    storage.js                — reads/writes the purchases array to localStorage
```

## How the pieces fit together (for learning React)

- **State lives in `App.jsx`.** The `purchases` array is the single
  source of truth. Every child component receives data and callbacks
  as props — nothing else holds its own copy of the purchase list.
- **One `useEffect` syncs to localStorage.** Whenever `purchases`
  changes, it's re-saved. Loading happens once, via `useState`'s lazy
  initializer (`useState(() => loadPurchases())`), so it only reads
  from disk on the very first render.
- **The form is one component for both add and edit.** If you pass it
  `initialData`, it pre-fills and calls itself "Edit Purchase"; if not,
  it starts blank. This keeps you from writing the same form twice.
- **Warranty status is derived, not stored.** `getWarrantyStatus()`
  computes Active/Expiring Soon/Expired from today's date and the
  saved expiry date every time it renders — so a purchase you added
  last year will correctly show as "Expired" today without you having
  to update anything.
- **Search doesn't filter the state, it filters the render.** `App.jsx`
  keeps the full `purchases` array untouched and computes
  `filteredPurchases` on each render with `useMemo`. This is a common
  React pattern: derive display data, don't mutate source data.

## Known V1 limits (by design)

No receipt photos, no accounts/sync, no notifications, no OCR, no AI.
Data lives only in this browser's localStorage — clearing site data
or switching browsers/devices loses it. That's the intended scope for
V1: get CRUD, forms, state, and date logic solid first.
