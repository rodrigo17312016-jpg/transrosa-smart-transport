'use client'

import { useState, useMemo } from 'react'
import {
  MapPin,
  Navigation,
  Bus,
  Clock,
  Gauge,
  Signal,
  RefreshCw,
  Maximize2,
  Filter,
} from 'lucide-react'
import { mockGPSPositions, mockVehicles } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface TrackedVehicle {
  vehicleId: string
  internalNumber: number
  plateNumber: string
  lat: number
  lng: number
  speed: number
  heading: number
  timestamp: string
  status: 'online' | 'idle' | 'offline'
}

function getTrackingStatus(speed: number): 'online' | 'idle' | 'offline' {
  if (speed > 5) return 'online'
  if (speed >= 0) return 'idle'
  return 'offline'
}

function getStatusDotColor(status: 'online' | 'idle' | 'offline'): string {
  switch (status) {
    case 'online':
      return 'bg-emerald-500'
    case 'idle':
      return 'bg-amber-500'
    case 'offline':
      return 'bg-red-500'
  }
}

function getHeadingLabel(heading: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
  const index = Math.round(heading / 45) % 8
  return directions[index]
}

function formatTimestamp(ts: string): string {
  const date = new Date(ts)
  return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function GPSPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const trackedVehicles: TrackedVehicle[] = useMemo(() => {
    return mockGPSPositions.map((pos) => {
      const vehicle = mockVehicles.find((v) => v.id === pos.vehicle_id)
      const status = getTrackingStatus(pos.speed)
      return {
        vehicleId: pos.vehicle_id,
        internalNumber: vehicle?.internal_number ?? 0,
        plateNumber: vehicle?.plate_number ?? '',
        lat: pos.lat,
        lng: pos.lng,
        speed: pos.speed,
        heading: pos.heading,
        timestamp: pos.timestamp,
        status,
      }
    }).sort((a, b) => a.internalNumber - b.internalNumber)
  }, [])

  const filteredVehicles = useMemo(() => {
    if (filterStatus === 'all') return trackedVehicles
    return trackedVehicles.filter((v) => v.status === filterStatus)
  }, [trackedVehicles, filterStatus])

  const avgSpeed = useMemo(() => {
    if (trackedVehicles.length === 0) return 0
    return Math.round(trackedVehicles.reduce((sum, v) => sum + v.speed, 0) / trackedVehicles.length)
  }, [trackedVehicles])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-600" />
            <h1 className="text-lg font-bold text-gray-900">Rastreo GPS en Tiempo Real</h1>
          </div>
          <span className="badge bg-blue-100 text-blue-800">
            <Signal className="w-3 h-3 mr-1" />
            {trackedVehicles.length} unidades rastreadas
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={cn(
              'btn-ghost !px-3 !py-2 text-sm',
              isRefreshing && 'text-primary-600'
            )}
            onClick={handleRefresh}
          >
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
            Actualizar
          </button>
          <button className="btn-ghost !px-3 !py-2 text-sm">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button className="btn-ghost !px-3 !py-2 text-sm">
            <Maximize2 className="w-4 h-4" />
            Pantalla completa
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Vehicle List */}
        <div className="w-80 bg-white border-r border-gray-100 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-100 space-y-3">
            <div className="flex items-center gap-2">
              <Bus className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-700">Unidades en seguimiento</span>
            </div>
            <div className="flex gap-1">
              {['all', 'online', 'idle', 'offline'].map((status) => (
                <button
                  key={status}
                  className={cn(
                    'px-3 py-1 text-xs font-medium rounded-lg transition-colors',
                    filterStatus === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                  onClick={() => setFilterStatus(status)}
                >
                  {status === 'all' ? 'Todos' : status === 'online' ? 'Activos' : status === 'idle' ? 'Detenidos' : 'Sin se\u00f1al'}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle List */}
          <div className="flex-1 overflow-y-auto">
            {filteredVehicles.map((vehicle) => (
              <button
                key={vehicle.vehicleId}
                className={cn(
                  'w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors',
                  selectedVehicle === vehicle.vehicleId && 'bg-primary-50 border-l-2 border-l-primary-600'
                )}
                onClick={() => setSelectedVehicle(vehicle.vehicleId)}
              >
                <div className="flex items-start gap-3">
                  {/* Status Dot */}
                  <div className="mt-1.5">
                    <div className={cn('w-2.5 h-2.5 rounded-full', getStatusDotColor(vehicle.status))} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-900">
                        Unidad #{vehicle.internalNumber}
                      </span>
                      <span className="text-xs font-mono text-gray-500">{vehicle.plateNumber}</span>
                    </div>

                    <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Gauge className="w-3 h-3" />
                        <span className="font-medium text-gray-700">{vehicle.speed} km/h</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Navigation className="w-3 h-3" />
                        <span className="font-medium text-gray-700">{getHeadingLabel(vehicle.heading)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 col-span-2">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(vehicle.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {filteredVehicles.length === 0 && (
              <div className="p-6 text-center">
                <Signal className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No hay unidades con este estado</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-gray-100">
          <div
            id="map"
            className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-secondary-50 to-gray-100"
          >
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
                <MapPin className="w-10 h-10 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-700">Mapa GPS en Tiempo Real</h2>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">
                  El mapa interactivo se est&aacute; cargando. Requiere la inicializaci&oacute;n din&aacute;mica de Leaflet
                  para mostrar las posiciones de los veh&iacute;culos en tiempo real sobre la ruta
                  Vegueta &mdash; Huacho.
                </p>
              </div>
              <div className="flex items-center gap-6 justify-center text-sm text-gray-400 mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>En movimiento</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Detenido</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>Sin se&ntilde;al</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected vehicle info overlay */}
          {selectedVehicle && (() => {
            const v = trackedVehicles.find((tv) => tv.vehicleId === selectedVehicle)
            if (!v) return null
            return (
              <div className="absolute top-4 right-4 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-72 z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-2.5 h-2.5 rounded-full', getStatusDotColor(v.status))} />
                    <span className="font-bold text-gray-900">Unidad #{v.internalNumber}</span>
                  </div>
                  <span className="font-mono text-sm text-gray-500">{v.plateNumber}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Velocidad</span>
                    <span className="font-semibold">{v.speed} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Direcci&oacute;n</span>
                    <span className="font-semibold">{getHeadingLabel(v.heading)} ({v.heading}&deg;)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Coordenadas</span>
                    <span className="font-mono text-xs">{v.lat.toFixed(4)}, {v.lng.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">&Uacute;ltima lectura</span>
                    <span className="font-semibold">{formatTimestamp(v.timestamp)}</span>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-100">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="w-4 h-4 text-blue-500" />
            <span className="text-gray-500">Velocidad promedio:</span>
            <span className="font-bold text-gray-900">{avgSpeed} km/h</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Navigation className="w-4 h-4 text-emerald-500" />
            <span className="text-gray-500">Distancia total hoy:</span>
            <span className="font-bold text-gray-900">1,284 km</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Bus className="w-4 h-4 text-orange-500" />
            <span className="text-gray-500">Consumo estimado:</span>
            <span className="font-bold text-gray-900">142 gal</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span>&Uacute;ltima actualizaci&oacute;n: {formatTimestamp(new Date().toISOString())}</span>
        </div>
      </div>
    </div>
  )
}
