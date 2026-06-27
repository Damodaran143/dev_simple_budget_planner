import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function switchMode(nextMode) {
    setMode(nextMode)
    setError('')
    setInfo('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')

    if (!name.trim()) {
      setError('Enter your name.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setIsSubmitting(true)
    try {
      if (mode === 'signup') {
        await signup(name.trim(), password)
        setInfo('Account created — sign in below to continue.')
        setMode('login')
        setPassword('')
      } else {
        await login(name.trim(), password)
        navigate('/app/overview', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isSignup = mode === 'signup'

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__emblem" aria-hidden="true">₹</div>
        <p className="login__eyebrow">Personal Ledger</p>
        <h1 className="login__title">Simple Budget Planner</h1>
        <p className="login__subtitle">
          {isSignup ? 'Create an account to open your passbook' : 'Sign in to open your passbook'}
        </p>

        <div className="slip__toggle" role="radiogroup" aria-label="Auth mode" style={{ marginBottom: 18 }}>
          <button
            type="button"
            role="radio"
            aria-checked={!isSignup}
            className={`slip__toggle-btn slip__toggle-btn--credit ${!isSignup ? 'is-active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Sign in
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={isSignup}
            className={`slip__toggle-btn slip__toggle-btn--debit ${isSignup ? 'is-active' : ''}`}
            onClick={() => switchMode('signup')}
          >
            Create account
          </button>
        </div>

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
          <button type="submit" className="login__submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
          </button>
        </form>

        {error && <p className="slip__error" role="alert">{error}</p>}
        {info && <p className="login__note" role="status">{info}</p>}

        <p className="login__note">
          {isSignup
            ? 'Pick a name that isn\'t already taken and a password with at least 8 characters.'
            : 'Your statement, goals, and budgets are saved to your account on the server.'}
        </p>
      </div>
    </div>
  )
}
