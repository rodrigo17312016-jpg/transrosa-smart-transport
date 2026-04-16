'use client'

import { useState, useMemo } from 'react'
import { mockMaintenanceRecords } from '@/lib/mock-data'
import { getStatusColor, formatCurrency } from '@/lib/utils'
import {
  Wrench, Plus, Search, Filter, Calendar, AlertTriangle,
  CheckCircle, Clock, DollarSign, ChevronDown, Truck, Eye
} from 'lucide-react'

// --- Priority Config ---
const priorityConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  low: { label: 'Baja', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  medium: { label: 'Media', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500' },
  high: { label: 'Alta', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
  critical: { label: 'Critica', color: 'text-red-700', bg: 'bg-red-50 border-red-200', dot: 'bg-red-500' },
}

// --- Type labels ---
const typeLabels: Record<string, string> = {
  preventive: 'Preventivo',
  corrective: 'Correctivo',
  inspection: 'Inspeccion',
}

// --- Status labels ---
const statusLabels: Record<string, string> = {
  scheduled: 'Programado',
  in_progress: 'En progreso',
  completed: 'Completado',
}

export default function MantenimientoPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  // Stats
  const stats = useMemo(() => {
    const total = mockMaintenanceRecords.length
    const scheduled = mockMaintenanceRecords.filter((r) => r.status === 'scheduled').length
    const inProgress = mockMaintenanceRecords.filter((r) => r.status === 'in_progress').length
    const completed = mockMaintenanceRecords.filter((r) => r.status === 'completed').length
    const totalCost = mockMaintenanceRecords.reduce((s, r) => s + r.cost, 0)
    return { total, scheduled, inProgress, completed, totalCost }
  }, [])

  // Filtered records
  const filteredRecords = useMemo(() => {
    return mockMaintenanceRecords.filter((record) => {
      const matchesSearch = searchQuery === '' ||
        record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.vehicle_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.mechanic.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || record.status === filterStatus
      const matchesPriority = filterPriority === 'all' || record.priority === filterPriority
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [searchQuery, filterStatus, filterPriority])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-orange-600" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900">Mantenimiento</h1>
          </div>
          <p className="text-gray-500 text-sm">Gestion de mantenimiento preventivo y correctivo de la flota</p>
        </div>
        <button className="btn-primary text-sm">
          <Plus className="w-4 h-4" />
          Programar Mantenimiento
        </button>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total registros', value: stats.total.toString(), icon: Wrench, iconBg: 'bg-gray-100', iconColor: 'text-gray-600' },
          { label: 'Programados', value: stats.scheduled.toString(), icon: Calendar, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
          { label: 'En progreso', value: stats.inProgress.toString(), icon: Clock, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
          { label: 'Completados', value: stats.completed.toString(), icon: CheckCircle, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
          { label: 'Costo total mes', value: formatCurrency(8450), icon: DollarSign, iconBg: 'bg-primary-100', iconColor: 'text-primary-600' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* --- Filters & Search --- */}
      <div className="card !p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por vehiculo, descripcion o mecanico..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 !py-2.5 text-sm"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input !py-2.5 pl-10 pr-8 text-sm appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="all">Todos los estados</option>
              <option value="scheduled">Programado</option>
              <option value="in_progress">En progreso</option>
              <option value="completed">Completado</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Priority filter */}
          <div className="relative">
            <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="input !py-2.5 pl-10 pr-8 text-sm appearance-none cursor-pointer min-w-[150px]"
            >
              <option value="all">Toda prioridad</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="critical">Critica</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${viewMode === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Tabla
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${viewMode === 'cards' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Tarjetas
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">{filteredRecords.length} registro(s) encontrado(s)</p>
      </div>

      {/* --- Table View --- */}
      {viewMode === 'table' && (
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="table-header">Vehiculo</th>
                  <th className="table-header">Descripcion</th>
                  <th className="table-header">Tipo</th>
                  <th className="table-header">Prioridad</th>
                  <th className="table-header">Estado</th>
                  <th className="table-header">Mecanico</th>
                  <th className="table-header text-right">Costo</th>
                  <th className="table-header">Fecha</th>
                  <th className="table-header w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRecords.map((record) => {
                  const priority = priorityConfig[record.priority]
                  return (
                    <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-secondary-100 flex items-center justify-center">
                            <Truck className="w-4 h-4 text-secondary-600" />
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">
                            #{record.vehicle_id.replace('v-', '')}
                          </span>
                        </div>
                      </td>
                      <td className="table-cell max-w-[200px]">
                        <span className="text-sm text-gray-700 truncate block">{record.description}</span>
                      </td>
                      <td className="table-cell">
                        <span className="badge bg-gray-100 text-gray-600">{typeLabels[record.type]}</span>
                      </td>
                      <td className="table-cell">
                        <span className={`badge border ${priority.bg} ${priority.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot} mr-1.5`} />
                          {priority.label}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${getStatusColor(record.status)}`}>
                          {statusLabels[record.status]}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="text-sm text-gray-600">{record.mechanic}</span>
                      </td>
                      <td className="table-cell text-right">
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(record.cost)}</span>
                      </td>
                      <td className="table-cell whitespace-nowrap">
                        <span className="text-xs text-gray-500">{record.scheduled_date}</span>
                      </td>
                      <td className="table-cell">
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-gray-100">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="py-16 text-center">
              <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No se encontraron registros de mantenimiento</p>
              <p className="text-xs text-gray-400 mt-1">Intenta cambiar los filtros de busqueda</p>
            </div>
          )}
        </div>
      )}

      {/* --- Cards View --- */}
      {viewMode === 'cards' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((record) => {
            const priority = priorityConfig[record.priority]
            return (
              <div key={record.id} className="card hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-secondary-100 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-secondary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Vehiculo #{record.vehicle_id.replace('v-', '')}</p>
                      <p className="text-xs text-gray-400">{record.id.toUpperCase()}</p>
                    </div>
                  </div>
                  <span className={`badge border ${priority.bg} ${priority.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${priority.dot} mr-1.5`} />
                    {priority.label}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-4">{record.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Tipo</span>
                    <span className="badge bg-gray-100 text-gray-600">{typeLabels[record.type]}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Estado</span>
                    <span className={`badge ${getStatusColor(record.status)}`}>{statusLabels[record.status]}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Mecanico</span>
                    <span className="font-medium text-gray-700">{record.mechanic}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Odometro</span>
                    <span className="font-medium text-gray-700">{record.odometer_at_service.toLocaleString()} km</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {record.scheduled_date}
                  </div>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(record.cost)}</span>
                </div>
              </div>
            )
          })}

          {filteredRecords.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No se encontraron registros de mantenimiento</p>
            </div>
          )}
        </div>
      )}

      {/* --- Calendar View Placeholder --- */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-gray-900">Calendario de Mantenimiento</h3>
            <p className="text-xs text-gray-500 mt-0.5">Vista mensual de programaciones</p>
          </div>
          <div className="badge bg-amber-100 text-amber-700">
            <Calendar className="w-3 h-3 mr-1" />
            Abril 2026
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-xl overflow-hidden">
          {/* Day headers */}
          {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map((day) => (
            <div key={day} className="bg-gray-50 py-2 text-center">
              <span className="text-xs font-semibold text-gray-500">{day}</span>
            </div>
          ))}
          {/* Calendar days */}
          {Array.from({ length: 35 }, (_, i) => {
            const dayNum = i - 1 // April 2026 starts on Wednesday (offset 2)
            const isCurrentMonth = dayNum >= 0 && dayNum < 30
            const day = dayNum + 1
            const hasEvent = mockMaintenanceRecords.some((r) => {
              const schedDay = parseInt(r.scheduled_date.split('-')[2])
              return schedDay === day
            })
            const record = mockMaintenanceRecords.find((r) => {
              const schedDay = parseInt(r.scheduled_date.split('-')[2])
              return schedDay === day
            })

            return (
              <div
                key={i}
                className={`bg-white min-h-[72px] p-1.5 ${!isCurrentMonth ? 'opacity-30' : ''} ${day === 15 ? 'ring-2 ring-primary-500 ring-inset' : ''}`}
              >
                <span className={`text-xs font-medium ${day === 15 ? 'text-primary-600 font-bold' : 'text-gray-500'}`}>
                  {isCurrentMonth ? day : ''}
                </span>
                {isCurrentMonth && hasEvent && record && (
                  <div className={`mt-1 px-1.5 py-0.5 rounded text-[9px] font-semibold truncate ${
                    record.priority === 'critical' ? 'bg-red-100 text-red-700' :
                    record.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                    record.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    V#{record.vehicle_id.replace('v-', '')}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          {Object.entries(priorityConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
              <span className="text-[10px] text-gray-500">{config.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
