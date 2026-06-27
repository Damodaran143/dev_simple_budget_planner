export const CATEGORIES = {
  expense: ['Food', 'Transport', 'Bills', 'Shopping', 'Health', 'Savings', 'Other'],
  income: ['Salary', 'Freelance', 'Gift', 'Interest', 'Other'],
}

// Budget limits only make sense for everyday spending categories —
// "Savings" is a transfer, not spend-able-down spending.
export const BUDGETABLE_CATEGORIES = CATEGORIES.expense.filter((c) => c !== 'Savings')

// Consistent palette across tags, the savings goal bars, and the charts.
export const CATEGORY_COLORS = {
  Food: '#a23e2f',
  Transport: '#b8923f',
  Bills: '#5b6478',
  Shopping: '#7d4f9e',
  Health: '#2f6f4f',
  Savings: '#18243f',
  Other: '#8a7a5c',
  Salary: '#2f6f4f',
  Freelance: '#3c7fa0',
  Gift: '#c2628f',
  Interest: '#b8923f',
}

export function formatINR(amount) {
  const value = Number(amount) || 0
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatDate(isoDate) {
  const d = new Date(isoDate)
  if (Number.isNaN(d.getTime())) return isoDate
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

// "2026-06" style key used to group entries by calendar month.
export function monthKey(isoDate) {
  return (isoDate || '').slice(0, 7)
}

export function monthLabel(key) {
  const [y, m] = key.split('-').map(Number)
  if (!y || !m) return key
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

export function currentMonthKey() {
  return monthKey(todayISO())
}
