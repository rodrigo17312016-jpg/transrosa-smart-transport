'use client'

import { useState, useMemo } from 'react'
import { formatCurrency, getStatusColor } from '@/lib/utils'
import {
  Ticket, QrCode, Search, Filter, Plus, CreditCard, Smartphone,
  CheckCircle, XCircle, Clock, ChevronDown, Hash, User, MapPin,
  ArrowUpRight, Eye
} from 'lucide-react'

// --- Mock Ticket Data ---
const mockTickets = [
  { id: 'TK-20260415-001', passenger: 'Maria Lopez Sanchez', trip: 'Vegueta → Huacho (06:00)', seat: 3, fare: 3.5, status: 'confirmed' as const, payment: 'yape' as const, qr: 'QR-A1B2C3', time: '05:45' },
  { id: 'TK-20260415-002', passenger: 'Carlos Rios Flores', trip: 'Vegueta → Huacho (06:00)', seat: 7, fare: 2.0, status: 'used' as const, payment: 'plin' as const, qr: 'QR-D4E5F6', time: '05:50' },
  { id: 'TK-20260415-003', passenger: 'Ana Torres Garcia', trip: 'Vegueta → Huacho (06:10)', seat: 1, fare: 3.5, status: 'used' as const, payment: 'cash' as const, qr: 'QR-G7H8I9', time: '05:55' },
  { id: 'TK-20260415-004', passenger: 'Pedro Ramirez Cruz', trip: 'Huacho → Vegueta (06:30)', seat: 5, fare: 3.5, status: 'confirmed' as const, payment: 'yape' as const, qr: 'QR-J1K2L3', time: '06:10' },
  { id: 'TK-20260415-005', passenger: 'Luis Martinez Diaz', trip: 'Vegueta → Huacho (06:20)', seat: 9, fare: 3.5, status: 'cancelled' as const, payment: 'card' as const, qr: 'QR-M4N5O6', time: '06:00' },
  { id: 'TK-20260415-006', passenger: 'Rosa Sanchez Lopez', trip: 'Huacho → Vegueta (06:30)', seat: 2, fare: 3.5, status: 'used' as const, payment: 'yape' as const, qr: 'QR-P7Q8R9', time: '06:15' },
  { id: 'TK-20260415-007', passenger: 'Fernando Gutierrez', trip: 'Vegueta → Huacho (06:40)', seat: 4, fare: 3.5, status: 'confirmed' as const, payment: 'plin' as const, qr: 'QR-S1T2U3', time: '06:25' },
  { id: 'TK-20260415-008', passenger: 'Juan Flores Rivera', trip: 'Vegueta → Huacho (06:40)', seat: 8, fare: 2.0, status: 'used' as const, payment: 'cash' as const, qr: 'QR-V4W5X6', time: '06:30' },
  { id: 'TK-20260415-009', passenger: 'Miguel Reyes Torres', trip: 'Huacho → Vegueta (07:00)', seat: 6, fare: 3.5, status: 'confirmed' as const, payment: 'yape' as const, qr: 'QR-Y7Z8A1', time: '06:40' },
  { id: 'TK-20260415-010', passenger: 'Carmen Diaz Morales', trip: 'Vegueta → Huacho (07:00)', seat: 10, fare: 3.5, status: 'cancelled' as const, payment: 'plin' as const, qr: 'QR-B2C3D4', time: '06:45' },
  { id: 'TK-20260415-011', passenger: 'Hugo Hernandez S.', trip: 'Huacho → Vegueta (07:10)', seat: 1, fare: 3.5, status: 'used' as const, payment: 'card' as const, qr: 'QR-E5F6G7', time: '06:50' },
  { id: 'TK-20260415-012', passenger: 'Raul Morales Cruz', trip: 'Vegueta → Huacho (07:20)', seat: 3, fare: 3.5, status: 'confirmed' as const, payment: 'yape' as const, qr: 'QR-H8I9J1', time: '07:05' },
]

// --- Payment method config ---
const paymentConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  yape: { label: 'Yape', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: '💜' },
  plin: { label: 'Plin', color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200', icon: '💚' },
  cash: { label: 'Efectivo', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: '💵' },
  card: { label: 'Tarjeta', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: '💳' },
}

