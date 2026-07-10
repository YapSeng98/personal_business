import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Users, Target, ArrowRight, Calendar, UserPlus, Network,
  MapPin, Clock, ShoppingCart, GraduationCap, Rocket, UserCheck,
  PartyPopper, Award, FileQuestion,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getPartners, getGoals, getActivities, getPurchases } from '../services/servicenow'
import type { ActivityCategory } from '../types'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Badge from '../components/ui/Badge'
import { dateKey } from '../lib/calendar'

const catConfig: Record<ActivityCategory, { icon: React.ElementType; tile: string }> = {
  Meeting: { icon: Users, tile: 'bg-blue-500/15 text-blue-300' },
  Training: { icon: GraduationCap, tile: 'bg-violet-500/15 text-violet-300' },
  'Product Launch': { icon: Rocket, tile: 'bg-amber-500/15 text-amber-300' },
  Recruiting: { icon: UserCheck, tile: 'bg-emerald-500/15 text-emerald-300' },
  Social: { icon: PartyPopper, tile: 'bg-pink-500/15 text-pink-300' },
  Recognition: { icon: Award, tile: 'bg-yellow-500/15 text-yellow-300' },
  Other: { icon: FileQuestion, tile: 'bg-slate-500/15 text-slate-300' },
}

function StatCard({ label, value, icon: Icon, sub, color = 'brand' }: {
  label: string; value: string | number; icon: React.ElementType; sub?: string
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
        <p className="text-lg sm:text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
        <p className="text-xs sm:text-sm text-slate-500 leading-tight">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5 truncate hidden sm:block">{sub}</p>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { credentials } = useAuth()

  const { data: activities = [], isLoading: l1 } = useQuery({
    queryKey: ['activities'], queryFn: () => getActivities(credentials!), enabled: !!credentials,
  })
  const { data: partners = [], isLoading: l2 } = useQuery({
    queryKey: ['partners'], queryFn: () => getPartners(credentials!), enabled: !!credentials,
  })
  const { data: goals = [], isLoading: l3 } = useQuery({
    queryKey: ['goals'], queryFn: () => getGoals(credentials!), enabled: !!credentials,
  })
  const { data: purchases = [], isLoading: l4 } = useQuery({
    queryKey: ['purchases'], queryFn: () => getPurchases(credentials!), enabled: !!credentials,
  })

  if (l1 || l2 || l3 || l4) return <LoadingSpinner message="Loading dashboard..." />

  const today = dateKey(new Date())
  const monthPrefix = today.slice(0, 7)

  const upcoming = [...activities]
    .filter(a => a.u_activity_date && a.u_activity_date >= today && a.u_status !== 'cancelled')
    .sort((a, b) => (a.u_activity_date + a.u_activity_time).localeCompare(b.u_activity_date + b.u_activity_time))
    .slice(0, 6)
  const activitiesThisMonth = activities.filter(a => a.u_activity_date?.startsWith(monthPrefix)).length

  const activePartners = partners.filter(p => p.u_status === 'active')
  const prospects = partners.filter(p => p.u_status === 'prospect')
  const activeGoals = goals.filter(g => g.u_status === 'active')

  const recentOrders = [...purchases]
    .sort((a, b) => new Date(b.sys_created_on).getTime() - new Date(a.sys_created_on).getTime())
    .slice(0, 4)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'

  function fmtDate(d: string) {
    if (d === today) return 'Today'
    return new Date(d).toLocaleDateString('en-MY', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  return (
    <div className="space-y-5 sm:space-y-6 w-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Good {greeting} 👋</h2>
        <p className="text-slate-500 text-sm mt-0.5">Here's what's happening across your activities and network.</p>
      </div>

      {/* Stats — activity & network focused */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Upcoming Activities" value={upcoming.length} icon={Calendar} color="brand" sub={`${activitiesThisMonth} this month`} />
        <StatCard label="Active Partners" value={activePartners.length} icon={Network} color="emerald" sub={`${partners.length} total`} />
        <StatCard label="Prospects" value={prospects.length} icon={UserPlus} color="amber" sub="recruiting pipeline" />
        <StatCard label="Active Goals" value={activeGoals.length} icon={Target} color="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Upcoming activities — the hero */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-400" /> Upcoming Activities
            </h3>
            <Link to="/activities" className="text-xs text-brand-600 hover:underline flex items-center gap-0.5">
              Calendar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="text-center py-10">
              <Calendar className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No upcoming activities scheduled.</p>
              <Link to="/activities" className="btn-primary mt-3 text-xs py-1.5 px-3 inline-flex">
                <Calendar className="w-3 h-3" /> Plan an activity
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {upcoming.map(a => {
                const cfg = catConfig[a.u_category] ?? catConfig.Other
                const Icon = cfg.icon
                return (
                  <Link key={a.sys_id} to="/activities" className="flex items-center gap-3 rounded-xl border border-slate-100 hover:border-brand-300 hover:bg-brand-50/40 px-3 py-2.5 transition-colors">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.tile}`}>
                      <Icon className="w-4.5 h-4.5 w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 truncate">{a.u_title}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        {a.u_activity_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.u_activity_time}</span>}
                        {a.u_address && <span className="flex items-center gap-1 truncate"><MapPin className="w-3 h-3 shrink-0" />{a.u_address}</span>}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-500 shrink-0">{fmtDate(a.u_activity_date)}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Goals */}
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
              {activeGoals.slice(0, 5).map(g => {
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
                      <div className={`h-full rounded-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-brand-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Network snapshot */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Network className="w-4 h-4 text-emerald-400" /> Your Network
            </h3>
            <Link to="/partners" className="text-xs text-brand-600 hover:underline flex items-center gap-0.5">
              Partners <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-100 px-3 py-4 text-center">
              <p className="text-2xl font-bold text-emerald-500 tabular-nums">{activePartners.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">Active</p>
            </div>
            <div className="rounded-xl border border-slate-100 px-3 py-4 text-center">
              <p className="text-2xl font-bold text-amber-500 tabular-nums">{prospects.length}</p>
              <p className="text-xs text-slate-400 mt-0.5">Prospects</p>
            </div>
            <div className="rounded-xl border border-slate-100 px-3 py-4 text-center">
              <p className="text-2xl font-bold text-slate-500 tabular-nums">{partners.filter(p => !p.u_sponsor).length}</p>
              <p className="text-xs text-slate-400 mt-0.5">Unassigned</p>
            </div>
          </div>
          <Link to="/partners/tree" className="btn-secondary w-full justify-center mt-3 text-xs py-2">
            <Network className="w-3.5 h-3.5" /> View relationship tree
          </Link>
        </div>

        {/* Recent orders — de-emphasized, occasional non-member sales */}
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
              <ShoppingCart className="w-4 h-4 text-slate-400" /> Recent Orders
            </h3>
            <Link to="/purchases" className="text-xs text-brand-600 hover:underline">All</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-slate-400">No orders yet.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentOrders.map(p => (
                <div key={p.sys_id} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-700 truncate">{p.u_customer_display || '—'}</p>
                    <span className="text-sm font-semibold text-slate-900 shrink-0 tabular-nums">RM {parseFloat(p.u_amount || '0').toLocaleString('en-MY')}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-xs text-slate-400 truncate">{p.u_product_name}</p>
                    <Badge label={p.u_status} variant={p.u_status === 'completed' ? 'green' : p.u_status === 'pending' ? 'yellow' : 'red'} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
