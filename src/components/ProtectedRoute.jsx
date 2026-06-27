import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  // Avoid a flash-redirect to /login while we're still checking a stored token.
  if (isLoading) {
    return (
      <div className="login">
        <p className="login__note">Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}
