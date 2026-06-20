import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import SummaryStamps from '../components/SummaryStamps'
import TransactionForm from '../components/TransactionForm'
import { formatDate, formatINR } from '../utils/format'

export default function Overview() {
  const { user } = useAuth()
  const { entries, totals, addEntry } = useData()
  const recent = [...entries].slice(-5).reverse()

  return (
    <div className="page-stack">
      <div>
        <h1 className="page-title">Welcome back, {user?.name}</h1>
        <p className="page-subtitle">Here's where things stand today.</p>
      </div>

      <SummaryStamps
        totalIncome={totals.income}
        totalExpense={totals.expense}
        balance={totals.balance}
      />

      <TransactionForm onAdd={addEntry} />

      <section className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Recent activity</h2>
          <Link to="/app/history" className="panel__link">View full history →</Link>
        </div>

        {recent.length === 0 ? (
          <div className="ledger__empty">
            <p>Nothing recorded yet.</p>
            <p className="ledger__empty-sub">Use the form above to add your first entry.</p>
          </div>
        ) : (
          <ul className="recent-list">
            {recent.map((e) => (
              <li key={e.id} className="recent-list__item">
                <div>
                  <span className="recent-list__desc">{e.description}</span>
                  <span className="recent-list__meta">{e.category} &middot; {formatDate(e.date)}</span>
                </div>
                <span className={`recent-list__amount ${e.type === 'income' ? 'credit' : 'debit'}`}>
                  {e.type === 'income' ? '+' : '−'}₹{formatINR(e.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
