# Simple Budget Planner — Frontend

A React app for tracking income and expenses, styled like a bank
passbook/ledger. Now wired up to a real Django REST API backend with
account-based sign-in (see the `backend/` project for the API).

## Pages

- **Login / Sign up** — create an account with a name + password, then sign
  in. Real authentication via the backend (JWT), no demo mode.
- **Overview** — summary stamps (deposits / withdrawals / balance), a quick
  add-entry form, and your 5 most recent transactions.
- **History** — the full statement with a running balance, search, filter by
  type/category/date range, delete ("void") entries, and **CSV export**.
- **Savings Goals** — create goals with a target amount and optional target
  date, contribute toward them, and watch the progress bar fill up. Every
  contribution is also logged as a "Savings" withdrawal in your statement,
  so your balance always stays accurate — there's no separate, disconnected
  pot of money.
- **Budgets** — set a monthly spending limit per category and see how much
  you've spent this month against it, with a color-coded progress bar
  (green → amber → red).
- **Reports** — a spending-by-category pie chart and a 6-month
  deposits-vs-withdrawals bar chart.
- **Profile & Settings** — update your display name, export all your data as
  JSON (backup), or permanently reset everything on the server.

## Tech stack

- React 18 + Vite
- React Router v6 (multi-page navigation, protected routes)
- Recharts (charts on the Reports page)
- Plain CSS (no UI framework) — see `src/App.css`
- `fetch` based API client with JWT access/refresh tokens (`src/utils/api.js`)

## Getting started

You need [Node.js](https://nodejs.org) (version 18+) installed, and the
**backend running first** (see `backend/README.md`).

```bash
npm install
cp .env.example .env
# Edit .env if your backend isn't on http://localhost:8000
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`). You'll
land on the login screen — switch to "Create account", sign up, then sign in.

### Other commands

```bash
npm run build    # production build, output in /dist
npm run preview  # preview the production build locally
```

## Project structure

```
simple-budget-planner/
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                 # entry point — Router + context providers
    ├── App.jsx                  # route definitions
    ├── App.css                  # all styling (organized in sections)
    ├── index.css                # global reset + design tokens (colors/fonts)
    ├── context/
    │   ├── AuthContext.jsx        # signup/login/logout, JWT session state
    │   └── DataContext.jsx        # transactions, goals, budgets - fetched
    │                                from the API + all the derived numbers
    │                                (totals, balances, charts)
    ├── components/
    │   ├── AppLayout.jsx           # sidebar + mobile topbar shell, data-loading state
    │   ├── Sidebar.jsx               # navigation
    │   ├── ProtectedRoute.jsx          # redirects to /login if signed out
    │   ├── SummaryStamps.jsx            # income/expense/balance cards
    │   ├── TransactionForm.jsx           # add-entry form
    │   ├── Ledger.jsx                      # statement table w/ running balance
    │   ├── GoalCard.jsx                      # one savings goal card
    │   └── BudgetRow.jsx                       # one category's budget row
    ├── pages/
    │   ├── Login.jsx              # sign in + create account toggle
    │   ├── Overview.jsx
    │   ├── History.jsx
    │   ├── Savings.jsx
    │   ├── Budgets.jsx
    │   ├── Reports.jsx
    │   └── Profile.jsx
    └── utils/
        ├── api.js                   # fetch wrapper: JWT headers, auto token refresh
        └── format.js                  # currency/date formatting, categories,
                                          colors, month helpers
```

## How the data fits together

Everything lives in `DataContext`, which is the single source of truth on
the frontend (the database is the real source of truth):

- **Transactions** are the core record — every deposit and withdrawal.
  Fetched from `GET /api/entries/` on sign-in.
- **Savings goal progress** isn't stored separately; it's calculated on the
  frontend by summing the transactions tagged with that goal's ID. This
  means a goal's "saved" amount can never drift out of sync with your
  statement.
- **Budgets** are just a `{ category: monthlyLimit }` map, fetched from
  `GET /api/budgets/` and compared against the current month's transactions.

## API integration notes

- `src/utils/api.js` is the only file that knows about HTTP. It reads
  `VITE_API_BASE_URL` from `.env`, attaches `Authorization: Bearer <token>`
  to every request, and — on a 401 — silently refreshes the access token
  and retries the request once before giving up.
- JWT tokens are kept in `localStorage` under the key `sbp.tokens`.
- DRF returns decimal amounts as JSON strings (e.g. `"500.00"`); these are
  converted to numbers right where data enters `DataContext`, so the rest of
  the app (which does plain arithmetic like `e.amount + ...`) is unchanged
  from the original local-only version.
- A savings-goal "contribution" isn't a separate API call — same as before,
  it's just `addEntry()` with `category: "Savings"` and a `goalId`.

## Customizing

- **Categories**: edit `CATEGORIES` in `src/utils/format.js`.
- **Category colors** (used in tags and the pie chart): edit
  `CATEGORY_COLORS` in the same file.
- **Colors / fonts**: edit the CSS variables at the top of `src/index.css`.
- **Currency**: amounts are formatted as INR (₹) in `src/utils/format.js`.
- **API base URL**: `VITE_API_BASE_URL` in `.env`.

## Deploying

This app uses client-side routing (React Router), so a static host needs to
serve `index.html` for any URL, not just `/` — otherwise refreshing on
`/app/history`, for example, gives a 404. That config is already included:

- **Netlify** — `public/_redirects` (copied into the build automatically)
- **Vercel** — `vercel.json`
- **GitHub Pages / others** — check your host's docs for an "SPA fallback"
  or "rewrite all routes to index.html" setting

Remember to set `VITE_API_BASE_URL` to your deployed backend's URL (and add
your deployed frontend's origin to the backend's `CORS_ALLOWED_ORIGINS`)
before building for production.
