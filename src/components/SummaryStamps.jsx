import { formatINR } from '../utils/format'

export default function SummaryStamps({ totalIncome, totalExpense, balance }) {
  return (
    <section className="stamps" aria-label="Account summary">
      <div className="stamp stamp--credit">
        <span className="stamp__label">Total Deposits</span>
        <span className="stamp__amount">₹{formatINR(totalIncome)}</span>
      </div>
      <div className="stamp stamp--debit">
        <span className="stamp__label">Total Withdrawals</span>
        <span className="stamp__amount">₹{formatINR(totalExpense)}</span>
      </div>
      <div className={`stamp stamp--balance ${balance < 0 ? 'is-negative' : ''}`}>
        <span className="stamp__label">Closing Balance</span>
        <span className="stamp__amount">₹{formatINR(balance)}</span>
      </div>
    </section>
  )
}
