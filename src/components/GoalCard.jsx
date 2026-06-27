import { useState } from 'react'
import { formatDate, formatINR } from '../utils/format'

export default function GoalCard({ goal, onContribute, onDelete }) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  function handleContribute(e) {
    e.preventDefault()
    const value = Number(amount)
    if (!amount || Number.isNaN(value) || value <= 0) {
      setError('Enter an amount greater than zero.')
      return
    }
    onContribute(goal.id, value)
    setAmount('')
    setError('')
  }

  const remaining = Math.max(0, goal.targetAmount - goal.saved)

  return (
    <div className={`goal-card ${goal.isComplete ? 'is-complete' : ''}`}>
      <div className="goal-card__head">
        <div>
          <h3 className="goal-card__name">{goal.name}</h3>
          {goal.targetDate && (
            <p className="goal-card__date">Target: {formatDate(goal.targetDate)}</p>
          )}
        </div>
        <button
          type="button"
          className="goal-card__delete"
          onClick={() => onDelete(goal.id)}
          aria-label={`Delete goal: ${goal.name}`}
        >
          ✕
        </button>
      </div>

      <div className="goal-card__amounts">
        <span className="goal-card__saved">₹{formatINR(goal.saved)}</span>
        <span className="goal-card__target">of ₹{formatINR(goal.targetAmount)}</span>
      </div>

      <div className="progress-track" role="progressbar" aria-valuenow={Math.round(goal.pct)} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${goal.pct}%` }} />
      </div>

      {goal.isComplete ? (
        <p className="goal-card__status goal-card__status--done">Goal reached 🎉</p>
      ) : (
        <p className="goal-card__status">₹{formatINR(remaining)} to go</p>
      )}

      {!goal.isComplete && (
        <form className="goal-card__form" onSubmit={handleContribute}>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="Add money (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      )}
      {error && <p className="slip__error">{error}</p>}
    </div>
  )
}
