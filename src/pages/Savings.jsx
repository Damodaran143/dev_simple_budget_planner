import { useState } from 'react'
import { useData } from '../context/DataContext'
import GoalCard from '../components/GoalCard'

export default function Savings() {
  const { goals, addGoal, deleteGoal, contributeToGoal } = useData()
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    const value = Number(targetAmount)

    if (!trimmed) {
      setError('Give your goal a name.')
      return
    }
    if (!targetAmount || Number.isNaN(value) || value <= 0) {
      setError('Target amount must be greater than zero.')
      return
    }

    addGoal({ name: trimmed, targetAmount: value, targetDate: targetDate || null })
    setName('')
    setTargetAmount('')
    setTargetDate('')
    setError('')
  }

  return (
    <div className="page-stack">
      <div>
        <h1 className="page-title">Savings Goals</h1>
        <p className="page-subtitle">
          Set a target and chip away at it. Every contribution is also logged as a
          withdrawal under "Savings" in your statement, so your balance always stays accurate.
        </p>
      </div>

      <section className="slip">
        <div className="slip__head">
          <span className="slip__title">New Goal</span>
        </div>
        <form className="goal-form" onSubmit={handleSubmit} noValidate>
          <label className="field field--grow">
            <span>Goal name</span>
            <input
              type="text"
              placeholder="e.g. Emergency fund"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Target amount (₹)</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Target date (optional)</span>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </label>
          <button type="submit" className="slip__submit slip__submit--income">Create goal</button>
        </form>
        {error && <p className="slip__error" role="alert">{error}</p>}
      </section>

      {goals.length === 0 ? (
        <div className="ledger__empty">
          <p>No savings goals yet.</p>
          <p className="ledger__empty-sub">Create one above — a new bike, a trip, an emergency fund.</p>
        </div>
      ) : (
        <div className="goal-grid">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onContribute={contributeToGoal}
              onDelete={deleteGoal}
            />
          ))}
        </div>
      )}
    </div>
  )
}
