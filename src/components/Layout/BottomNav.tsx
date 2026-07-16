import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, Users, Network, Target } from 'lucide-react'

// Primary destinations for the phone tab bar. The rest (Purchases, Products,
// account, Sign out) remain in the slide-over sidebar via the header ☰ menu.
const items = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/activities', icon: Calendar, label: 'Activities' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/partners', icon: Network, label: 'Partners' },
  { to: '/goals', icon: Target, label: 'Goals' },
]

export default function BottomNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-100 pb-[env(safe-area-inset-bottom)]"
      aria-label="Primary"
    >
      <div className="flex items-stretch justify-around">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[54px] text-[10px] font-medium transition-colors ${
                isActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
