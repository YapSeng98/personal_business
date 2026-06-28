import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, ShoppingCart, Target, LogOut, Briefcase, Package } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/purchases', icon: ShoppingCart, label: 'Purchases' },
  { to: '/goals', icon: Target, label: 'My Goals' },
  { to: '/products', icon: Package, label: 'Products' },
]

export default function Sidebar() {
  const { logout, credentials } = useAuth()

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-slate-900 text-base leading-tight">BizTrack</p>
          <p className="text-xs text-slate-400 leading-tight">Personal Business</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-100 ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon className="w-4.5 h-4.5 w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-100">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs font-medium text-slate-500 truncate">{credentials?.username}</p>
          <p className="text-xs text-slate-400 truncate">{credentials?.instance}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
