'use client'

import { useState } from 'react'
import {
  Bus,
  Users,
  Route,
  DollarSign,
  UserCheck,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Fuel,
  Wrench,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { mockDashboardStats, mockDailyRevenue, mockTrips } from '@/lib/mock-data'
import { formatCurrency, getStatusColor } from '@/lib/utils'
import type { DashboardStats } from '@/types'

const stats: DashboardStats = mockDashboardStats

const kpiCards = [
  {
    label: 'Vehiculos Activos',
    value: `${stats.active_vehicles}`,
    subValue: `/ ${stats.fleet_health.total_vehicles}`,
    trend: '+12%',
    trendUp: true,
    icon: Bus,
    color: 'primary',
    bgColor: 'bg-primary-50',
    iconColor: 'text-primary-600',
    trendColor: 'text-emerald-600',
  },
  {
    label: 'Conductores en Turno',
    value: '45',
    subValue: `/ ${stats.total_drivers}`,
    trend: '+8%',
    trendUp: true,
    icon: UserCheck,
    color: 'blue',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    trendColor: 'text-emerald-600',
  },
  {
    label: 'Viajes Hoy',
    value: `${stats.trips_today}`,
    subValue: '',
    trend: '+15%',
    trendUp: true,
    icon: Route,
    color: 'emerald',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    trendColor: 'text-emerald-600',
  },
  {
    label: 'Ingresos Hoy',
    value: formatCurrency(stats.revenue_today),
    subValue: '',
    trend: '+22%',
    trendUp: true,
    icon: DollarSign,
    color: 'amber',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    trendColor: 'text-emerald-600',
  },
  {
    label: 'Pasajeros Hoy',
    value: stats.passengers_today.toLocaleString(),
    subValue: '',
    trend: '+18%',
    trendUp: true,
    icon: Users,
    color: 'violet',
    bgColor: 'bg-violet-50',
    iconColor: 'text-violet-600',
    trendColor: 'text-emerald-600',
  },
  {
    label: 'Salud de Flota',
    value: '84%',
    subValue: '',
    trend: '-2%',
    trendUp: false,
    icon: Activity,
    color: 'cyan',
    bgColor: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    trendColor: 'text-red-500',
  },
]

const revenueData = mockDailyRevenue.map((d) => ({
  date: new Date(d.date).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
  }),
  ingresos: d.total_revenue,
  gastos: d.fuel_cost + d.maintenance_cost,
  neto: d.net_revenue,
  viajes: d.total_trips,
  pasajeros: d.total_passengers,
}))

const recentTrips = mockTrips.slice(0, 10)

const alertIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
  success: CheckCircle2,
}

const alertStyles: Record<string, string> = {
  warning: 'border-l-amber-500 bg-amber-50',
  error: 'border-l-red-500 bg-red-50',
  info: 'border-l-blue-500 bg-blue-50',
  success: 'border-l-emerald-500 bg-emerald-50',
}

const alertIconStyles: Record<string, string> = {
  warning: 'text-amber-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  success: 'text-emerald-500',
}

function formatTripTime(dateStr: string | null) {
  if (!dateStr) return '--:--'
  return new Date(dateStr).toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function getDirectionLabel(dir: string) {
  return dir === 'ida' ? 'Vegueta -> Huacho' : 'Huacho -> Vegueta'
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    completed: 'Completado',
    in_progress: 'En Ruta',
    boarding: 'Abordando',
    scheduled: 'Programado',
    cancelled: 'Cancelado',
  }
  return labels[status] || status
}