// --- Status config ---
const ticketStatusConfig: Record<string, { label: string; icon: typeof CheckCircle; iconColor: string }> = {
  confirmed: { label: 'Confirmado', icon: CheckCircle, iconColor: 'text-emerald-500' },
  used: { label: 'Utilizado', icon: CheckCircle, iconColor: 'text-blue-500' },
  cancelled: { label: 'Cancelado', icon: XCircle, iconColor: 'text-red-500' },
}

// --- Payment distribution ---
const paymentDistribution = [
  { method: 'Yape', percentage: 45, amount: 535.5, color: '#7c3aed', tickets: 153 },
  { method: 'Plin', percentage: 25, amount: 297.5, color: '#0d9488', tickets: 85 },
  { method: 'Efectivo', percentage: 20, amount: 238.0, color: '#d97706', tickets: 68 },
  { method: 'Tarjeta', percentage: 10, amount: 119.0, color: '#3b82f6', tickets: 34 },
]

export default function BoletosPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPayment, setFilterPayment] = useState<string>('all')
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return mockTickets.filter((ticket) => {
      const matchesSearch = searchQuery === '' ||
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.passenger.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.trip.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus
      const matchesPayment = filterPayment === 'all' || ticket.payment === filterPayment
      return matchesSearch && matchesStatus && matchesPayment
    })
  }, [searchQuery, filterStatus, filterPayment])

  // Stats
  const ticketStats = {
    sold: 340,
    revenue: 1190,
    usageRate: 92,
    cancelled: 8,
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-primary-600" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900">Boletos Digitales</h1>
          </div>
          <p className="text-gray-500 text-sm">Venta, control y seguimiento de boletos con codigo QR</p>
        </div>
        <button className="btn-primary text-sm">
          <Plus className="w-4 h-4" />
          Vender Boleto
        </button>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Vendidos hoy', value: ticketStats.sold.toString(), icon: Ticket, change: '+23', positive: true, iconBg: 'bg-primary-100', iconColor: 'text-primary-600' },
          { label: 'Ingresos hoy', value: formatCurrency(ticketStats.revenue), icon: CreditCard, change: '+12%', positive: true, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
          { label: 'Tasa de uso', value: `${ticketStats.usageRate}%`, icon: Smartphone, change: '+2.3%', positive: true, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
          { label: 'Cancelados', value: ticketStats.cancelled.toString(), icon: XCircle, change: '-15%', positive: true, iconBg: 'bg-red-100', iconColor: 'text-red-500' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${stat.positive ? 'text-emerald-600' : 'text-red-500'}`}>
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

      {/* --- Main Content: Ticket List + Payment Distribution --- */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Filters */}
          <div className="card !p-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por ID, pasajero o ruta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 !py-2.5 text-sm"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="input !py-2.5 pl-10 pr-8 text-sm appearance-none cursor-pointer min-w-[150px]"
                >
                  <option value="all">Todos</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="used">Utilizado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  value={filterPayment}
                  onChange={(e) => setFilterPayment(e.target.value)}
                  className="input !py-2.5 pl-10 pr-8 text-sm appearance-none cursor-pointer min-w-[140px]"
                >
                  <option value="all">Todo pago</option>
                  <option value="yape">Yape</option>
                  <option value="plin">Plin</option>
                  <option value="cash">Efectivo</option>
                  <option value="card">Tarjeta</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{filteredTickets.length} boleto(s) encontrado(s)</p>
          </div>

          {/* Ticket Table */}
          <div className="card !p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="table-header">Boleto</th>
                    <th className="table-header">Pasajero</th>
                    <th className="table-header">Viaje</th>
                    <th className="table-header text-center">Asiento</th>
                    <th className="table-header">Pago</th>
                    <th className="table-header">Estado</th>
                    <th className="table-header text-right">Tarifa</th>
                    <th className="table-header text-center">QR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTickets.map((ticket) => {
                    const statusConf = ticketStatusConfig[ticket.status]
                    const payConf = paymentConfig[ticket.payment]
                    const StatusIcon = statusConf.icon
                    const isSelected = selectedTicket === ticket.id

                    return (
                      <tr
                        key={ticket.id}
                        className={`transition-colors cursor-pointer ${isSelected ? 'bg-primary-50/50' : 'hover:bg-gray-50/50'}`}
                        onClick={() => setSelectedTicket(isSelected ? null : ticket.id)}
                      >
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <Hash className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs font-mono font-semibold text-gray-700">{ticket.id.slice(-7)}</span>
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                            <span className="text-sm text-gray-700 font-medium truncate max-w-[140px]">{ticket.passenger}</span>
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="text-xs text-gray-600 truncate max-w-[160px]">{ticket.trip}</span>
                          </div>
                        </td>
                        <td className="table-cell text-center">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-secondary-100 text-xs font-bold text-secondary-700">
                            {ticket.seat}
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className={`badge border ${payConf.bg} ${payConf.color} text-[10px]`}>
                            {payConf.icon} {payConf.label}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center gap-1.5">
                            <StatusIcon className={`w-3.5 h-3.5 ${statusConf.iconColor}`} />
                            <span className={`badge ${getStatusColor(ticket.status)}`}>{statusConf.label}</span>
                          </div>
                        </td>
                        <td className="table-cell text-right">
                          <span className="text-sm font-bold text-gray-900">{formatCurrency(ticket.fare)}</span>
                        </td>
                        <td className="table-cell text-center">
                          <button
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={(e) => { e.stopPropagation(); setSelectedTicket(ticket.id) }}
                          >
                            <QrCode className="w-4 h-4 text-gray-400 hover:text-primary-600" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredTickets.length === 0 && (
              <div className="py-16 text-center">
                <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No se encontraron boletos</p>
                <p className="text-xs text-gray-400 mt-1">Intenta cambiar los filtros de busqueda</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Payment Distribution + QR Preview */}
        <div className="space-y-6">
          {/* Payment Distribution */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Metodos de Pago</h3>
              <span className="text-xs text-gray-400">Hoy</span>
            </div>
            <div className="space-y-4">
              {paymentDistribution.map((item) => (
                <div key={item.method}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium text-gray-700">{item.method}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{item.tickets} boletos</span>
                      <span className="text-sm font-bold text-gray-900">{item.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Total Ingresos</span>
                <span className="text-base font-black text-gray-900">{formatCurrency(1190)}</span>
              </div>
            </div>
          </div>

          {/* QR Code Preview */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Vista Previa QR</h3>
              <QrCode className="w-4 h-4 text-gray-400" />
            </div>

            {selectedTicket ? (() => {
              const ticket = mockTickets.find((t) => t.id === selectedTicket)
              if (!ticket) return null
              const statusConf = ticketStatusConfig[ticket.status]
              const StatusIcon = statusConf.icon

              return (
                <div className="text-center">
                  {/* QR Code Placeholder */}
                  <div className="mx-auto w-40 h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center mb-4">
                    <QrCode className="w-16 h-16 text-gray-300 mb-2" />
                    <span className="text-[10px] font-mono text-gray-400">{ticket.qr}</span>
                  </div>

                  <p className="text-sm font-bold text-gray-900 mb-1">{ticket.passenger}</p>
                  <p className="text-xs text-gray-500 mb-3">{ticket.trip}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <span className="text-gray-400">Boleto</span>
                      <p className="font-mono font-semibold text-gray-700">{ticket.id.slice(-7)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <span className="text-gray-400">Asiento</span>
                      <p className="font-bold text-gray-700">#{ticket.seat}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <span className="text-gray-400">Tarifa</span>
                      <p className="font-bold text-gray-700">{formatCurrency(ticket.fare)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <span className="text-gray-400">Estado</span>
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        <StatusIcon className={`w-3 h-3 ${statusConf.iconColor}`} />
                        <p className="font-semibold text-gray-700">{statusConf.label}</p>
                      </div>
                    </div>
                  </div>

                  <button className="btn-primary w-full mt-4 text-xs !py-2.5">
                    <Eye className="w-3.5 h-3.5" />
                    Ver Boleto Completo
                  </button>
                </div>
              )
            })() : (
              <div className="text-center py-8">
                <div className="mx-auto w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
                  <QrCode className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500">Selecciona un boleto</p>
                <p className="text-xs text-gray-400 mt-1">para ver su codigo QR</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
