import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/app/overview', label: 'Overview', icon: '◆' },
  { to: '/app/history', label: 'History', icon: '☰' },
  { to: '/app/savings', label: 'Savings Goals', icon: '◎' },
  { to: '/app/budgets', label: 'Budgets', icon: '▭' },
  { to: '/app/reports', label: 'Reports', icon: '◑' },
  { to: '/app/profile', label: 'Profile', icon: '●' },
]

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__emblem" aria-hidden="true">₹</div>
        <div>
          <p className="sidebar__eyebrow">Personal Ledger</p>
          <p className="sidebar__title">Budget Planner</p>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Main">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}
          >
            <span className="sidebar__link-icon" aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <p className="sidebar__user">{user?.name}</p>
        <button type="button" className="sidebar__logout" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </aside>
  )
}
