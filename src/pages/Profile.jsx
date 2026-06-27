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
  const { user, updateProfile } = useAuth()
  const { entries, goals, budgets, resetAllData } = useData()
  const [name, setName] = useState(user?.name || '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Name cannot be blank.')
      return
    }
    setIsSaving(true)
    try {
      await updateProfile(name.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.message || 'Could not save your name.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleReset() {
    const confirmed = window.confirm(
      'This permanently deletes all transactions, goals, and budgets from your account. This cannot be undone. Continue?',
    )
    if (!confirmed) return
    setIsResetting(true)
    try {
      await resetAllData()
    } catch (err) {
      setError(err.message || 'Could not reset your data.')
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="page-stack">
      <div>
        <h1 className="page-title">Profile &amp; Settings</h1>
        <p className="page-subtitle">
          {user?.since && `Member since ${new Date(user.since).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`}
        </p>
      </div>

      <section className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Display name</h2>
        </div>
        <form className="profile-form" onSubmit={handleSave}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit" className="slip__submit slip__submit--income" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save'}
          </button>
          {saved && <span className="profile-form__saved">Saved ✓</span>}
        </form>
        {error && <p className="slip__error" role="alert">{error}</p>}
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
          <button type="button" className="btn-danger" onClick={handleReset} disabled={isResetting}>
            {isResetting ? 'Resetting…' : 'Reset all data'}
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panel__head">
          <h2 className="panel__title">About your account</h2>
        </div>
        <p className="panel__hint">
          Your statement, goals, and budgets are stored on the server under your account,
          so they'll be there the next time you sign in from any device.
        </p>
      </section>
    </div>
  )
}
