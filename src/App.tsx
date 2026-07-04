import type { ReactNode } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CustomerList from './pages/customers/CustomerList'
import CustomerDetail from './pages/customers/CustomerDetail'
import PurchaseList from './pages/purchases/PurchaseList'
import GoalsList from './pages/goals/GoalsList'
import ProductCatalog from './pages/products/ProductCatalog'
import ActivitiesCalendar from './pages/activities/ActivitiesCalendar'
import PartnerList from './pages/partners/PartnerList'
import PartnerTree from './pages/partners/PartnerTree'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

const AUTH_GATE_ENABLED = false // TEMPORARY: set back to true to re-enable the login requirement

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (AUTH_GATE_ENABLED && !isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()
  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
        <Route path="/purchases" element={<PurchaseList />} />
        <Route path="/goals" element={<GoalsList />} />
        <Route path="/products" element={<ProductCatalog />} />
        <Route path="/activities" element={<ActivitiesCalendar />} />
        <Route path="/partners" element={<PartnerList />} />
        <Route path="/partners/tree" element={<PartnerTree />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
