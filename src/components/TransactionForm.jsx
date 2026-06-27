import { useState } from 'react'
import { CATEGORIES } from '../utils/format'

const todayISO = () => new Date().toISOString().slice(0, 10)

const initialState = {
  type: 'expense',
  date: todayISO(),
  description: '',
  category: CATEGORIES.expense[0],
  amount: '',
}

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState(initialState)
  const [error, setError] = useState('')

  function update(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      // Keep the category list in sync with the slip type
      if (field === 'type') {
        next.category = CATEGORIES[value][0]
      }
      return next
    })
  }

  function handleSubmit(e) {
    e.preventDefault()

    const trimmedDescription = form.description.trim()
    const amountValue = Number(form.amount)

    if (!trimmedDescription) {
      setError('Add a short note for this entry.')
      return
    }
    if (!form.amount || Number.isNaN(amountValue) || amountValue <= 0) {
      setError('Amount must be a number greater than zero.')
      return
    }

    onAdd({
      id: crypto.randomUUID(),
      type: form.type,
      date: form.date || todayISO(),
      description: trimmedDescription,
      category: form.category,
      amount: amountValue,
    })

    setError('')
    setForm((prev) => ({ ...initialState, type: prev.type, category: CATEGORIES[prev.type][0] }))
  }

  const categories = CATEGORIES[form.type]

  return (
    <section className="slip">
      <div className="slip__head">
        <span className="slip__title">New Entry</span>
        <div className="slip__toggle" role="radiogroup" aria-label="Entry type">
          <button
            type="button"
            role="radio"
            aria-checked={form.type === 'expense'}
            className={`slip__toggle-btn slip__toggle-btn--debit ${form.type === 'expense' ? 'is-active' : ''}`}
            onClick={() => update('type', 'expense')}
          >
            Withdrawal
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={form.type === 'income'}
            className={`slip__toggle-btn slip__toggle-btn--credit ${form.type === 'income' ? 'is-active' : ''}`}
            onClick={() => update('type', 'income')}
          >
            Deposit
          </button>
        </div>
      </div>

      <form className="slip__form" onSubmit={handleSubmit} noValidate>
        <label className="field field--date">
          <span>Date</span>
          <input
            type="date"
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
          />
        </label>

        <label className="field field--desc">
          <span>Particulars</span>
          <input
            type="text"
            placeholder={form.type === 'income' ? 'e.g. June salary' : 'e.g. Groceries'}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </label>

        <label className="field field--cat">
          <span>Category</span>
          <select value={form.category} onChange={(e) => update('category', e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="field field--amount">
          <span>Amount (₹)</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => update('amount', e.target.value)}
          />
        </label>

        <button type="submit" className={`slip__submit slip__submit--${form.type}`}>
          {form.type === 'income' ? 'Record Deposit' : 'Record Withdrawal'}
        </button>
      </form>

      {error && <p className="slip__error" role="alert">{error}</p>}
    </section>
  )
}
