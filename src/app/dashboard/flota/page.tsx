'use client'

import { useState, useMemo } from 'react'
import {
  Bus,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Wrench,
  XCircle,
} from 'lucide-react'
import { mockVehicles } from '@/lib/mock-data'
import { getStatusColor, cn } from '@/lib/utils'
import type { Vehicle } from '@/types'

const statusLabels: Record<string, string> = {
  active: 'Activo',
  en_route: 'En Ruta',
  maintenance: 'Mantenimiento',
  inactive: 'Inactivo',
}

const fuelLabels: Record<string, string> = {
  gasoline: 'Gasolina',
  diesel: 'Di\u00e9sel',
  gnv: 'GNV',
}

const statusIcons: Record<string, React.ReactNode> = {
  active: <CheckCircle className="w-4 h-4" />,
  en_route: <Bus className="w-4 h-4" />,
  maintenance: <Wrench className="w-4 h-4" />,
  inactive: <XCircle className="w-4 h-4" />,
}

export default function FlotaPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [brandFilter, setBrandFilter] = useState<string>('all')
  const [fuelFilter, setFuelFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const stats = useMemo(() => {
    const total = mockVehicles.length
    const activos = mockVehicles.filter((v) => v.status === 'active').length
    const enRuta = mockVehicles.filter((v) => v.status === 'en_route').length
    const mantenimiento = mockVehicles.filter((v) => v.status === 'maintenance').length
    const inactivos = mockVehicles.filter((v) => v.status === 'inactive').length
    return { total, activos, enRuta, mantenimiento, inactivos }
  }, [])

  const filteredVehicles = useMemo(() => {
    return mockVehicles.filter((v) => {
      const matchesSearch =
        search === '' ||
        v.plate_number.toLowerCase().includes(search.toLowerCase()) ||
        v.brand.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase()) ||
        String(v.internal_number).includes(search)
      const matchesStatus = statusFilter === 'all' || v.status === statusFilter
      const matchesBrand = brandFilter === 'all' || v.brand === brandFilter
      const matchesFuel = fuelFilter === 'all' || v.fuel_type === fuelFilter
      return matchesSearch && matchesStatus && matchesBrand && matchesFuel
    })
  }, [search, statusFilter, brandFilter, fuelFilter])

  const brands = [...new Set(mockVehicles.map((v) => v.brand))]

  const statCards = [
    { label: 'Total', value: stats.total, icon: <Bus className="w-5 h-5" />, color: 'text-secondary-700 bg-secondary-50' },
    { label: 'Activos', value: stats.activos, icon: <CheckCircle className="w-5 h-5" />, color: 'text-emerald-700 bg-emerald-50' },
    { label: 'En Ruta', value: stats.enRuta, icon: <Bus className="w-5 h-5" />, color: 'text-blue-700 bg-blue-50' },
    { label: 'En Mantenimiento', value: stats.mantenimiento, icon: <Wrench className="w-5 h-5" />, color: 'text-orange-700 bg-orange-50' },
    { label: 'Inactivos', value: stats.inactivos, icon: <XCircle className="w-5 h-5" />, color: 'text-gray-700 bg-gray-50' },
  ]

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gesti&oacute;n de Flota</h1>
          <p className="text-gray-500 mt-1">Administra y monitorea todos los veh&iacute;culos de la empresa</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-5 h-5" />
          Agregar Veh&iacute;culo
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
              placeholder="Buscar por placa, marca, modelo o n&uacute;mero..."
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
                <option value="active">Activo</option>
                <option value="en_route">En Ruta</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            <select
              className="input !w-auto !py-2 !px-3 text-sm"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
            >
              <option value="all">Todas las marcas</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select
              className="input !w-auto !py-2 !px-3 text-sm"
              value={fuelFilter}
              onChange={(e) => setFuelFilter(e.target.value)}
            >
              <option value="all">Combustible</option>
              <option value="gasoline">Gasolina</option>
              <option value="diesel">Di&eacute;sel</option>
              <option value="gnv">GNV</option>
            </select>
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
          Mostrando {filteredVehicles.length} de {mockVehicles.length} veh&iacute;culos
        </p>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="card !p-0 overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header">#</th>
                <th className="table-header">Placa</th>
                <th className="table-header">Marca / Modelo</th>
                <th className="table-header">A&ntilde;o</th>
                <th className="table-header">Estado</th>
                <th className="table-header">Od&oacute;metro</th>
                <th className="table-header">Combustible</th>
                <th className="table-header">SOAT</th>
                <th className="table-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="table-cell font-bold text-primary-600">#{vehicle.internal_number}</td>
                  <td className="table-cell font-mono font-semibold">{vehicle.plate_number}</td>
                  <td className="table-cell">{vehicle.brand} {vehicle.model}</td>
                  <td className="table-cell">{vehicle.year}</td>
                  <td className="table-cell">
                    <span className={cn('badge', getStatusColor(vehicle.status))}>
                      {statusLabels[vehicle.status]}
                    </span>
                  </td>
                  <td className="table-cell">{vehicle.odometer_km.toLocaleString()} km</td>
                  <td className="table-cell">{fuelLabels[vehicle.fuel_type]}</td>
                  <td className="table-cell text-sm">{vehicle.soat_expiry}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredVehicles.length === 0 && (
        <div className="card text-center py-12">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No se encontraron veh&iacute;culos</p>
          <p className="text-gray-400 text-sm mt-1">Intenta ajustar los filtros de b&uacute;squeda</p>
        </div>
      )}
    </div>
  )
}

function VehicleCard({
  vehicle,
  openMenu,
  setOpenMenu,
}: {
  vehicle: Vehicle
  openMenu: string | null
  setOpenMenu: (id: string | null) => void
}) {
  const isMenuOpen = openMenu === vehicle.id

  return (
    <div className="card !p-0 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
      {/* Card Header */}
      <div className="p-4 pb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-sm">
            #{vehicle.internal_number}
          </div>
          <div>
            <p className="font-mono font-bold text-gray-900">{vehicle.plate_number}</p>
            <p className="text-sm text-gray-500">{vehicle.brand} {vehicle.model} {vehicle.year}</p>
          </div>
        </div>
        <div className="relative">
          <button
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
            onClick={() => setOpenMenu(isMenuOpen ? null : vehicle.id)}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-10">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Eye className="w-4 h-4" /> Ver detalle
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Edit className="w-4 h-4" /> Editar
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" /> Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="px-4 pb-3">
        <span className={cn('badge gap-1', getStatusColor(vehicle.status))}>
          {statusIcons[vehicle.status]}
          {statusLabels[vehicle.status]}
        </span>
      </div>

      {/* Card Body */}
      <div className="px-4 pb-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Od&oacute;metro</span>
          <span className="font-semibold text-gray-900">{vehicle.odometer_km.toLocaleString()} km</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Combustible</span>
          <span className="font-semibold text-gray-900">{fuelLabels[vehicle.fuel_type]}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Capacidad</span>
          <span className="font-semibold text-gray-900">{vehicle.capacity} pasajeros</span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-gray-400">SOAT: </span>
            <span className="font-medium text-gray-600">{vehicle.soat_expiry}</span>
          </div>
          <div>
            <span className="text-gray-400">Rev. T&eacute;c: </span>
            <span className="font-medium text-gray-600">{vehicle.technical_review_expiry}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
