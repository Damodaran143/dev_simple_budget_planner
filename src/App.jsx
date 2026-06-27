import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import Overview from './pages/Overview'
import History from './pages/History'
import Savings from './pages/Savings'
import Budgets from './pages/Budgets'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import './App.css'

export default function App() {
  const { isAuthenticated, isLoading } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoading ? null : isAuthenticated ? <Navigate to="/app/overview" replace /> : <Login />
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="history" element={<History />} />
          <Route path="savings" element={<Savings />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to={isAuthenticated ? '/app/overview' : '/login'} replace />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/app/overview' : '/login'} replace />} />
    </Routes>
  )
}
