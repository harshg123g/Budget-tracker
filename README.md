# Budget (Guest)

A responsive, modern budget tracking web app with guest access. Track expenses, set budgets, manage bills, create savings goals, view reports, and export CSV/PDF. All data is stored locally (temporary).

## Features
- Guest access; no login required
- Dashboard with recent transactions, upcoming bills, and goals progress
- Expense tracking with categories, methods, notes, and date/time
- Monthly category budgets with progress and alerts
- Bill management with paid/due toggle
- Reports: category breakdown, trends; date/category filters
- Multi-currency selection (static rates; can be extended)
- Export CSV (transactions, budgets) and PDF report
- Dark/light mode

## Getting Started
1. Open `index.html` in a modern browser.
2. Use the sidebar to navigate. Data is saved to `localStorage`.

## Tech
- HTML, CSS (Grid/Flex)
- Vanilla JavaScript modules
- Chart.js for charts (CDN)
- jsPDF (CDN) for PDF
- PapaParse (CDN) for CSV

## Extend
- Replace static currency rates in `src/lib/currency.js` with live rates API.
- Add notifications for bills via Service Workers or email service (requires backend).
- Add authentication and cloud sync by introducing an API backend.

## License
MIT
