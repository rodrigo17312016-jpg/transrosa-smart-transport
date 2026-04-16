'use client'

import { useState } from 'react'
import {
  Route, Plus, Search, Filter, Eye, Clock, MapPin,
  ArrowRight, Users, DollarSign, CheckCircle, XCircle,
  Play, Pause, Bus
} from 'lucide-react'
import { mockTrips, mockVehicles, mockDrivers } from '@/lib/mock-data'
import { formatCurrency, getStatusColor, cn } from '@/lib/utils'

const statusLabels: Record<string, string> = {
  scheduled: 'Programado',
  boarding: 'Abordando',
  in_progress: 'En Curso',
  completed: 'Completado',
  cancelled: 'Cancelado',
}

export default function ViagesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [directionFilter, setDirectionFilter] = useState('all')

  const stats = {
    total: mockTrips.length,
    scheduled: mockTrips.filter(t => t.status === 'scheduled').length,
    in_progress: mockTrips.filter(t => t.status === 'in_progress' || t.status === 'boarding').length,
    completed: mockTrips.filter(t => t.status === 'completed').length,
    cancelled: mockTrips.filter(t => t.status === 'cancelled').length,
  }

  const filteredTrips = mockTrips.filter(trip => {
    if (statusFilter !== 'all' && trip.status !== statusFilter) return false
    if (directionFilter !== 'all' && trip.direction !== directionFilter) return false
    return true
  })

  const getVehicle = (id: string) => mockVehicles.find(v => v.id === id)
  const getDriver = (id: string) => mockDrivers.find(d => d.id === id)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-poppins)]">
            Gestión de Viajes
          </h1>
          <p className="text-sm text-gray-500 mt-1">Programación y seguimiento de viajes en la ruta RI-06</p>
        </div>
        <button className="btn-primary text-sm">
          <Plus className="w-4 h-4" />
          Programar Viaje
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Hoy', value: stats.total, icon: Route, color: 'blue' },
          { label: 'Programados', value: stats.scheduled, icon: Clock, color: 'amber' },
          { label: 'En Curso', value: stats.in_progress, icon: Play, color: 'emerald' },
          { label: 'Completados', value: stats.completed, icon: CheckCircle, color: 'green' },
          { label: 'Cancelados', value: stats.cancelled, icon: XCircle, color: 'red' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center')}
                style={{ backgroundColor: `var(--color-${color === 'green' ? 'emerald' : color}-100, #f3f4f6)` }}>
                <Icon className="w-5 h-5" style={{ color: color === 'green' ? '#059669' : color === 'blue' ? '#2563eb' : color === 'amber' ? '#d97706' : color === 'emerald' ? '#059669' : '#ef4444' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por vehículo, conductor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input w-auto"
        >
          <option value="all">Todos los estados</option>
          <option value="scheduled">Programado</option>
          <option value="boarding">Abordando</option>
          <option value="in_progress">En Curso</option>
          <option value="completed">Completado</option>
          <option value="cancelled">Cancelado</option>
        </select>
        <select
          value={directionFilter}
          onChange={(e) => setDirectionFilter(e.target.value)}
          className="input w-auto"
        >
          <option value="all">Todas las direcciones</option>
          <option value="ida">Ida (Vegueta → Huacho)</option>
          <option value="vuelta">Vuelta (Huacho → Vegueta)</option>
        </select>
      </div>

      {/* Trips List */}
      <div className="space-y-3">
        {filteredTrips.map((trip) => {
          const vehicle = getVehicle(trip.vehicle_id)
          const driver = getDriver(trip.driver_id)
          const departureTime = new Date(trip.scheduled_departure).toLocaleTimeString('es-PE', {
            hour: '2-digit', minute: '2-digit', hour12: true
          })

          return (
            <div
              key={trip.id}
              className="card flex flex-col lg:flex-row items-start lg:items-center gap-4 hover:border-primary-200 transition-colors"
            >
              {/* Trip ID & Direction */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  trip.direction === 'ida' ? 'bg-blue-100' : 'bg-purple-100'
                )}>
                  <ArrowRight className={cn(
                    'w-5 h-5',
                    trip.direction === 'ida' ? 'text-blue-600' : 'text-purple-600 rotate-180'
                  )} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {trip.direction === 'ida' ? 'Vegueta → Huacho' : 'Huacho → Vegueta'}
                  </p>
                  <p className="text-xs text-gray-400 font-mono">{trip.id.slice(0, 8)}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2 min-w-[120px]">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{departureTime}</span>
              </div>

              {/* Vehicle */}
              <div className="flex items-center gap-2 min-w-[140px]">
                <Bus className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Unidad #{vehicle?.internal_number}
                  </p>
                  <p className="text-xs text-gray-400">{vehicle?.plate_number}</p>
                </div>
              </div>

              {/* Driver */}
              <div className="flex items-center gap-2 min-w-[160px]">
                <div className="w-7 h-7 rounded-full bg-secondary-100 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-secondary-700">
                    {driver ? `${driver.first_name[0]}${driver.last_name[0]}` : '?'}
                  </span>
                </div>
                <span className="text-sm text-gray-700">
                  {driver ? `${driver.first_name} ${driver.last_name.split(' ')[0]}` : 'Sin asignar'}
                </span>
              </div>

              {/* Passengers & Revenue */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{trip.passenger_count}/10</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{formatCurrency(trip.revenue)}</span>
                </div>
              </div>

              {/* Status */}
              <div className="ml-auto flex items-center gap-3">
                <span className={cn('badge', getStatusColor(trip.status))}>
                  {statusLabels[trip.status] || trip.status}
                </span>
                <button className="btn-ghost p-2">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredTrips.length === 0 && (
        <div className="card text-center py-12">
          <Route className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No se encontraron viajes</p>
        </div>
      )}
    </div>
  )
}
