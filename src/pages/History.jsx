import { useMemo, useState } from 'react'
import { useData } from '../context/DataContext'
import Ledger from '../components/Ledger'
import { CATEGORIES } from '../utils/format'

function downloadCSV(entries) {
  const header = ['Date', 'Type', 'Category', 'Particulars', 'Amount']
  const rows = entries.map((e) => [
    e.date,
    e.type === 'income' ? 'Deposit' : 'Withdrawal',
    e.category,
    `"${e.description.replace(/"/g, '""')}"`,
    e.amount,
  ])
  const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `budget-statement-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function History() {
  const { entries, deleteEntry } = useData()
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const allCategories = useMemo(
    () => Array.from(new Set([...CATEGORIES.income, ...CATEGORIES.expense])).sort(),
    [],
  )

  const filters = { search, type, category, dateFrom, dateTo }

  function clearFilters() {
    setSearch('')
    setType('all')
    setCategory('all')
    setDateFrom('')
    setDateTo('')
  }

  return (
    <div className="page-stack">
      <div className="page-head-row">
        <div>
          <h1 className="page-title">Statement of Account</h1>
          <p className="page-subtitle">Every deposit and withdrawal, in order.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={() => downloadCSV(entries)}>
          Export CSV
        </button>
      </div>

      <section className="filter-bar">
        <label className="field field--grow">
          <span>Search</span>
          <input
            type="text"
            placeholder="Search particulars…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className="field">
          <span>Type</span>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All</option>
            <option value="income">Deposits</option>
            <option value="expense">Withdrawals</option>
          </select>
        </label>
        <label className="field">
          <span>Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All</option>
            {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="field">
          <span>From</span>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </label>
        <label className="field">
          <span>To</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </label>
        <button type="button" className="btn-ghost" onClick={clearFilters}>Clear</button>
      </section>

      <Ledger entries={entries} filters={filters} onDelete={deleteEntry} />
    </div>
  )
}
