'use client'

import { useState, useMemo } from 'react'
import { mockDailyRevenue } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  CreditCard, Fuel, Wrench, Users, Calendar, Download, Filter
} from 'lucide-react'

// --- Period Type ---
type Period = 'hoy' | 'semana' | 'mes' | 'year'

// --- Recent Transactions ---
const mockTransactions = [
  { id: 'tx-001', date: '2026-04-15 08:30', description: 'Venta de boletos - Turno mañana', type: 'income' as const, amount: 1260, method: 'Varios' },
  { id: 'tx-002', date: '2026-04-15 07:00', description: 'Carga de combustible - 5 unidades', type: 'expense' as const, amount: -850, method: 'Transferencia' },
  { id: 'tx-003', date: '2026-04-14 18:00', description: 'Venta de boletos - Turno tarde', type: 'income' as const, amount: 2340, method: 'Varios' },
  { id: 'tx-004', date: '2026-04-14 14:00', description: 'Mantenimiento preventivo - Unidad #08', type: 'expense' as const, amount: -450, method: 'Efectivo' },
  { id: 'tx-005', date: '2026-04-14 12:30', description: 'Venta de boletos - Turno medio dia', type: 'income' as const, amount: 980, method: 'Varios' },
  { id: 'tx-006', date: '2026-04-14 09:00', description: 'Pago planilla conductores (semanal)', type: 'expense' as const, amount: -8200, method: 'Transferencia' },
  { id: 'tx-007', date: '2026-04-13 17:45', description: 'Venta de boletos - Dia completo', type: 'income' as const, amount: 4580, method: 'Varios' },
  { id: 'tx-008', date: '2026-04-13 10:00', description: 'Reparacion de frenos - Unidad #23', type: 'expense' as const, amount: -1200, method: 'Efectivo' },
  { id: 'tx-009', date: '2026-04-13 08:00', description: 'Carga de combustible - 8 unidades', type: 'expense' as const, amount: -1360, method: 'Transferencia' },
  { id: 'tx-010', date: '2026-04-12 18:30', description: 'Venta de boletos - Dia completo', type: 'income' as const, amount: 4200, method: 'Varios' },
]

// --- Expense Breakdown ---
const expenseBreakdown = [
  { category: 'Combustible', icon: Fuel, percentage: 45, amount: 23760, color: '#dc2626', bgColor: 'bg-red-50' },
  { category: 'Salarios', icon: Users, percentage: 25, amount: 13200, color: '#3b82f6', bgColor: 'bg-blue-50' },
  { category: 'Mantenimiento', icon: Wrench, percentage: 20, amount: 10560, color: '#f59e0b', bgColor: 'bg-amber-50' },
  { category: 'Otros', icon: CreditCard, percentage: 10, amount: 5280, color: '#64748b', bgColor: 'bg-gray-50' },
]

// --- Custom Tooltip ---
function FinanceTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 min-w-[180px]">
      <p className="text-xs font-semibold text-gray-400 mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4 text-sm mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600">{entry.name}</span>
          </div>
          <span className="font-semibold text-gray-900">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function FinanzasPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('mes')
  const [showAllTransactions, setShowAllTransactions] = useState(false)

  // Compute KPIs from mock data
  const kpis = useMemo(() => {
    const totalRevenue = mockDailyRevenue.reduce((s, d) => s + d.total_revenue, 0)
    const totalFuel = mockDailyRevenue.reduce((s, d) => s + d.fuel_cost, 0)
    const totalMaint = mockDailyRevenue.reduce((s, d) => s + d.maintenance_cost, 0)
    const totalExpenses = totalFuel + totalMaint + 13200 + 5280 // salarios + otros
    const netProfit = totalRevenue - totalExpenses
    const margin = ((netProfit / totalRevenue) * 100)

    return {
      revenue: 131040,
      expenses: 52800,
      netProfit: 78240,
      margin: 59.7,
      realRevenue: totalRevenue,
      realExpenses: totalExpenses,
      realNet: netProfit,
      realMargin: margin,
    }
  }, [])

  // Revenue chart data
  const revenueChartData = mockDailyRevenue.map((d) => ({
    date: d.date.slice(5),
    ingresos: d.total_revenue,
    neto: d.net_revenue,
  }))

  const visibleTransactions = showAllTransactions ? mockTransactions : mockTransactions.slice(0, 6)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900">Finanzas</h1>
          </div>
          <p className="text-gray-500 text-sm">Control de ingresos, gastos y rentabilidad</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost text-sm">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            {(['hoy', 'semana', 'mes', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {period === 'hoy' ? 'Hoy' : period === 'semana' ? 'Semana' : period === 'mes' ? 'Mes' : 'Año'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- KPI Cards --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Ingresos del mes',
            value: formatCurrency(kpis.revenue),
            change: '+12.5%',
            positive: true,
            icon: DollarSign,
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
          },
          {
            label: 'Gastos totales',
            value: formatCurrency(kpis.expenses),
            change: '+3.2%',
            positive: false,
            icon: TrendingDown,
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
          },
          {
            label: 'Ganancia neta',
            value: formatCurrency(kpis.netProfit),
            change: '+18.7%',
            positive: true,
            icon: TrendingUp,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
          },
          {
            label: 'Margen',
            value: `${kpis.margin}%`,
            change: '+2.1%',
            positive: true,
            icon: CreditCard,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
          },
        ].map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.iconBg}`}>
                  <Icon className={`w-5 h-5 ${kpi.iconColor}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${kpi.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                  {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
            </div>
          )
        })}
      </div>

      {/* --- Revenue Chart + Expense Breakdown --- */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart - AreaChart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Ingresos - Ultimos 30 dias</h3>
              <p className="text-xs text-gray-500 mt-0.5">Ingresos brutos y netos diarios</p>
            </div>
            <div className="badge bg-emerald-100 text-emerald-700">
              <TrendingUp className="w-3 h-3 mr-1" />
              Positivo
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="gradientIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradientNeto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={55} tickFormatter={(v: number) => `S/${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<FinanceTooltip />} />
                <Area
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#gradientIngresos)"
                  name="Ingresos"
                />
                <Area
                  type="monotone"
                  dataKey="neto"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#gradientNeto)"
                  name="Neto"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Desglose de Gastos</h3>
              <p className="text-xs text-gray-500 mt-0.5">Distribucion mensual</p>
            </div>
          </div>
          <div className="space-y-4">
            {expenseBreakdown.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                        <Icon className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.category}</p>
                        <p className="text-xs text-gray-400">{item.percentage}%</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              )
            })}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Total Gastos</span>
                <span className="text-base font-black text-gray-900">{formatCurrency(52800)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Recent Transactions --- */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-gray-900">Transacciones Recientes</h3>
            <p className="text-xs text-gray-500 mt-0.5">Movimientos de ingresos y egresos</p>
          </div>
          <button className="btn-ghost text-sm">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header">Fecha</th>
                <th className="table-header">Descripcion</th>
                <th className="table-header">Metodo</th>
                <th className="table-header text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visibleTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="table-cell whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">{tx.date}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                        {tx.type === 'income'
                          ? <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                          : <ArrowDownRight className="w-4 h-4 text-red-500" />
                        }
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{tx.description}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="badge bg-gray-100 text-gray-600">{tx.method}</span>
                  </td>
                  <td className="table-cell text-right">
                    <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {tx.type === 'income' ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mockTransactions.length > 6 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAllTransactions(!showAllTransactions)}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              {showAllTransactions ? 'Ver menos' : `Ver todas (${mockTransactions.length})`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
