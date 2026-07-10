import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, ShoppingCart, Target, LogOut, Briefcase, Package, Calendar, Network, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/activities', icon: Calendar, label: 'Activities' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/partners', icon: Network, label: 'Partners' },
  { to: '/purchases', icon: ShoppingCart, label: 'Purchases' },
  { to: '/goals', icon: Target, label: 'My Goals' },
  { to: '/products', icon: Package, label: 'Products' },
]

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { logout, credentials, user, isDemo } = useAuth()

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 flex flex-col z-40 transform transition-transform duration-200 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 text-base leading-tight">BizTrack</p>
            <p className="text-xs text-slate-400 leading-tight">Personal Business</p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
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
            <p className="text-xs font-medium text-slate-500 truncate">{user?.display_name || user?.username}</p>
            {isDemo ? (
              <span className="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/25">DEMO MODE</span>
            ) : (
              <p className="text-xs text-slate-400 truncate">{credentials?.instance}</p>
            )}
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
    </>
  )
}
