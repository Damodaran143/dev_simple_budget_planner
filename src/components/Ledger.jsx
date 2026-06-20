import { useMemo } from 'react'
import { formatDate, formatINR } from '../utils/format'

/**
 * Renders the full chronological ledger with a running balance.
 * The balance is always computed over the complete `entries` array first —
 * filters only hide rows from view, they never change the math, exactly
 * like flipping through a real passbook and skimming for what you need.
 */
export default function Ledger({ entries, filters, onDelete }) {
  const rows = useMemo(() => {
    let running = 0
    const withBalance = entries.map((entry) => {
      running += entry.type === 'income' ? entry.amount : -entry.amount
      return { ...entry, balance: running }
    })

    if (!filters) return withBalance

    const { search = '', type = 'all', category = 'all', dateFrom = '', dateTo = '' } = filters
    const needle = search.trim().toLowerCase()

    return withBalance.filter((row) => {
      if (type !== 'all' && row.type !== type) return false
      if (category !== 'all' && row.category !== category) return false
      if (dateFrom && row.date < dateFrom) return false
      if (dateTo && row.date > dateTo) return false
      if (needle && !row.description.toLowerCase().includes(needle)) return false
      return true
    })
  }, [entries, filters])

  if (entries.length === 0) {
    return (
      <div className="ledger__empty">
        <p>This passbook is blank.</p>
        <p className="ledger__empty-sub">Record your first deposit or withdrawal to start the statement.</p>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="ledger__empty">
        <p>No entries match these filters.</p>
      </div>
    )
  }

  return (
    <div className="ledger__table-wrap">
      <table className="ledger__table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Date</th>
            <th scope="col">Particulars</th>
            <th scope="col">Category</th>
            <th scope="col" className="num">Withdrawal</th>
            <th scope="col" className="num">Deposit</th>
            <th scope="col" className="num">Balance</th>
            {onDelete && <th scope="col" className="ledger__col-action"><span className="sr-only">Void</span></th>}
          </tr>
        </thead>
        <tbody>
          {[...rows].reverse().map((row) => (
            <tr key={row.id}>
              <td className="num">{entries.findIndex((e) => e.id === row.id) + 1}</td>
              <td>{formatDate(row.date)}</td>
              <td>{row.description}</td>
              <td><span className={`tag tag--${row.type}`}>{row.category}</span></td>
              <td className="num debit">{row.type === 'expense' ? formatINR(row.amount) : ''}</td>
              <td className="num credit">{row.type === 'income' ? formatINR(row.amount) : ''}</td>
              <td className="num balance">₹{formatINR(row.balance)}</td>
              {onDelete && (
                <td className="ledger__col-action">
                  <button
                    type="button"
                    className="void-btn"
                    onClick={() => onDelete(row.id)}
                    aria-label={`Void entry: ${row.description}`}
                  >
                    Void
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
