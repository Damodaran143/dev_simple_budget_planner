import { useState } from 'react'
import { formatINR } from '../utils/format'

export default function BudgetRow({ category, limit, spent, onSetLimit }) {
  const [draft, setDraft] = useState(limit ?? '')

  function handleBlurOrSubmit() {
    const value = Number(draft)
    if (draft === '' || Number.isNaN(value) || value < 0) {
      onSetLimit(category, 0)
      setDraft('')
      return
    }
    onSetLimit(category, value)
  }

  const hasLimit = Boolean(limit)
  const pct = hasLimit ? Math.min(100, (spent / limit) * 100) : 0
  const isOver = hasLimit && spent > limit
  const status = !hasLimit ? 'neutral' : isOver ? 'over' : pct >= 70 ? 'warn' : 'ok'

  return (
    <div className="budget-row">
      <div className="budget-row__top">
        <span className="budget-row__category">{category}</span>
        <form
          className="budget-row__limit"
          onSubmit={(e) => { e.preventDefault(); handleBlurOrSubmit() }}
        >
          <span>₹</span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="No limit"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleBlurOrSubmit}
          />
          <span className="budget-row__limit-suffix">/ month</span>
        </form>
      </div>

      <div className={`progress-track progress-track--${status}`}>
        <div className="progress-fill" style={{ width: `${hasLimit ? pct : 0}%` }} />
      </div>

      <div className="budget-row__bottom">
        <span>Spent ₹{formatINR(spent)}</span>
        {hasLimit ? (
          <span className={isOver ? 'budget-row__over' : ''}>
            {isOver ? `₹${formatINR(spent - limit)} over budget` : `₹${formatINR(limit - spent)} left`}
          </span>
        ) : (
          <span className="ink-soft">Set a limit to track this</span>
        )}
      </div>
    </div>
  )
}
