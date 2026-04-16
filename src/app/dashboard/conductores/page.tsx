'use client'

import { useState, useMemo } from 'react'
import {
  Users,
  Plus,
  Search,
  Filter,
  Star,
  Phone,
  Mail,
  Shield,
  Award,
  Eye,
  Edit,
} from 'lucide-react'
import { mockDrivers } from '@/lib/mock-data'
import { getStatusColor, cn } from '@/lib/utils'
import type { Driver } from '@/types'

const statusLabels: Record<string, string> = {
  available: 'Disponible',
  driving: 'Conduciendo',
  resting: 'Descansando',
  off_duty: 'Fuera de servicio',
  suspended: 'Suspendido',
}

export default function ConductoresPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const stats = useMemo(() => {
    const total = mockDrivers.length
    const disponibles = mockDrivers.filter((d) => d.status === 'available').length
    const conduciendo = mockDrivers.filter((d) => d.status === 'driving').length
    const descansando = mockDrivers.filter((d) => d.status === 'resting').length
    const fueraServicio = mockDrivers.filter((d) => d.status === 'off_duty').length
    return { total, disponibles, conduciendo, descansando, fueraServicio }
  }, [])

  const filteredDrivers = useMemo(() => {
    return mockDrivers.filter((d) => {
      const fullName = `${d.first_name} ${d.last_name}`.toLowerCase()
      const matchesSearch =
        search === '' ||
        fullName.includes(search.toLowerCase()) ||
        d.dni.includes(search) ||
        d.phone.includes(search) ||
        d.license_number.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || d.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const statCards = [
    { label: 'Total', value: stats.total, icon: <Users className="w-5 h-5" />, color: 'text-secondary-700 bg-secondary-50' },
    { label: 'Disponibles', value: stats.disponibles, icon: <Users className="w-5 h-5" />, color: 'text-emerald-700 bg-emerald-50' },
    { label: 'Conduciendo', value: stats.conduciendo, icon: <Users className="w-5 h-5" />, color: 'text-blue-700 bg-blue-50' },
    { label: 'Descansando', value: stats.descansando, icon: <Users className="w-5 h-5" />, color: 'text-amber-700 bg-amber-50' },
    { label: 'Fuera de servicio', value: stats.fueraServicio, icon: <Users className="w-5 h-5" />, color: 'text-gray-700 bg-gray-50' },
  ]

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gesti&oacute;n de Conductores</h1>
          <p className="text-gray-500 mt-1">Administra el equipo de conductores de la empresa</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-5 h-5" />
          Agregar Conductor
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="card !p-4 flex items-center gap-3">
            <div className={cn('p-2 rounded-xl', stat.color)}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="card !p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, DNI, tel&eacute;fono o licencia..."
              className="input !pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                className="input !w-auto !py-2 !px-3 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="available">Disponible</option>
                <option value="driving">Conduciendo</option>
                <option value="resting">Descansando</option>
                <option value="off_duty">Fuera de servicio</option>
                <option value="suspended">Suspendido</option>
              </select>
            </div>
            {/* View toggle */}
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                className={cn(
                  'px-3 py-2 text-sm transition-colors',
                  viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                )}
                onClick={() => setViewMode('grid')}
              >
                Cuadr&iacute;cula
              </button>
              <button
                className={cn(
                  'px-3 py-2 text-sm transition-colors',
                  viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                )}
                onClick={() => setViewMode('list')}
              >
                Lista
              </button>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-3">
          Mostrando {filteredDrivers.length} de {mockDrivers.length} conductores
        </p>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDrivers.map((driver) => (
            <DriverCard key={driver.id} driver={driver} />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="card !p-0 overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header">Conductor</th>
                <th className="table-header">DNI</th>
                <th className="table-header">Licencia</th>
                <th className="table-header">Tel&eacute;fono</th>
                <th className="table-header">Estado</th>
                <th className="table-header">Rating</th>
                <th className="table-header">Viajes</th>
                <th className="table-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                        {driver.first_name[0]}{driver.last_name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{driver.first_name} {driver.last_name}</p>
                        {driver.email && (
                          <p className="text-xs text-gray-400">{driver.email}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell font-mono">{driver.dni}</td>
                  <td className="table-cell">
                    <span className="text-sm">{driver.license_category}</span>
                  </td>
                  <td className="table-cell text-sm">{driver.phone}</td>
                  <td className="table-cell">
                    <span className={cn('badge', getStatusColor(driver.status))}>
                      {statusLabels[driver.status]}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-sm">{driver.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="table-cell font-semibold">{driver.total_trips.toLocaleString()}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredDrivers.length === 0 && (
        <div className="card text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No se encontraron conductores</p>
          <p className="text-gray-400 text-sm mt-1">Intenta ajustar los filtros de b&uacute;squeda</p>
        </div>
      )}
    </div>
  )
}

function DriverCard({ driver }: { driver: Driver }) {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalf = rating - fullStars >= 0.5
    const stars = []

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        )
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400/50" />
        )
      } else {
        stars.push(
          <Star key={i} className="w-3.5 h-3.5 text-gray-300" />
        )
      }
    }
    return stars
  }

  return (
    <div className="card !p-0 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
      {/* Card Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
            {driver.first_name[0]}{driver.last_name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 truncate">
              {driver.first_name} {driver.last_name}
            </p>
            <p className="text-xs text-gray-500 font-mono">DNI: {driver.dni}</p>
          </div>
          <span className={cn('badge text-[10px] shrink-0', getStatusColor(driver.status))}>
            {statusLabels[driver.status]}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-4 pb-4 space-y-2.5">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500">Licencia:</span>
          <span className="font-semibold text-gray-900">{driver.license_category}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700">{driver.phone}</span>
        </div>
        {driver.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 truncate">{driver.email}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <Award className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500">Viajes:</span>
          <span className="font-semibold text-gray-900">{driver.total_trips.toLocaleString()}</span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {renderStars(driver.rating)}
          <span className="text-sm font-semibold text-gray-700 ml-1">{driver.rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
