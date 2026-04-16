'use client'

import { useState } from 'react'
import { mockDailyRevenue } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  Brain, TrendingUp, AlertTriangle, Route, Sparkles,
  Zap, Calendar, ArrowUpRight, BarChart3, Activity
} from 'lucide-react'

// --- Chart Color Palette ---
const COLORS = {
  primary: '#dc2626',
  accent: '#f59e0b',
  emerald: '#10b981',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  slate: '#64748b',
}

// --- AI Insight Data ---
const aiInsights = [
  {
    id: 1,
    icon: TrendingUp,
    title: 'Prediccion de Demanda',
    description: 'Se espera un aumento del 15% en pasajeros este viernes',
    type: 'prediction' as const,
    confidence: 87,
    color: COLORS.blue,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    id: 2,
    icon: Route,
    title: 'Optimizacion de Ruta',
    description: 'Reducir frecuencia en horario 14:00-16:00 puede ahorrar S/450/dia en combustible',
    type: 'optimization' as const,
    confidence: 92,
    color: COLORS.emerald,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    id: 3,
    icon: AlertTriangle,
    title: 'Alerta Predictiva',
    description: 'Vehiculo #12 necesitara cambio de frenos en ~2,000 km',
    type: 'alert' as const,
    confidence: 78,
    color: COLORS.accent,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
]

// --- Passenger Trend Data ---
const passengerTrend = mockDailyRevenue.map((d) => ({
  date: d.date.slice(5),
  pasajeros: d.total_passengers,
  viajes: d.total_trips,
}))

// --- Revenue vs Expenses Data ---
const revenueVsExpenses = mockDailyRevenue.slice(-14).map((d) => ({
  date: d.date.slice(5),
  ingresos: d.total_revenue,
  gastos: d.fuel_cost + d.maintenance_cost,
}))

// --- Fleet Utilization Data ---
const fleetUtilization = [
  { name: 'En ruta', value: 35, color: COLORS.primary },
  { name: 'Activos (base)', value: 7, color: COLORS.blue },
  { name: 'Mantenimiento', value: 5, color: COLORS.accent },
  { name: 'Inactivos', value: 3, color: COLORS.slate },
]

// --- Hourly Demand Heatmap Data ---
const hourlyDemand = Array.from({ length: 16 }, (_, i) => {
  const hour = 5 + i
  const isPeak = (hour >= 6 && hour <= 8) || (hour >= 17 && hour <= 19)
  const isMidPeak = (hour >= 11 && hour <= 13)
  const base = isPeak ? 140 : isMidPeak ? 95 : 55
  return {
    hora: `${String(hour).padStart(2, '0')}:00`,
    lunes: base + Math.floor(Math.random() * 30),
    martes: base + Math.floor(Math.random() * 30),
    miercoles: base + Math.floor(Math.random() * 30),
    jueves: base + Math.floor(Math.random() * 30),
    viernes: base + Math.floor(Math.random() * 40) + 10,
    sabado: Math.floor(base * 0.7) + Math.floor(Math.random() * 20),
    domingo: Math.floor(base * 0.5) + Math.floor(Math.random() * 15),
  }
})

// --- Custom Tooltip ---
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 min-w-[160px]">
      <p className="text-xs font-semibold text-gray-400 mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600 capitalize">{entry.name}</span>
          </div>
          <span className="font-semibold text-gray-900">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '14d' | '30d'>('30d')

  const filteredPassengerData = selectedPeriod === '7d'
    ? passengerTrend.slice(-7)
    : selectedPeriod === '14d'
    ? passengerTrend.slice(-14)
    : passengerTrend

  // Summary stats
  const totalPassengers = mockDailyRevenue.reduce((s, d) => s + d.total_passengers, 0)
  const totalTrips = mockDailyRevenue.reduce((s, d) => s + d.total_trips, 0)
  const totalRevenue = mockDailyRevenue.reduce((s, d) => s + d.total_revenue, 0)
  const avgOccupancy = ((totalPassengers / totalTrips) / 11 * 100).toFixed(1)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900">
              Analytics & Inteligencia Artificial
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Predicciones, optimizaciones y metricas avanzadas impulsadas por IA
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
          {(['7d', '14d', '30d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                selectedPeriod === period
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {period === '7d' ? '7 dias' : period === '14d' ? '14 dias' : '30 dias'}
            </button>
          ))}
        </div>
      </div>

      {/* --- AI Insights Section --- */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-bold text-gray-900">Insights de IA</h2>
          <span className="badge bg-purple-100 text-purple-700 ml-2">En vivo</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {aiInsights.map((insight) => {
            const Icon = insight.icon
            return (
              <div
                key={insight.id}
                className={`relative overflow-hidden rounded-2xl border ${insight.borderColor} ${insight.bgColor} p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${insight.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${insight.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-gray-900 truncate">{insight.title}</h3>
                      <span className="badge bg-white/80 text-gray-600 shrink-0 text-[10px]">
                        {insight.confidence}% confianza
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{insight.description}</p>
                {/* Decorative gradient */}
                <div
                  className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-2xl opacity-20"
                  style={{ backgroundColor: insight.color }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* --- Summary KPIs --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pasajeros (30d)', value: totalPassengers.toLocaleString(), icon: Activity, change: '+12.5%', positive: true, color: 'primary' },
          { label: 'Viajes (30d)', value: totalTrips.toLocaleString(), icon: BarChart3, change: '+8.3%', positive: true, color: 'blue' },
          { label: 'Ingresos (30d)', value: formatCurrency(totalRevenue), icon: TrendingUp, change: '+15.2%', positive: true, color: 'emerald' },
          { label: 'Ocupacion promedio', value: `${avgOccupancy}%`, icon: Zap, change: '+3.1%', positive: true, color: 'accent' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor:
                      stat.color === 'primary' ? '#fee2e2' :
                      stat.color === 'blue' ? '#dbeafe' :
                      stat.color === 'emerald' ? '#d1fae5' :
                      '#fef3c7',
                  }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{
                      color:
                        stat.color === 'primary' ? '#dc2626' :
                        stat.color === 'blue' ? '#3b82f6' :
                        stat.color === 'emerald' ? '#10b981' :
                        '#f59e0b',
                    }}
                  />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${stat.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* --- Charts Row 1: Passenger Trend + Revenue vs Expenses --- */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Passenger Trend - LineChart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Tendencia de Pasajeros</h3>
              <p className="text-xs text-gray-500 mt-0.5">Pasajeros y viajes diarios</p>
            </div>
            <div className="badge bg-blue-100 text-blue-700">
              <Activity className="w-3 h-3 mr-1" />
              Tendencia
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredPassengerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={45} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                />
                <Line
                  type="monotone"
                  dataKey="pasajeros"
                  stroke={COLORS.primary}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2 }}
                  name="Pasajeros"
                />
                <Line
                  type="monotone"
                  dataKey="viajes"
                  stroke={COLORS.blue}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                  name="Viajes"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue vs Expenses - BarChart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Ingresos vs Gastos</h3>
              <p className="text-xs text-gray-500 mt-0.5">Ultimos 14 dias</p>
            </div>
            <div className="badge bg-emerald-100 text-emerald-700">
              <BarChart3 className="w-3 h-3 mr-1" />
              Finanzas
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueVsExpenses} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={50} tickFormatter={(v: number) => `S/${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                />
                <Bar dataKey="ingresos" fill={COLORS.emerald} radius={[4, 4, 0, 0]} name="Ingresos" />
                <Bar dataKey="gastos" fill={COLORS.primary} radius={[4, 4, 0, 0]} name="Gastos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- Charts Row 2: Fleet Utilization + Hourly Demand --- */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Fleet Utilization - PieChart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Utilizacion de Flota</h3>
              <p className="text-xs text-gray-500 mt-0.5">Estado actual de 50 unidades</p>
            </div>
            <div className="badge bg-primary-100 text-primary-700">En vivo</div>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-60 w-60 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fleetUtilization}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {fleetUtilization.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value} unidades`, name]}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #f1f5f9',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      fontSize: '13px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {fleetUtilization.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{item.value}</span>
                    <span className="text-xs text-gray-400">({((item.value / 50) * 100).toFixed(0)}%)</span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Total</span>
                  <span className="text-sm font-bold text-gray-900">50 unidades</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Demand Heatmap */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Demanda por Hora</h3>
              <p className="text-xs text-gray-500 mt-0.5">Mapa de calor semanal (pasajeros/hora)</p>
            </div>
            <div className="badge bg-accent-100 text-accent-700">
              <Calendar className="w-3 h-3 mr-1" />
              Semanal
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left py-1.5 px-1 text-gray-400 font-medium w-14">Hora</th>
                  {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map((day) => (
                    <th key={day} className="text-center py-1.5 px-1 text-gray-400 font-medium">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hourlyDemand.map((row) => (
                  <tr key={row.hora}>
                    <td className="py-0.5 px-1 text-gray-500 font-mono">{row.hora}</td>
                    {[row.lunes, row.martes, row.miercoles, row.jueves, row.viernes, row.sabado, row.domingo].map((val, i) => {
                      const intensity = Math.min(val / 180, 1)
                      const r = Math.round(220 + (220 - 220) * intensity)
                      const g = Math.round(38 + (38 - 38) * intensity)
                      const b = Math.round(38 + (38 - 38) * intensity)
                      const alpha = 0.08 + intensity * 0.85
                      return (
                        <td key={i} className="py-0.5 px-0.5">
                          <div
                            className="rounded-md text-center py-1 font-semibold transition-all"
                            style={{
                              backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})`,
                              color: intensity > 0.5 ? 'white' : '#64748b',
                            }}
                          >
                            {val}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-[10px] text-gray-400">Baja</span>
            <div className="flex gap-0.5">
              {[0.1, 0.3, 0.5, 0.7, 0.9].map((alpha) => (
                <div
                  key={alpha}
                  className="w-6 h-3 rounded-sm"
                  style={{ backgroundColor: `rgba(220, 38, 38, ${alpha})` }}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">Alta</span>
          </div>
        </div>
      </div>
    </div>
  )
}
