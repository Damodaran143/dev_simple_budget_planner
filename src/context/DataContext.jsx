import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loadValue, saveValue } from '../utils/storage'
import { currentMonthKey, monthKey, todayISO } from '../utils/format'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [entries, setEntries] = useState(() => loadValue('entries', []))
  const [goals, setGoals] = useState(() => loadValue('goals', []))
  const [budgets, setBudgets] = useState(() => loadValue('budgets', {}))

  useEffect(() => saveValue('entries', entries), [entries])
  useEffect(() => saveValue('goals', goals), [goals])
  useEffect(() => saveValue('budgets', budgets), [budgets])

  // ---- Transactions ----

  function addEntry(entry) {
    setEntries((prev) => [...prev, { id: crypto.randomUUID(), ...entry }])
  }

  function deleteEntry(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      if (a.date === b.date) return a.id < b.id ? -1 : 1
      return a.date < b.date ? -1 : 1
    })
  }, [entries])

  const totals = useMemo(() => {
    let income = 0
    let expense = 0
    for (const e of entries) {
      if (e.type === 'income') income += e.amount
      else expense += e.amount
    }
    return { income, expense, balance: income - expense }
  }, [entries])

  // ---- Savings goals ----
  // Contributions are just ledger withdrawals tagged with a goalId and the
  // "Savings" category, so a goal's saved amount is always derived from the
  // single source of truth (the ledger) rather than duplicated state.

  function addGoal(goal) {
    setGoals((prev) => [...prev, { id: crypto.randomUUID(), createdDate: todayISO(), ...goal }])
  }

  function deleteGoal(id) {
    setGoals((prev) => prev.filter((g) => g.id !== id))
    // Contributions already made stay in the ledger as ordinary withdrawals,
    // so deleting a goal never silently erases spending history.
  }

  function contributeToGoal(goalId, amount, note) {
    const goal = goals.find((g) => g.id === goalId)
    if (!goal) return
    addEntry({
      type: 'expense',
      category: 'Savings',
      goalId,
      date: todayISO(),
      description: note?.trim() || `Saved for ${goal.name}`,
      amount,
    })
  }

  const goalsWithProgress = useMemo(() => {
    return goals.map((goal) => {
      const saved = entries
        .filter((e) => e.goalId === goal.id)
        .reduce((sum, e) => sum + e.amount, 0)
      const pct = goal.targetAmount > 0 ? Math.min(100, (saved / goal.targetAmount) * 100) : 0
      return { ...goal, saved, pct, isComplete: saved >= goal.targetAmount }
    })
  }, [goals, entries])

  // ---- Budgets ----

  function setBudget(category, limit) {
    setBudgets((prev) => ({ ...prev, [category]: limit }))
  }

  function spentByCategory(targetMonthKey = currentMonthKey()) {
    const map = {}
    for (const e of entries) {
      if (e.type !== 'expense') continue
      if (monthKey(e.date) !== targetMonthKey) continue
      map[e.category] = (map[e.category] || 0) + e.amount
    }
    return map
  }

  // Last N months of income/expense totals, oldest first — used by Reports.
  function monthlyTrend(months = 6) {
    const now = new Date()
    const buckets = []
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      buckets.push({ key, income: 0, expense: 0 })
    }
    const byKey = Object.fromEntries(buckets.map((b) => [b.key, b]))
    for (const e of entries) {
      const k = monthKey(e.date)
      if (!byKey[k]) continue
      if (e.type === 'income') byKey[k].income += e.amount
      else byKey[k].expense += e.amount
    }
    return buckets
  }

  function resetAllData() {
    setEntries([])
    setGoals([])
    setBudgets({})
  }

  const value = {
    entries: sortedEntries,
    addEntry,
    deleteEntry,
    totals,
    goals: goalsWithProgress,
    addGoal,
    deleteGoal,
    contributeToGoal,
    budgets,
    setBudget,
    spentByCategory,
    monthlyTrend,
    resetAllData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within a DataProvider')
  return ctx
}
