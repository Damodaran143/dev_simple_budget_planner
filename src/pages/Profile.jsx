import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

function downloadJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `budget-planner-backup-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export default function Profile() {
  const { user, login } = useAuth()
  const { entries, goals, budgets, resetAllData } = useData()
  const [name, setName] = useState(user?.name || '')
  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    login(name)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleReset() {
    const confirmed = window.confirm(
      'This clears all transactions, goals, and budgets from this browser. This cannot be undone. Continue?',
    )
    if (confirmed) resetAllData()
  }

  return (
    <div className="page-stack">
      <div>
        <h1 className="page-title">Profile &amp; Settings</h1>
        <p className="page-subtitle">This is a frontend-only demo — everything lives in your browser.</p>
      </div>

      <section className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Display name</h2>
        </div>
        <form className="profile-form" onSubmit={handleSave}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit" className="slip__submit slip__submit--income">Save</button>
          {saved && <span className="profile-form__saved">Saved ✓</span>}
        </form>
      </section>

      <section className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Your data</h2>
        </div>
        <p className="panel__hint" style={{ marginBottom: 14 }}>
          {entries.length} entries &middot; {goals.length} savings goals &middot;{' '}
          {Object.keys(budgets).length} budget{Object.keys(budgets).length === 1 ? '' : 's'} set
        </p>
        <div className="profile-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => downloadJSON({ entries, goals, budgets, exportedAt: new Date().toISOString() })}
          >
            Export all data (JSON)
          </button>
          <button type="button" className="btn-danger" onClick={handleReset}>
            Reset all data
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panel__head">
          <h2 className="panel__title">About this demo</h2>
        </div>
        <p className="panel__hint">
          Sign-in accepts any name and password — there's no real backend or authentication.
          Your statement, goals, and budgets are saved only to this browser's local storage,
          so clearing site data or switching devices will not carry them over.
        </p>
      </section>
    </div>
  )
}
