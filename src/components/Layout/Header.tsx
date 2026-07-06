import { useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/customers': 'Customers',
  '/customers/new': 'New Customer',
  '/purchases': 'All Purchases',
  '/goals': 'My Goals',
  '/products': 'Product Catalog',
  '/activities': 'Activities',
  '/partners': 'Partners',
  '/partners/tree': 'Relationship Tree',
}

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { pathname } = useLocation()

  const title =
    titles[pathname] ??
    (pathname.startsWith('/customers/') ? 'Customer Detail' : 'BizTrack')

  return (
    <header className="h-16 flex items-center gap-3 px-4 sm:px-6 border-b border-slate-100 bg-white">
      <button
        onClick={onMenuClick}
        className="md:hidden w-9 h-9 -ml-1 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-500 transition-colors shrink-0"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>
      <h1 className="text-lg font-semibold text-slate-900 truncate">{title}</h1>
    </header>
  )
}
