# Simple Budget Planner

A frontend-only React app for tracking income and expenses, styled like a
bank passbook/ledger. No backend, no real accounts — everything is saved to
your browser's `localStorage`.

## Pages

- **Login** — demo sign-in (any name/password works, nothing is sent
  anywhere). Enter a name and you're in.
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
  JSON (backup), or reset everything.

## Tech stack

- React 18 + Vite
- React Router v6 (multi-page navigation, protected routes)
- Recharts (charts on the Reports page)
- Plain CSS (no UI framework) — see `src/App.css`

## Getting started

You need [Node.js](https://nodejs.org) (version 18+) installed.

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`). You'll
land on the login screen — type any name and click "Sign in" to get in.

### Other commands

```bash
npm run build    # production build, output in /dist
npm run preview  # preview the production build locally
```

## Project structure

```
simple-budget-planner/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                 # entry point — Router + context providers
    ├── App.jsx                  # route definitions
    ├── App.css                  # all styling (organized in sections)
    ├── index.css                # global reset + design tokens (colors/fonts)
    ├── context/
    │   ├── AuthContext.jsx        # demo login/logout state
    │   └── DataContext.jsx        # transactions, goals, budgets + all the
    │                                derived numbers (totals, balances, charts)
    ├── components/
    │   ├── AppLayout.jsx           # sidebar + mobile topbar shell
    │   ├── Sidebar.jsx               # navigation
    │   ├── ProtectedRoute.jsx          # redirects to /login if signed out
    │   ├── SummaryStamps.jsx            # income/expense/balance cards
    │   ├── TransactionForm.jsx           # add-entry form
    │   ├── Ledger.jsx                      # statement table w/ running balance
    │   ├── GoalCard.jsx                      # one savings goal card
    │   └── BudgetRow.jsx                       # one category's budget row
    ├── pages/
    │   ├── Login.jsx
    │   ├── Overview.jsx
    │   ├── History.jsx
    │   ├── Savings.jsx
    │   ├── Budgets.jsx
    │   ├── Reports.jsx
    │   └── Profile.jsx
    └── utils/
        ├── storage.js               # localStorage load/save (prefixed keys)
        └── format.js                  # currency/date formatting, categories,
                                          colors, month helpers
```

## How the data fits together

Everything lives in `DataContext`, which is the single source of truth:

- **Transactions** are the core record — every deposit and withdrawal.
- **Savings goal progress** isn't stored separately; it's calculated by
  summing the transactions tagged with that goal's ID. This means a goal's
  "saved" amount can never drift out of sync with your statement.
- **Budgets** are just a `{ category: monthlyLimit }` map, compared against
  the current month's transactions.

If you want to add a real backend later, `DataContext.jsx` is the one file
to change — replace the `localStorage` calls with API calls and everything
else (forms, charts, the ledger) keeps working as-is.

## Customizing

- **Categories**: edit `CATEGORIES` in `src/utils/format.js`.
- **Category colors** (used in tags and the pie chart): edit
  `CATEGORY_COLORS` in the same file.
- **Colors / fonts**: edit the CSS variables at the top of `src/index.css`.
- **Currency**: amounts are formatted as INR (₹) in `src/utils/format.js`.

## Notes

This is frontend-only: there's no server, no database, and the login does
not check credentials — it's there for the UI/flow, not security. If you
clear your browser's site data, your entries will be lost. Use the
**Export all data (JSON)** button on the Profile page as a manual backup.

## Deploying

This app uses client-side routing (React Router), so a static host needs to
serve `index.html` for any URL, not just `/` — otherwise refreshing on
`/app/history`, for example, gives a 404. That config is already included:

- **Netlify** — `public/_redirects` (copied into the build automatically)
- **Vercel** — `vercel.json`
- **GitHub Pages / others** — check your host's docs for an "SPA fallback"
  or "rewrite all routes to index.html" setting

