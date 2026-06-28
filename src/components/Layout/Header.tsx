import { useLocation } from 'react-router-dom'

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/customers': 'Customers',
  '/customers/new': 'New Customer',
  '/purchases': 'All Purchases',
  '/goals': 'My Goals',
  '/products': 'Product Catalog',
}

export default function Header() {
  const { pathname } = useLocation()

  const title =
    titles[pathname] ??
    (pathname.startsWith('/customers/') ? 'Customer Detail' : 'BizTrack')

  return (
    <header className="h-16 flex items-center px-6 border-b border-slate-100 bg-white">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
    </header>
  )
}
