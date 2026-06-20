import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    login(name)
    navigate('/app/overview', { replace: true })
  }

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__emblem" aria-hidden="true">₹</div>
        <p className="login__eyebrow">Personal Ledger</p>
        <h1 className="login__title">Simple Budget Planner</h1>
        <p className="login__subtitle">Sign in to open your passbook</p>

        <form onSubmit={handleSubmit} className="login__form">
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Damodaran"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit" className="login__submit">Sign in</button>
        </form>

        <p className="login__note">
          Demo mode — this is a frontend-only project, so any name and password will sign
          you in. Nothing is sent anywhere; your data stays in this browser.
        </p>
      </div>
    </div>
  )
}
