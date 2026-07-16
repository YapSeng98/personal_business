import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import BottomNav from './BottomNav'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        {/* pb clears the mobile bottom tab bar (plus the iOS home-indicator inset). */}
        <main className="flex-1 px-4 sm:px-6 pt-4 sm:pt-6 pb-[calc(72px+env(safe-area-inset-bottom))] md:pb-6 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
