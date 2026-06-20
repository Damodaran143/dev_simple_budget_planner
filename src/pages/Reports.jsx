import { useMemo } from 'react'
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { useData } from '../context/DataContext'
import { CATEGORY_COLORS, formatINR, monthLabel } from '../utils/format'

export default function Reports() {
  const { entries, monthlyTrend } = useData()

  const categoryBreakdown = useMemo(() => {
    const map = {}
    for (const e of entries) {
      if (e.type !== 'expense') continue
      map[e.category] = (map[e.category] || 0) + e.amount
    }
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [entries])

  const trend = useMemo(
    () => monthlyTrend(6).map((m) => ({ ...m, label: monthLabel(m.key) })),
    [monthlyTrend],
  )

  const hasExpenses = categoryBreakdown.length > 0

  return (
    <div className="page-stack">
      <div>
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">Where your money goes, and how it's trending.</p>
      </div>

      <section className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Spending by category</h2>
          <span className="panel__hint">All-time withdrawals</span>
        </div>
        {!hasExpenses ? (
          <div className="ledger__empty">
            <p>No withdrawals recorded yet.</p>
          </div>
        ) : (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                >
                  {categoryBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#8a7a5c'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${formatINR(value)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Income vs. expenses</h2>
          <span className="panel__hint">Last 6 months</span>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3dac4" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#646b80' }} />
              <YAxis tick={{ fontSize: 12, fill: '#646b80' }} />
              <Tooltip formatter={(value) => `₹${formatINR(value)}`} />
              <Legend />
              <Bar dataKey="income" name="Deposits" fill="#2f6f4f" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Withdrawals" fill="#a23e2f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}
