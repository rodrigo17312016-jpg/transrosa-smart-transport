'use client'

import { useState } from 'react'
import {
  ShieldCheck,
  Camera,
  ScanFace,
  IdCard,
  AlertTriangle,
  AlertOctagon,
  Eye,
  Search,
  Filter,
  Plus,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  Video,
  ClipboardList,
  Users,
  Activity,
  ChevronRight,
  Bell,
  FileText,
  ArrowUpRight,
  TrendingUp,
  ShieldAlert,
  UserCheck,
  Fingerprint,
  Lock,
  ScanLine,
  PhoneCall,
  Wallet,
  AlertCircle,
  UserX,
  Wrench,
} from 'lucide-react'
import {
  mockCheckIns,
  mockManifests,
  mockIncidents,
  mockCameras,
  mockSOSAlerts,
  mockSecurityStats,
} from '@/lib/mock-data'
import { SECURITY_FEATURES, INCIDENT_TYPES } from '@/lib/constants'
import { formatCurrency, getStatusColor, cn } from '@/lib/utils'
import type {
  SecurityIncident,
  PassengerCheckIn,
  VehicleManifest,
  CCTVCamera,
} from '@/types'

// --- Icon resolver maps ---
const featureIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ScanFace,
  IdCard,
  ClipboardList,
  Camera,
  AlertTriangle,
  Video,
  PhoneCall,
  Fingerprint,
  ScanLine,
  Lock,
}

const incidentIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wallet,
  AlertTriangle,
  UserX,
  Activity,
  Wrench,
  AlertOctagon,
  Eye,
  Search,
  AlertCircle,
}

const methodConfig: Record<
  PassengerCheckIn['method'],
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  facial_recognition: { label: 'Facial', icon: ScanFace, color: 'text-violet-600 bg-violet-50' },
  qr_code: { label: 'QR', icon: ScanLine, color: 'text-blue-600 bg-blue-50' },
  dni_scan: { label: 'DNI', icon: IdCard, color: 'text-emerald-600 bg-emerald-50' },
  manual: { label: 'Manual', icon: UserCheck, color: 'text-gray-600 bg-gray-100' },
}

const incidentSeverityStyles: Record<
  SecurityIncident['severity'],
  { stripe: string; pill: string }
> = {
  critical: { stripe: 'bg-red-600', pill: 'bg-red-100 text-red-700' },
  high: { stripe: 'bg-red-500', pill: 'bg-red-100 text-red-700' },
  medium: { stripe: 'bg-amber-500', pill: 'bg-amber-100 text-amber-700' },
  low: { stripe: 'bg-blue-500', pill: 'bg-blue-100 text-blue-700' },
}

const incidentStatusLabels: Record<SecurityIncident['status'], string> = {
  reported: 'Reportado',
  investigating: 'Investigando',
  police_notified: 'PNP notificada',
  resolved: 'Resuelto',
  closed: 'Cerrado',
}

const manifestStatusLabels: Record<VehicleManifest['status'], string> = {
  boarding: 'Abordando',
  in_transit: 'En tránsito',
  completed: 'Completado',
  incident: 'Incidente',
}

const cameraStatusStyles: Record<
  CCTVCamera['status'],
  { dot: string; label: string }
> = {
  recording: { dot: 'bg-emerald-500 animate-pulse', label: 'Grabando' },
  online: { dot: 'bg-emerald-500', label: 'En línea' },
  offline: { dot: 'bg-red-500', label: 'Desconectada' },
  maintenance: { dot: 'bg-amber-500', label: 'Mantenimiento' },
}

