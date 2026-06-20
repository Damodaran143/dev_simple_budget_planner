import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="shell">
      <div className={`shell__sidebar ${navOpen ? 'is-open' : ''}`}>
        <Sidebar onNavigate={() => setNavOpen(false)} />
      </div>

      {navOpen && (
        <button
          className="shell__scrim"
          aria-label="Close menu"
          onClick={() => setNavOpen(false)}
        />
      )}

      <div className="shell__main">
        <header className="shell__topbar">
          <button
            type="button"
            className="shell__menu-btn"
            aria-label="Open menu"
            onClick={() => setNavOpen(true)}
          >
            ☰
          </button>
          <span className="shell__topbar-title">Simple Budget Planner</span>
        </header>
        <div className="shell__content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
