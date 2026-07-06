import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Users, ShoppingCart, Target, TrendingUp, DollarSign,
  CheckCircle2, Clock, ArrowRight,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useAuth } from '../contexts/AuthContext'
import { getCustomers, getPurchases, getGoals } from '../services/servicenow'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Badge from '../components/ui/Badge'

const statusVariant: Record<string, 'green' | 'yellow' | 'red'> = {
  completed: 'green',
  pending: 'yellow',
  cancelled: 'red',
}

function StatCard({
  label, value, icon: Icon, sub, color = 'brand',
}: {
  label: string
  value: string | number
  icon: React.ElementType
  sub?: string
  color?: 'brand' | 'emerald' | 'amber' | 'violet'
}) {
  const colors = {
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
  }
  return (
    <div className="card flex items-center gap-2.5 sm:gap-4 px-4 py-3.5 sm:p-6">
      <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-lg sm:text-2xl font-bold text-slate-900 tabular-nums truncate">{value}</p>
        <p className="text-xs sm:text-sm text-slate-500 leading-tight">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5 truncate hidden sm:block">{sub}</p>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { credentials } = useAuth()

  const { data: customers = [], isLoading: l1 } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers(credentials!),
    enabled: !!credentials,
  })

  const { data: purchases = [], isLoading: l2 } = useQuery({
    queryKey: ['purchases'],
    queryFn: () => getPurchases(credentials!),
    enabled: !!credentials,
  })

  const { data: goals = [], isLoading: l3 } = useQuery({
    queryKey: ['goals'],
    queryFn: () => getGoals(credentials!),
    enabled: !!credentials,
  })

  if (l1 || l2 || l3) return <LoadingSpinner message="Loading dashboard..." />

  const totalRevenue = purchases
    .filter(p => p.u_status === 'completed')
    .reduce((s, p) => s + parseFloat(p.u_amount || '0'), 0)

  const pendingOrders = purchases.filter(p => p.u_status === 'pending')
  const activeGoals = goals.filter(g => g.u_status === 'active')
  const recentPurchases = [...purchases]
    .sort((a, b) => new Date(b.sys_created_on).getTime() - new Date(a.sys_created_on).getTime())
    .slice(0, 5)

  // Monthly revenue chart data
  const monthlyMap: Record<string, number> = {}
  purchases
    .filter(p => p.u_status === 'completed')
    .forEach(p => {
      if (!p.u_purchase_date) return
      const d = new Date(p.u_purchase_date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthlyMap[key] = (monthlyMap[key] || 0) + parseFloat(p.u_amount || '0')
    })
  const chartData = Object.entries(monthlyMap)
    .sort()
    .slice(-6)
    .map(([key, value]) => {
      const [year, month] = key.split('-')
      const date = new Date(parseInt(year), parseInt(month) - 1)
      return {
        month: date.toLocaleDateString('en-MY', { month: 'short', year: '2-digit' }),
        revenue: value,
      }
    })

  return (
    <div className="space-y-5 sm:space-y-6 w-full">
      {/* Welcome */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'} 👋
        </h2>
        <p className="text-slate-500 text-sm mt-0.5">Here's your business overview for today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Customers" value={customers.length} icon={Users} color="brand" />
        <StatCard
          label="Total Revenue"
          value={`RM ${totalRevenue.toLocaleString('en-MY', { notation: 'compact', maximumFractionDigits: 1 })}`}
          icon={DollarSign}
          color="emerald"
          sub="from completed orders"
        />
        <StatCard label="Pending Orders" value={pendingOrders.length} icon={Clock} color="amber" />
        <StatCard label="Active Goals" value={activeGoals.length} icon={Target} color="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Monthly Revenue</h3>
            <TrendingUp className="w-4 h-4 text-slate-300" />
          </div>
          {chartData.length === 0 ? (
            <div className="h-[200px] sm:h-[260px] xl:h-[300px] flex items-center justify-center text-sm text-slate-400">
              No completed orders yet
            </div>
          ) : (
            <div className="h-[200px] sm:h-[260px] xl:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `RM${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v: number) => [`RM ${v.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`, 'Revenue']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Goals progress */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Goals</h3>
            <Link to="/goals" className="text-xs text-brand-600 hover:underline flex items-center gap-0.5">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {activeGoals.length === 0 ? (
            <div className="text-center py-6">
              <Target className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No active goals</p>
              <Link to="/goals" className="btn-primary mt-3 text-xs py-1.5 px-3 inline-flex">
                <Target className="w-3 h-3" /> Set a goal
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeGoals.slice(0, 4).map(g => {
                const current = parseFloat(g.u_current_value || '0')
                const target = parseFloat(g.u_target_value || '0')
                const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0
                return (
                  <div key={g.sys_id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 truncate flex-1 mr-2">{g.u_title}</span>
                      <span className="text-slate-500 shrink-0">{pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-brand-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-slate-400" /> Recent Orders
          </h3>
          <Link to="/purchases" className="text-xs text-brand-600 hover:underline flex items-center gap-0.5">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {recentPurchases.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-400">No orders yet.</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-50">
              {recentPurchases.map(p => (
                <tr key={p.sys_id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <Link to={`/customers/${p.u_customer}`} className="font-medium text-brand-600 hover:underline">
                      {p.u_customer_display || '—'}
                    </Link>
                    <p className="text-xs text-slate-400">{p.u_product_name}</p>
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold text-slate-900">
                    RM {parseFloat(p.u_amount || '0').toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-3.5">
                    <Badge label={p.u_status} variant={statusVariant[p.u_status] ?? 'slate'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  )
}
