'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Bus,
  Users,
  MapPin,
  Route,
  Ticket,
  Wrench,
  DollarSign,
  Brain,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { DASHBOARD_NAV } from '@/lib/constants'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Bus,
  Users,
  MapPin,
  Route,
  Ticket,
  Wrench,
  DollarSign,
  Brain,
  Settings,
}

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const crumbs: { label: string; href: string }[] = []

  const labelMap: Record<string, string> = {
    dashboard: 'Dashboard',
    flota: 'Flota',
    conductores: 'Conductores',
    gps: 'GPS en Vivo',
    viajes: 'Viajes',
    boletos: 'Boletos',
    mantenimiento: 'Mantenimiento',
    finanzas: 'Finanzas',
    analytics: 'Analytics IA',
    configuracion: 'Configuracion',
  }

  let path = ''
  for (const segment of segments) {
    path += `/${segment}`
    crumbs.push({
      label: labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href: path,
    })
  }

  return crumbs
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const breadcrumbs = getBreadcrumbs(pathname)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============ Mobile Overlay ============ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ============ Sidebar ============ */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-secondary-900 flex flex-col transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Gradient accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />

        {/* Logo area */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/30">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight font-[family-name:var(--font-poppins)]">
                TransRosa
              </h1>
              <p className="text-[10px] text-white/40 -mt-0.5 tracking-wider uppercase">
                Panel de Control
              </p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <p className="px-4 mb-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
            Menu principal
          </p>
          {DASHBOARD_NAV.map((item) => {
            const Icon = iconMap[item.icon]
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  isActive ? 'sidebar-link-active' : 'sidebar-link'
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      'w-5 h-5 shrink-0',
                      isActive ? 'text-primary-400' : 'text-gray-500'
                    )}
                  />
                )}
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Profile at bottom */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              FG
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                Francisco Granados
              </p>
              <p className="text-xs text-white/40 truncate">Administrador</p>
            </div>
            <LogOut className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors shrink-0" />
          </div>
        </div>
      </aside>

      {/* ============ Main Content Area ============ */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/80">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Left: hamburger + breadcrumbs */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              <nav className="hidden sm:flex items-center gap-1 text-sm">
                {breadcrumbs.map((crumb, i) => (
                  <div key={crumb.href} className="flex items-center gap-1">
                    {i > 0 && (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                    )}
                    {i === breadcrumbs.length - 1 ? (
                      <span className="font-semibold text-gray-900">
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Right: search, notifications, avatar */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl w-64 group focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:bg-white focus-within:border focus-within:border-primary-200 transition-all">
                <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary-500" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none w-full"
                />
                <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded bg-gray-200 text-[10px] font-mono text-gray-400">
                  /
                </kbd>
              </div>

              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary-500 rounded-full border-2 border-white" />
              </button>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-gray-200 mx-1" />

              {/* User avatar */}
              <button className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  FG
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    Francisco
                  </p>
                  <p className="text-[10px] text-gray-400 leading-tight">
                    Admin
                  </p>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