// --- Helpers ---
function formatTime(dateStr: string | null) {
  if (!dateStr) return '--:--'
  return new Date(dateStr).toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'Ahora'
  if (mins < 60) return `Hace ${mins} min`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `Hace ${hours}h`
  const days = Math.round(hours / 24)
  return `Hace ${days}d`
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// --- Sub-components ---
type ManifestTab = 'in_transit' | 'boarding' | 'completed'
type IncidentFilter = 'all' | 'active' | 'resolved'

export default function SecurityDashboardPage() {
  const [manifestTab, setManifestTab] = useState<ManifestTab>('in_transit')
  const [expandedManifest, setExpandedManifest] = useState<string | null>(null)
  const [incidentFilter, setIncidentFilter] = useState<IncidentFilter>('all')
  const [checkInSearch, setCheckInSearch] = useState('')
  const [checkInMethod, setCheckInMethod] = useState<'all' | PassengerCheckIn['method']>('all')

  // --- Active SOS detection ---
  const activeSOS = mockSOSAlerts.find(
    (a) => a.status === 'active' || a.status === 'responded'
  )

  // --- Filtered manifests ---
  const filteredManifests = mockManifests.filter((m) => m.status === manifestTab)

  // --- Filtered incidents ---
  const filteredIncidents = mockIncidents.filter((inc) => {
    if (incidentFilter === 'active')
      return ['reported', 'investigating', 'police_notified'].includes(inc.status)
    if (incidentFilter === 'resolved')
      return ['resolved', 'closed'].includes(inc.status)
    return true
  })

  // --- Filtered check-ins ---
  const filteredCheckIns = mockCheckIns
    .filter((ci) => {
      const matchesSearch =
        checkInSearch === '' ||
        ci.passenger_name.toLowerCase().includes(checkInSearch.toLowerCase()) ||
        ci.passenger_dni.includes(checkInSearch)
      const matchesMethod = checkInMethod === 'all' || ci.method === checkInMethod
      return matchesSearch && matchesMethod
    })
    .sort(
      (a, b) =>
        new Date(b.check_in_time).getTime() - new Date(a.check_in_time).getTime()
    )
    .slice(0, 10)

  // --- KPI cards data ---
  const kpis = [
    {
      label: 'Check-ins Hoy',
      value: mockSecurityStats.total_check_ins_today.toString(),
      trend: '+18%',
      icon: UserCheck,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      ringBg: 'bg-emerald-100',
      sub: 'pasajeros identificados',
    },
    {
      label: 'Pasajeros a Bordo',
      value: mockSecurityStats.total_passengers_active.toString(),
      live: true,
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      ringBg: 'bg-blue-100',
      sub: 'en tiempo real',
    },
    {
      label: 'Reconocimiento Facial',
      value: `${mockSecurityStats.facial_recognition_rate}%`,
      badge: 'IA',
      icon: ScanFace,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      ringBg: 'bg-violet-100',
      sub: 'tasa de identificación',
    },
    {
      label: 'Incidentes Activos',
      value: mockSecurityStats.active_incidents.toString(),
      danger: true,
      icon: ShieldAlert,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      ringBg: 'bg-red-100',
      sub: 'requieren atención',
    },
    {
      label: 'Cámaras Online',
      value: `${mockSecurityStats.cameras_online}/${mockSecurityStats.cameras_total}`,
      success: true,
      icon: Camera,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      ringBg: 'bg-emerald-100',
      sub: 'CCTV operativas',
    },
    {
      label: 'Tiempo de Respuesta',
      value: `${mockSecurityStats.avg_response_time_minutes} min`,
      trend: '-0.8',
      icon: Clock,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      ringBg: 'bg-amber-100',
      sub: 'promedio mensual',
    },
  ]

  // --- Security feature counters ---
  const enabledFeaturesCount = SECURITY_FEATURES.filter((f) => f.enabled).length

  // --- Emergency contacts ---
  const emergencyContacts = [
    { name: 'PNP - Emergencias', number: '105', icon: ShieldAlert, accent: 'text-red-600' },
    { name: 'SAMU - Emergencia Médica', number: '116', icon: Activity, accent: 'text-orange-600' },
    { name: 'Serenazgo Huacho', number: '+51 1 232-1818', icon: Phone, accent: 'text-blue-600' },
    { name: 'Serenazgo Huaura', number: '+51 1 232-1819', icon: Phone, accent: 'text-blue-600' },
    {
      name: 'Jefe de Seguridad Interno',
      number: '+51 993 370 254',
      icon: UserCheck,
      accent: 'text-emerald-600',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ============ 1. HEADER ============ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 p-6 sm:p-8 shadow-xl">
        {/* Decorative blobs */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-orange-500/30 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-red-500/40 blur-3xl" />
        <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-amber-400/20 blur-2xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg shrink-0">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white font-[family-name:var(--font-poppins)]">
                  Centro de Seguridad
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SOC en vivo
                </span>
              </div>
              <p className="text-sm sm:text-base text-red-50/90 mt-1.5 max-w-2xl">
                Identificación de pasajeros, prevención e investigación de incidentes
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/30 border border-red-300/40 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-100" />
              </span>
              <span className="text-xs font-bold text-white tracking-wider">ACTIVO</span>
            </span>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-red-700 font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-red-100">
              <AlertOctagon className="w-4 h-4" />
              Botón SOS
            </button>
          </div>
        </div>
      </div>

      {/* ============ 2. CRITICAL ALERT BANNER ============ */}
      {activeSOS && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-1 shadow-2xl shadow-red-500/30">
          {/* outer pulse ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-rose-500 to-red-700 animate-pulse opacity-50" />
          <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-xl p-5 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
                  <div className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <AlertOctagon className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="text-white">
                  <p className="text-xs font-black tracking-[0.2em] uppercase opacity-90">
                    ALERTA CRÍTICA · SOS ACTIVO
                  </p>
                  <h3 className="text-lg sm:text-xl font-black mt-0.5">
                    SOS activo · Vehículo #{activeSOS.vehicle_id.split('-')[1]} ·{' '}
                    {activeSOS.description} · {timeAgo(activeSOS.triggered_at)}
                  </h3>
                  <p className="text-sm text-red-50 mt-1 flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      Lat {activeSOS.lat.toFixed(4)}, Lng{' '}
                      {activeSOS.lng.toFixed(4)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      Respondiendo: {activeSOS.responder}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-red-700 text-sm font-bold shadow-lg hover:bg-red-50 transition-colors">
                  <PhoneCall className="w-4 h-4" />
                  Contactar PNP
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-900/40 backdrop-blur-sm text-white text-sm font-semibold border border-white/20 hover:bg-red-900/60 transition-colors">
                  <Eye className="w-4 h-4" />
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ 3. KPI STATS ROW ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div
              key={kpi.label}
              className="stat-card hover:-translate-y-0.5 transition-all duration-300 group"
            >
              {/* Decorative blur circle */}
              <div
                className={cn(
                  'absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-50 blur-2xl group-hover:opacity-70 transition-opacity',
                  kpi.ringBg
                )}
              />
              <div
                className={cn(
                  'absolute -bottom-10 -left-10 w-24 h-24 rounded-full opacity-30 blur-2xl',
                  kpi.iconBg
                )}
              />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      'w-11 h-11 rounded-xl flex items-center justify-center shadow-sm',
                      kpi.iconBg
                    )}
                  >
                    <Icon className={cn('w-5 h-5', kpi.iconColor)} />
                  </div>
                  {kpi.trend && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600">
                      <TrendingUp className="w-3 h-3" />
                      {kpi.trend}
                    </div>
                  )}
                  {kpi.live && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black bg-blue-50 text-blue-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      LIVE
                    </span>
                  )}
                  {kpi.badge && (
                    <span className="px-2 py-1 rounded-lg text-[10px] font-black bg-violet-50 text-violet-600 border border-violet-100">
                      {kpi.badge}
                    </span>
                  )}
                  {kpi.danger && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black bg-red-50 text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      ALTA
                    </span>
                  )}
                  {kpi.success && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-600">
                      <Wifi className="w-3 h-3" />
                      OK
                    </span>
                  )}
                </div>

                <p
                  className={cn(
                    'text-3xl font-black font-[family-name:var(--font-poppins)] leading-tight',
                    kpi.danger ? 'text-red-600' : 'text-gray-900'
                  )}
                >
                  {kpi.value}
                </p>
                <p className="text-sm font-semibold text-gray-700 mt-1">
                  {kpi.label}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{kpi.sub}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ============ 4. TWO-COLUMN LAYOUT ============ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ----- LEFT COLUMN ----- */}
        <div className="xl:col-span-2 space-y-6">
          {/* A) Manifiestos Activos */}
          <div className="card hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <ClipboardList className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    Manifiestos Activos
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      EN VIVO
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Lista digital de pasajeros por vehículo en ruta
                  </p>
                </div>
              </div>

              <div className="flex bg-gray-100 rounded-xl p-1">
                {(
                  [
                    { key: 'in_transit', label: 'En tránsito' },
                    { key: 'boarding', label: 'Abordando' },
                    { key: 'completed', label: 'Completados' },
                  ] as { key: ManifestTab; label: string }[]
                ).map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setManifestTab(t.key)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                      manifestTab === t.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredManifests.length === 0 && (
                <div className="text-center py-12 text-sm text-gray-400">
                  No hay manifiestos en este estado
                </div>
              )}
              {filteredManifests.map((m) => {
                const fillPct = (m.total_passengers / m.total_capacity) * 100
                const expanded = expandedManifest === m.id
                return (
                  <div
                    key={m.id}
                    className="rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/30 overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Vehicle + plate */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-secondary-700 to-secondary-900 flex items-center justify-center shadow-sm shrink-0">
                            <span className="text-[10px] font-black text-white">
                              #{m.vehicle_id.split('-')[1]}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-mono text-sm font-bold text-gray-900 truncate">
                              {m.vehicle_plate}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shrink-0">
                                <span className="text-[8px] font-black text-white">
                                  {getInitials(m.driver_name)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 truncate">
                                {m.driver_name}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Origin -> Destination */}
                        <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
                          <span className="font-semibold text-gray-700 truncate">
                            {m.origin_terminal}
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                          <span className="font-semibold text-gray-700 truncate">
                            {m.destination_terminal}
                          </span>
                        </div>

                        {/* Progress + count */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="relative w-12 h-12">
                            <svg className="w-12 h-12 -rotate-90">
                              <circle
                                cx="24"
                                cy="24"
                                r="20"
                                stroke="#e5e7eb"
                                strokeWidth="4"
                                fill="none"
                              />
                              <circle
                                cx="24"
                                cy="24"
                                r="20"
                                stroke={
                                  fillPct > 80
                                    ? '#dc2626'
                                    : fillPct > 50
                                      ? '#f59e0b'
                                      : '#10b981'
                                }
                                strokeWidth="4"
                                fill="none"
                                strokeDasharray={`${(fillPct / 100) * 125.6} 125.6`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-gray-700">
                              {m.total_passengers}/{m.total_capacity}
                            </span>
                          </div>
                          <div className="text-xs">
                            <p className="font-bold text-gray-900">
                              {m.total_passengers} pasajeros
                            </p>
                            <p className="text-gray-400">
                              cap. {m.total_capacity}
                            </p>
                          </div>
                        </div>

                        {/* Status + action */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={cn(
                              'badge',
                              getStatusColor(
                                m.status === 'in_transit'
                                  ? 'in_progress'
                                  : m.status
                              )
                            )}
                          >
                            {manifestStatusLabels[m.status]}
                          </span>
                          <button
                            onClick={() =>
                              setExpandedManifest(expanded ? null : m.id)
                            }
                            className="text-xs font-semibold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-primary-50 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {expanded ? 'Ocultar' : 'Ver pasajeros'}
                          </button>
                        </div>
                      </div>

                      {/* Expanded passenger list */}
                      {expanded && (
                        <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
                            Lista de pasajeros · {m.passengers.length}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {m.passengers.map((p) => {
                              const cfg = methodConfig[p.method]
                              const MIcon = cfg.icon
                              return (
                                <div
                                  key={p.id}
                                  className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-gray-100"
                                >
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-bold text-gray-700">
                                      {getInitials(p.passenger_name)}
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold text-gray-900 truncate">
                                      {p.passenger_name}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-mono">
                                      DNI {p.passenger_dni}
                                    </p>
                                  </div>
                                  <span
                                    className={cn(
                                      'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold',
                                      cfg.color
                                    )}
                                  >
                                    <MIcon className="w-2.5 h-2.5" />
                                    {cfg.label}
                                  </span>
                                  {p.identity_verified && (
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* B) Incidentes Recientes */}
          <div className="card hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/25">
                  <ShieldAlert className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Incidentes Recientes
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Investigación, evidencia y trazabilidad
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 rounded-xl p-1">
                  {(
                    [
                      { key: 'all', label: 'Todos' },
                      { key: 'active', label: 'Activos' },
                      { key: 'resolved', label: 'Resueltos' },
                    ] as { key: IncidentFilter; label: string }[]
                  ).map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setIncidentFilter(t.key)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                        incidentFilter === t.key
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <button className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-sm">
                  <Plus className="w-3.5 h-3.5" />
                  Reportar
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredIncidents.slice(0, 6).map((inc) => {
                const sev = incidentSeverityStyles[inc.severity]
                const typeCfg = INCIDENT_TYPES[inc.type]
                const TypeIcon = incidentIconMap[typeCfg.icon] ?? AlertCircle
                return (
                  <div
                    key={inc.id}
                    className="relative flex gap-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm bg-white transition-all overflow-hidden"
                  >
                    {/* severity stripe */}
                    <div className={cn('w-1 shrink-0', sev.stripe)} />
                    <div className="flex-1 p-4 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-start gap-2 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                            <TypeIcon className="w-4 h-4 text-gray-700" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[11px] font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                                {inc.incident_number}
                              </span>
                              <span
                                className={cn(
                                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide',
                                  sev.pill
                                )}
                              >
                                {typeCfg.label}
                              </span>
                              {inc.police_notified && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wide">
                                  <ShieldCheck className="w-3 h-3" />
                                  PNP notificada
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-bold text-gray-900 mt-1 truncate">
                              {inc.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                              {inc.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span
                            className={cn(
                              'badge',
                              ['resolved', 'closed'].includes(inc.status)
                                ? 'bg-emerald-100 text-emerald-700'
                                : inc.status === 'investigating'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-red-100 text-red-700'
                            )}
                          >
                            {incidentStatusLabels[inc.status]}
                          </span>
                          {inc.estimated_loss && (
                            <span className="text-[11px] font-bold text-red-600">
                              Pérdida {formatCurrency(inc.estimated_loss)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {inc.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />{' '}
                          {timeAgo(inc.reported_date)}
                        </span>
                        {inc.cctv_video_urls.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-violet-600 font-semibold">
                            <Video className="w-3 h-3" /> {inc.cctv_video_urls.length}{' '}
                            video CCTV
                          </span>
                        )}
                        <button className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-primary-600 hover:text-primary-700">
                          Ver detalles
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* C) Check-ins en Vivo */}
          <div className="card hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <ScanFace className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    Check-ins en Vivo
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-violet-50 text-violet-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                      Stream
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Identificación biométrica y verificación documentaria
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={checkInSearch}
                  onChange={(e) => setCheckInSearch(e.target.value)}
                  placeholder="Buscar por nombre o DNI..."
                  className="input pl-10 py-2.5 text-sm"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  value={checkInMethod}
                  onChange={(e) =>
                    setCheckInMethod(
                      e.target.value as 'all' | PassengerCheckIn['method']
                    )
                  }
                  className="input pl-10 pr-8 py-2.5 text-sm appearance-none bg-gray-50 cursor-pointer"
                >
                  <option value="all">Todos los métodos</option>
                  <option value="facial_recognition">Reconocimiento Facial</option>
                  <option value="qr_code">Código QR</option>
                  <option value="dni_scan">Lectura de DNI</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto -mx-6">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="table-header pl-6">Hora</th>
                    <th className="table-header">Pasajero</th>
                    <th className="table-header">DNI</th>
                    <th className="table-header">Método</th>
                    <th className="table-header">Vehículo</th>
                    <th className="table-header text-center">Verificado</th>
                    <th className="table-header text-right pr-6">Confianza</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCheckIns.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-8 text-sm text-gray-400"
                      >
                        Sin coincidencias
                      </td>
                    </tr>
                  )}
                  {filteredCheckIns.map((ci) => {
                    const cfg = methodConfig[ci.method]
                    const MIcon = cfg.icon
                    return (
                      <tr
                        key={ci.id}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="table-cell pl-6">
                          <span className="font-mono text-xs text-gray-700">
                            {formatTime(ci.check_in_time)}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-200 to-violet-300 flex items-center justify-center shrink-0 ring-2 ring-white shadow-sm">
                              <span className="text-[10px] font-bold text-violet-800">
                                {getInitials(ci.passenger_name)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {ci.passenger_name}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {ci.terminal_name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className="font-mono text-xs text-gray-600">
                            {ci.passenger_dni}
                          </span>
                        </td>
                        <td className="table-cell">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold',
                              cfg.color
                            )}
                          >
                            <MIcon className="w-3 h-3" />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className="text-xs text-gray-700 font-medium">
                            #{ci.vehicle_id.split('-')[1]}
                          </span>
                        </td>
                        <td className="table-cell text-center">
                          {ci.identity_verified ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500 inline" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-300 inline" />
                          )}
                        </td>
                        <td className="table-cell text-right pr-6">
                          {ci.match_confidence ? (
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                  style={{
                                    width: `${ci.match_confidence * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs font-bold text-violet-700 w-10 text-right">
                                {(ci.match_confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300">--</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ----- RIGHT COLUMN ----- */}
        <div className="space-y-6">
          {/* D) Sistema de Seguridad */}
          <div className="card hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Sistema de Seguridad
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {enabledFeaturesCount}/{SECURITY_FEATURES.length} activos
                  </p>
                </div>
              </div>
              <span className="badge bg-emerald-50 text-emerald-700">
                {enabledFeaturesCount}/{SECURITY_FEATURES.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {SECURITY_FEATURES.map((feature) => {
                const FIcon = featureIconMap[feature.icon] ?? ShieldCheck
                return (
                  <div
                    key={feature.id}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-xl border transition-all',
                      feature.enabled
                        ? 'bg-emerald-50/40 border-emerald-100 hover:bg-emerald-50/70'
                        : 'bg-gray-50/40 border-gray-100 opacity-75'
                    )}
                  >
                    <div
                      className={cn(
                        'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                        feature.enabled
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-400'
                      )}
                    >
                      <FIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        {feature.name}
                        {!feature.enabled && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 uppercase tracking-wider">
                            Fase 2
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                        {feature.description}
                      </p>
                    </div>
                    {/* Toggle */}
                    <div
                      className={cn(
                        'relative w-9 h-5 rounded-full transition-colors shrink-0 mt-1',
                        feature.enabled ? 'bg-emerald-500' : 'bg-gray-300'
                      )}
                    >
                      <div
                        className={cn(
                          'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform',
                          feature.enabled ? 'translate-x-4' : 'translate-x-0.5'
                        )}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* E) Cámaras CCTV */}
          <div className="card hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Cámaras CCTV
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    <span className="text-emerald-600 font-bold">
                      {mockSecurityStats.cameras_online}
                    </span>{' '}
                    /{mockSecurityStats.cameras_total} en línea
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 badge bg-emerald-50 text-emerald-700">
                <Wifi className="w-3 h-3" />
                {Math.round(
                  (mockSecurityStats.cameras_online /
                    mockSecurityStats.cameras_total) *
                    100
                )}
                %
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {mockCameras.slice(0, 16).map((cam) => {
                const cfg = cameraStatusStyles[cam.status]
                const isOffline = cam.status === 'offline'
                return (
                  <div
                    key={cam.id}
                    className={cn(
                      'aspect-square rounded-lg border p-2 flex flex-col justify-between transition-all hover:shadow-sm cursor-pointer relative overflow-hidden group',
                      isOffline
                        ? 'bg-red-50/50 border-red-100'
                        : 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800'
                    )}
                    title={cam.name}
                  >
                    {!isOffline && (
                      <>
                        {/* scanline effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-30" />
                        {/* fake "feed" pattern */}
                        <div className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(0deg, rgba(16,185,129,0.1) 0px, rgba(16,185,129,0.1) 1px, transparent 1px, transparent 4px)',
                          }}
                        />
                      </>
                    )}
                    <div className="relative flex items-center justify-between">
                      <span
                        className={cn(
                          'text-[8px] font-mono font-bold',
                          isOffline ? 'text-red-700' : 'text-white/80'
                        )}
                      >
                        {cam.camera_code.split('-').slice(-1)[0]}
                      </span>
                      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                    </div>
                    <div className="relative">
                      {isOffline ? (
                        <WifiOff className="w-4 h-4 text-red-400 mx-auto" />
                      ) : (
                        <Camera className="w-4 h-4 text-emerald-400/70 mx-auto" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <button className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm">
              <Video className="w-4 h-4" />
              Ver feed en vivo
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* F) Contactos de Emergencia */}
          <div className="card overflow-hidden hover:-translate-y-0.5 transition-all duration-300 p-0">
            <div className="bg-gradient-to-br from-red-600 via-rose-600 to-red-700 p-5 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-orange-500/30 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Contactos de Emergencia
                  </h2>
                  <p className="text-xs text-red-50/90 mt-0.5">
                    Marca rápida 24/7
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 space-y-1.5">
              {emergencyContacts.map((c) => {
                const Icon = c.icon
                return (
                  <a
                    key={c.name}
                    href={`tel:${c.number}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div
                      className={cn(
                        'w-9 h-9 rounded-lg bg-gray-50 group-hover:bg-white flex items-center justify-center shrink-0',
                        c.accent
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {c.name}
                      </p>
                      <p className="font-mono text-xs text-gray-500">
                        {c.number}
                      </p>
                    </div>
                    <PhoneCall className="w-4 h-4 text-gray-300 group-hover:text-primary-600 transition-colors" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* G) Acciones Rápidas */}
          <div className="card hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Acciones Rápidas
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Operaciones del centro de mando
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button className="group flex flex-col items-start gap-2 p-3.5 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-100 hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
                <FileText className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-xs font-black text-gray-900">
                    Reportar Incidente
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Nuevo INC
                  </p>
                </div>
              </button>
              <button className="group flex flex-col items-start gap-2 p-3.5 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100 hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
                <ScanFace className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs font-black text-gray-900">
                    Iniciar Check-in
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Identificar
                  </p>
                </div>
              </button>
              <button className="group flex flex-col items-start gap-2 p-3.5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
                <Video className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs font-black text-gray-900">
                    Ver Cámaras Live
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    CCTV feed
                  </p>
                </div>
              </button>
              <button className="group flex flex-col items-start gap-2 p-3.5 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all text-left text-white relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10 blur-xl" />
                <AlertOctagon className="w-5 h-5 relative" />
                <div className="relative">
                  <p className="text-xs font-black">Activar SOS</p>
                  <p className="text-[10px] opacity-90 mt-0.5">PNP directo</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============ 5. FOOTER COMPLIANCE ============ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card hover:-translate-y-0.5 transition-all duration-300 p-5 flex items-start gap-3 bg-gradient-to-br from-blue-50/40 to-white border-blue-100">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-blue-700">
              Ley 29571
            </p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
              Código de Protección al Consumidor
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              Cumplimiento al 100% · INDECOPI
            </p>
          </div>
        </div>
        <div className="card hover:-translate-y-0.5 transition-all duration-300 p-5 flex items-start gap-3 bg-gradient-to-br from-violet-50/40 to-white border-violet-100">
          <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-violet-700" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-violet-700">
              Ley 29733
            </p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
              Protección de Datos Personales
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              Datos biométricos cifrados · ANPDP
            </p>
          </div>
        </div>
        <div className="card hover:-translate-y-0.5 transition-all duration-300 p-5 flex items-start gap-3 bg-gradient-to-br from-emerald-50/40 to-white border-emerald-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-emerald-700">
              Auditoría
            </p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
              Última auditoría: 28 Abr 2026
            </p>
            <p className="text-[11px] text-gray-500 mt-1">
              Próxima revisión en 90 días
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
