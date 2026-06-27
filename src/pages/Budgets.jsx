import { useMemo } from 'react'
import { useData } from '../context/DataContext'
import BudgetRow from '../components/BudgetRow'
import { BUDGETABLE_CATEGORIES, currentMonthKey, monthLabel } from '../utils/format'

export default function Budgets() {
  const { budgets, setBudget, spentByCategory } = useData()
  const monthKeyNow = currentMonthKey()
  const spent = useMemo(() => spentByCategory(monthKeyNow), [spentByCategory, monthKeyNow])

  const totalLimit = BUDGETABLE_CATEGORIES.reduce((sum, c) => sum + (budgets[c] || 0), 0)
  const totalSpent = BUDGETABLE_CATEGORIES.reduce((sum, c) => sum + (spent[c] || 0), 0)

  return (
    <div className="page-stack">
      <div>
        <h1 className="page-title">Budgets</h1>
        <p className="page-subtitle">Monthly limits for {monthLabel(monthKeyNow)}, by category.</p>
      </div>

      {totalLimit > 0 && (
        <section className="panel">
          <div className="panel__head">
            <h2 className="panel__title">This month, overall</h2>
          </div>
          <div className={`progress-track ${totalSpent > totalLimit ? 'progress-track--over' : ''}`}>
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, (totalSpent / totalLimit) * 100)}%` }}
            />
          </div>
          <p className="budget-row__bottom" style={{ marginTop: 8 }}>
            <span>₹{totalSpent.toFixed(2)} spent of ₹{totalLimit.toFixed(2)} budgeted</span>
          </p>
        </section>
      )}

      <section className="panel budget-list">
        {BUDGETABLE_CATEGORIES.map((category) => (
          <BudgetRow
            key={category}
            category={category}
            limit={budgets[category] || 0}
            spent={spent[category] || 0}
            onSetLimit={setBudget}
          />
        ))}
      </section>
    </div>
  )
}