export default function DashboardPage() {
  const [chartView, setChartView] = useState<'ingresos' | 'viajes'>('ingresos')

  // Summary calculations
  const totalRevenue30d = mockDailyRevenue.reduce((s, d) => s + d.total_revenue, 0)
  const totalTrips30d = mockDailyRevenue.reduce((s, d) => s + d.total_trips, 0)
  const totalPassengers30d = mockDailyRevenue.reduce((s, d) => s + d.total_passengers, 0)
  const avgDailyRevenue = totalRevenue30d / mockDailyRevenue.length

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-[family-name:var(--font-poppins)]">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Resumen operativo en tiempo real -- Ruta RI-06 Vegueta - Huacho
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>
            Ultima actualizacion:{' '}
            {new Date().toLocaleTimeString('es-PE', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* ============ KPI Cards ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="stat-card">
              {/* Background decoration */}
              <div
                className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 ${kpi.bgColor}`}
              />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${kpi.bgColor} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${kpi.iconColor}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                      kpi.trendUp
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-red-50 text-red-500'
                    }`}
                  >
                    {kpi.trendUp ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {kpi.trend}
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-900 font-[family-name:var(--font-poppins)]">
                    {kpi.value}
                  </span>
                  {kpi.subValue && (
                    <span className="text-sm text-gray-400 font-medium">
                      {kpi.subValue}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  {kpi.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ============ Charts + Alerts Row ============ */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue/Trips Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {chartView === 'ingresos'
                  ? 'Ingresos - Ultimos 30 dias'
                  : 'Viajes - Ultimos 30 dias'}
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {chartView === 'ingresos'
                  ? `Total: ${formatCurrency(totalRevenue30d)} | Promedio: ${formatCurrency(avgDailyRevenue)}/dia`
                  : `Total: ${totalTrips30d.toLocaleString()} viajes | ${totalPassengers30d.toLocaleString()} pasajeros`}
              </p>
            </div>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setChartView('ingresos')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  chartView === 'ingresos'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ingresos
              </button>
              <button
                onClick={() => setChartView('viajes')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  chartView === 'viajes'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Viajes
              </button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'ingresos' ? (
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="gradientIngresos"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#DC2626"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor="#DC2626"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="gradientGastos"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#F59E0B"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="100%"
                        stopColor="#F59E0B"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                    interval={4}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `S/${(v / 1000).toFixed(1)}k`}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      fontSize: '13px',
                    }}
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === 'ingresos'
                        ? 'Ingresos'
                        : name === 'gastos'
                          ? 'Gastos'
                          : 'Neto',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#DC2626"
                    strokeWidth={2.5}
                    fill="url(#gradientIngresos)"
                  />
                  <Area
                    type="monotone"
                    dataKey="gastos"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fill="url(#gradientGastos)"
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              ) : (
                <BarChart data={revenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                    interval={4}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      fontSize: '13px',
                    }}
                    formatter={(value: number, name: string) => [
                      value.toLocaleString(),
                      name === 'viajes' ? 'Viajes' : 'Pasajeros',
                    ]}
                  />
                  <Bar
                    dataKey="viajes"
                    fill="#DC2626"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={20}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="card flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Alertas</h2>
            <span className="badge bg-primary-100 text-primary-700">
              {stats.alerts.filter((a) => !a.is_read).length} nuevas
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {stats.alerts.map((alert) => {
              const AlertIcon = alertIcons[alert.type] || Info
              return (
                <div
                  key={alert.id}
                  className={`relative p-4 rounded-xl border-l-4 ${alertStyles[alert.type]} transition-all hover:shadow-sm cursor-pointer`}
                >
                  {!alert.is_read && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary-500" />
                  )}
                  <div className="flex gap-3">
                    <AlertIcon
                      className={`w-5 h-5 shrink-0 mt-0.5 ${alertIconStyles[alert.type]}`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {alert.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        {alert.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.timestamp).toLocaleTimeString('es-PE', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 rounded-xl transition-colors">
            Ver todas las alertas
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ============ Fleet Health + Quick Stats ============ */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <Bus className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">
              {stats.fleet_health.active}
            </p>
            <p className="text-xs text-gray-500">Vehiculos activos</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <Wrench className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">
              {stats.fleet_health.in_maintenance}
            </p>
            <p className="text-xs text-gray-500">En mantenimiento</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">
              {stats.fleet_health.soat_expiring_soon}
            </p>
            <p className="text-xs text-gray-500">SOAT por vencer</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <Fuel className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">
              {stats.fleet_health.vehicles_needing_service}
            </p>
            <p className="text-xs text-gray-500">Requieren servicio</p>
          </div>
        </div>
      </div>

      {/* ============ Recent Trips Table ============ */}
      <div className="card overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Viajes Recientes
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Ultimos 10 viajes del dia
            </p>
          </div>
          <button className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            Ver todos
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header pl-6">ID</th>
                <th className="table-header">Direccion</th>
                <th className="table-header">Vehiculo</th>
                <th className="table-header">Conductor</th>
                <th className="table-header">Estado</th>
                <th className="table-header text-center">Pasajeros</th>
                <th className="table-header text-right">Ingreso</th>
                <th className="table-header text-right pr-6">Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentTrips.map((trip, i) => (
                <tr
                  key={trip.id}
                  className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                >
                  <td className="table-cell pl-6">
                    <span className="font-mono text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded-lg">
                      {trip.id.toUpperCase()}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          trip.direction === 'ida'
                            ? 'bg-emerald-500'
                            : 'bg-blue-500'
                        }`}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {getDirectionLabel(trip.direction)}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm font-medium text-gray-700">
                      Unidad #{(parseInt(trip.vehicle_id.split('-')[1]) || 0)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm text-gray-600">
                      Conductor #{(parseInt(trip.driver_id.split('-')[1]) || 0)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`badge ${getStatusColor(trip.status)}`}
                    >
                      {getStatusLabel(trip.status)}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <span className="text-sm font-semibold text-gray-900">
                      {trip.passenger_count}
                    </span>
                    <span className="text-xs text-gray-400">/10</span>
                  </td>
                  <td className="table-cell text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(trip.revenue)}
                    </span>
                  </td>
                  <td className="table-cell text-right pr-6">
                    <span className="text-sm text-gray-500">
                      {formatTripTime(trip.actual_departure || trip.scheduled_departure)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
