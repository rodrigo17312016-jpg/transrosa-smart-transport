'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  AlertOctagon,
  Phone,
  MapPin,
  User,
  Bus,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  Wallet,
  UserX,
  Activity,
  Wrench,
  Eye,
  Search,
  AlertCircle,
  ArrowLeft,
  Camera,
  Upload,
} from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { INCIDENT_TYPES, SECURITY_RESPONSE_PROTOCOL } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'

// ============================================================
// Types & Maps
// ============================================================

type IncidentType = keyof typeof INCIDENT_TYPES
type Severity = 'low' | 'medium' | 'high' | 'critical'
type ReporterRole = 'driver' | 'passenger' | 'admin' | 'partner'
type SOSRole = 'driver' | 'passenger' | 'admin'

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

const severityConfig: Record<Severity, { label: string; description: string; color: string; ring: string; iconColor: string }> = {
  low: {
    label: 'Baja',
    description: 'Sin riesgo inmediato',
    color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
    ring: 'ring-emerald-500',
    iconColor: 'text-emerald-600',
  },
  medium: {
    label: 'Media',
    description: 'Requiere atencion',
    color: 'bg-amber-50 border-amber-200 hover:border-amber-400',
    ring: 'ring-amber-500',
    iconColor: 'text-amber-600',
  },
  high: {
    label: 'Alta',
    description: 'Situacion grave',
    color: 'bg-orange-50 border-orange-200 hover:border-orange-400',
    ring: 'ring-orange-500',
    iconColor: 'text-orange-600',
  },
  critical: {
    label: 'Critica',
    description: 'Emergencia activa',
    color: 'bg-red-50 border-red-200 hover:border-red-400',
    ring: 'ring-red-500',
    iconColor: 'text-red-600',
  },
}

const roleLabels: Record<ReporterRole, string> = {
  driver: 'Conductor',
  passenger: 'Pasajero',
  admin: 'Administrativo',
  partner: 'Socio',
}

interface RecentIncident {
  id: string
  incident_number: string
  type: string
  status: string
  created_at: string
  title: string
}

interface Vehicle {
  id: string
  plate_number: string
  internal_number: number
}

const emergencyContacts = [
  { label: 'PNP - Policia Nacional', number: '105', tel: '105', urgent: true },
  { label: 'SAMU - Emergencia Medica', number: '116', tel: '116', urgent: true },
  { label: 'Bomberos', number: '116', tel: '116', urgent: true },
  { label: 'Serenazgo Huacho', number: SECURITY_RESPONSE_PROTOCOL.serenazgoHuacho, tel: SECURITY_RESPONSE_PROTOCOL.serenazgoHuacho.replace(/\s/g, ''), urgent: false },
  { label: 'Serenazgo Huaura', number: SECURITY_RESPONSE_PROTOCOL.serenazgoHuaura, tel: SECURITY_RESPONSE_PROTOCOL.serenazgoHuaura.replace(/\s/g, ''), urgent: false },
  { label: 'Jefe de Seguridad TransRosa', number: SECURITY_RESPONSE_PROTOCOL.internalSecurityChief, tel: SECURITY_RESPONSE_PROTOCOL.internalSecurityChief.replace(/\s/g, ''), urgent: false },
]

// ============================================================
// Component
// ============================================================

export default function ReportarPage() {
  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Form fields
  const [type, setType] = useState<IncidentType | ''>('')
  const [severity, setSeverity] = useState<Severity | ''>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [estimatedLoss, setEstimatedLoss] = useState('')
  const [reporterName, setReporterName] = useState('')
  const [reporterPhone, setReporterPhone] = useState('')
  const [reporterRole, setReporterRole] = useState<ReporterRole>('passenger')

  // SOS state
  const [showSosModal, setShowSosModal] = useState(false)
  const [sosRole, setSosRole] = useState<SOSRole>('passenger')
  const [sosPlate, setSosPlate] = useState('')
  const [sosDescription, setSosDescription] = useState('')
  const [sosConfirming, setSosConfirming] = useState(false)
  const [sosProgress, setSosProgress] = useState(0)
  const [sosSent, setSosSent] = useState(false)
  const [sosSending, setSosSending] = useState(false)
  const [sosError, setSosError] = useState<string | null>(null)
  const sosHoldRef = useRef<NodeJS.Timeout | null>(null)
  const sosProgressRef = useRef<NodeJS.Timeout | null>(null)

  // Result of incident submission
  const [createdIncident, setCreatedIncident] = useState<{ incident_number: string; id: string } | null>(null)

  // Vehicles dropdown
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [recentIncidents, setRecentIncidents] = useState<RecentIncident[]>([])
  const supabaseReady = isSupabaseConfigured()

  // ============================================================
  // Load vehicles + subscribe to recent incidents
  // ============================================================
  useEffect(() => {
    if (!supabaseReady) return
    const supabase = createClient()

    // Load vehicles
    supabase
      .from('tr_vehicles')
      .select('id, plate_number, internal_number')
      .order('internal_number', { ascending: true })
      .then(({ data }) => {
        if (data) setVehicles(data as Vehicle[])
      })

    // Load recent incidents
    const loadRecent = async () => {
      const { data } = await supabase
        .from('tr_incidents')
        .select('id, incident_number, type, status, created_at, title')
        .order('created_at', { ascending: false })
        .limit(5)
      if (data) setRecentIncidents(data as RecentIncident[])
    }
    loadRecent()

    // Realtime subscription
    const channel = supabase
      .channel('incidents-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tr_incidents' },
        () => loadRecent()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabaseReady])

  // ============================================================
  // SOS Hold-to-confirm logic
  // ============================================================
  const startSosHold = () => {
    setSosConfirming(true)
    setSosProgress(0)
    const start = Date.now()
    sosProgressRef.current = setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, (elapsed / 2000) * 100)
      setSosProgress(pct)
    }, 30)
    sosHoldRef.current = setTimeout(() => {
      sendSos()
    }, 2000)
  }

  const cancelSosHold = () => {
    if (sosHoldRef.current) clearTimeout(sosHoldRef.current)
    if (sosProgressRef.current) clearInterval(sosProgressRef.current)
    if (!sosSending) {
      setSosConfirming(false)
      setSosProgress(0)
    }
  }

  const sendSos = async () => {
    if (sosHoldRef.current) clearTimeout(sosHoldRef.current)
    if (sosProgressRef.current) clearInterval(sosProgressRef.current)
    setSosSending(true)
    setSosError(null)

    // Get geolocation
    const getPosition = (): Promise<GeolocationPosition | null> =>
      new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(null)
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          () => resolve(null),
          { timeout: 5000, enableHighAccuracy: true }
        )
      })

    const position = await getPosition()

    if (!supabaseReady) {
      setSosError('Supabase no configurado. Llama directamente al 105.')
      setSosSending(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.from('tr_sos_alerts').insert({
        triggered_by: sosRole,
        vehicle_plate: sosPlate || null,
        description: sosDescription || null,
        lat: position?.coords.latitude || null,
        lng: position?.coords.longitude || null,
        status: 'active',
      })
      if (error) throw error
      setSosSent(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al enviar SOS'
      setSosError(msg)
    } finally {
      setSosSending(false)
      setSosConfirming(false)
      setSosProgress(0)
    }
  }

  const resetSos = () => {
    setShowSosModal(false)
    setSosSent(false)
    setSosError(null)
    setSosConfirming(false)
    setSosProgress(0)
    setSosDescription('')
    setSosPlate('')
  }

  // ============================================================
  // Incident submission
  // ============================================================
  const submitIncident = async () => {
    if (!type || !severity) return
    setSubmitting(true)
    setSubmitError(null)

    if (!supabaseReady) {
      setSubmitError('Supabase no esta configurado. No se puede enviar el reporte.')
      setSubmitting(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tr_incidents')
        .insert({
          type,
          severity,
          status: 'reported',
          title,
          description,
          location,
          vehicle_plate: vehiclePlate || null,
          reporter_name: reporterName,
          reporter_phone: reporterPhone,
          reporter_role: reporterRole,
          estimated_loss: estimatedLoss ? Number(estimatedLoss) : null,
          police_notified: false,
        })
        .select()
        .single()

      if (error) throw error

      setCreatedIncident({
        incident_number: data?.incident_number || `INC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
        id: data?.id || '',
      })
      setSubmitted(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido al enviar el reporte'
      setSubmitError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSubmitted(false)
    setSubmitError(null)
    setType('')
    setSeverity('')
    setTitle('')
    setDescription('')
    setLocation('')
    setVehiclePlate('')
    setEstimatedLoss('')
    setReporterName('')
    setReporterPhone('')
    setReporterRole('passenger')
    setCreatedIncident(null)
  }

  // ============================================================
  // Validation per step
  // ============================================================
  const canAdvance = () => {
    if (step === 1) return !!type
    if (step === 2) return !!severity
    if (step === 3) return title.trim().length >= 3 && description.trim().length >= 5 && location.trim().length >= 3
    if (step === 4) return reporterName.trim().length >= 2 && reporterPhone.trim().length >= 6
    return true
  }

  const formatTimeAgo = (iso: string) => {
    const diffMs = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diffMs / 60000)
    if (mins < 1) return 'Ahora'
    if (mins < 60) return `${mins} min`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h`
    const days = Math.floor(hrs / 24)
    return `${days}d`
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      reported: 'bg-amber-100 text-amber-800',
      investigating: 'bg-blue-100 text-blue-800',
      police_notified: 'bg-orange-100 text-orange-800',
      resolved: 'bg-emerald-100 text-emerald-800',
      closed: 'bg-gray-100 text-gray-800',
    }
    const labels: Record<string, string> = {
      reported: 'Reportado',
      investigating: 'Investigando',
      police_notified: 'PNP notificada',
      resolved: 'Resuelto',
      closed: 'Cerrado',
    }
    return { className: map[status] || 'bg-gray-100 text-gray-700', label: labels[status] || status }
  }

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-800 to-secondary-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.4),_transparent_60%)]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-red-500/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-10 h-10 text-white" />
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold tracking-widest uppercase mb-3">
                Centro de Seguridad TransRosa
              </span>
              <h1 className="text-3xl sm:text-5xl font-black font-[family-name:var(--font-poppins)] leading-tight">
                Reportar Incidente
              </h1>
              <p className="mt-3 text-white/80 text-base sm:text-lg max-w-2xl">
                Tu seguridad es primero. Reporta cualquier situacion sospechosa o activa la alerta de emergencia conectada directamente a la PNP.
              </p>
            </div>
          </div>

          {/* Two big buttons */}
          <div className="grid sm:grid-cols-2 gap-4 mt-10 max-w-4xl">
            <button
              onClick={() => setShowSosModal(true)}
              className="relative group bg-red-600 hover:bg-red-500 transition-all rounded-2xl p-6 text-left shadow-2xl shadow-red-900/40 ring-2 ring-red-400/50 ring-offset-2 ring-offset-red-900"
            >
              <div className="absolute inset-0 rounded-2xl bg-red-400 animate-ping opacity-20" />
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <AlertOctagon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold tracking-widest uppercase text-white/70">Activar SOS</p>
                  <p className="text-2xl font-black font-[family-name:var(--font-poppins)]">EMERGENCIA</p>
                  <p className="text-sm text-white/80 mt-1">Alerta inmediata a la PNP</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="group bg-secondary-900/60 hover:bg-secondary-900/80 backdrop-blur-sm border border-white/20 transition-all rounded-2xl p-6 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold tracking-widest uppercase text-white/60">Formulario</p>
                  <p className="text-2xl font-black font-[family-name:var(--font-poppins)]">Reportar Incidente</p>
                  <p className="text-sm text-white/70 mt-1">Robo, acoso, averia, etc.</p>
                </div>
              </div>
            </button>
          </div>

          {!supabaseReady && (
            <div className="mt-6 max-w-4xl flex items-start gap-3 p-4 rounded-xl bg-amber-500/20 border border-amber-300/40 text-amber-50">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold">Modo demo: Supabase no configurado.</p>
                <p className="text-amber-100/80">
                  Los reportes y alertas no se guardaran. Llama directamente a las lineas de emergencia para situaciones reales.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div id="formulario" className="lg:col-span-2 space-y-6">
            {!submitted ? (
              <div className="card">
                {/* Stepper */}
                <div className="flex items-center justify-between mb-8">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="flex-1 flex items-center">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0',
                          step === s
                            ? 'bg-red-600 text-white shadow-lg shadow-red-300'
                            : step > s
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-100 text-gray-400'
                        )}
                      >
                        {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                      </div>
                      {s < 5 && (
                        <div
                          className={cn(
                            'flex-1 h-0.5 mx-2 transition-all',
                            step > s ? 'bg-emerald-500' : 'bg-gray-100'
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step content */}
                {step === 1 && (
                  <div className="animate-fade-in">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      Paso 1 - Tipo de incidente
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Selecciona la categoria que mejor describe lo que ocurrio.
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(Object.entries(INCIDENT_TYPES) as [IncidentType, typeof INCIDENT_TYPES[IncidentType]][]).map(
                        ([key, def]) => {
                          const Icon = incidentIconMap[def.icon] || AlertCircle
                          const active = type === key
                          return (
                            <button
                              key={key}
                              onClick={() => setType(key)}
                              className={cn(
                                'p-4 rounded-2xl border-2 text-left transition-all',
                                active
                                  ? 'border-red-500 bg-red-50 ring-2 ring-red-100'
                                  : 'border-gray-200 hover:border-red-300 hover:bg-red-50/30'
                              )}
                            >
                              <div
                                className={cn(
                                  'w-10 h-10 rounded-xl flex items-center justify-center mb-3',
                                  active ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                                )}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <p className="font-semibold text-gray-900 text-sm">{def.label}</p>
                            </button>
                          )
                        }
                      )}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-fade-in">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      Paso 2 - Gravedad
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Que tan urgente es la situacion?
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {(Object.entries(severityConfig) as [Severity, (typeof severityConfig)[Severity]][]).map(
                        ([key, cfg]) => {
                          const active = severity === key
                          return (
                            <button
                              key={key}
                              onClick={() => setSeverity(key)}
                              className={cn(
                                'p-5 rounded-2xl border-2 text-left transition-all',
                                cfg.color,
                                active && `ring-2 ring-offset-2 ${cfg.ring}`
                              )}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle className={cn('w-5 h-5', cfg.iconColor)} />
                                <p className="font-bold text-gray-900">{cfg.label}</p>
                              </div>
                              <p className="text-sm text-gray-600">{cfg.description}</p>
                            </button>
                          )
                        }
                      )}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="animate-fade-in space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        Paso 3 - Detalles
                      </h2>
                      <p className="text-sm text-gray-500">
                        Cuentanos lo ocurrido con la mayor precision posible.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Titulo *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ej: Robo de celular en parada Vegueta"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Descripcion *
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="Describe lo ocurrido: cuando, como, quienes estaban presentes..."
                        className="input resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        <MapPin className="inline w-4 h-4 mr-1 -mt-0.5 text-red-500" />
                        Ubicacion *
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ej: Av. 200 Millas frente al mercado"
                        className="input"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          <Bus className="inline w-4 h-4 mr-1 -mt-0.5 text-gray-500" />
                          Vehiculo (opcional)
                        </label>
                        {vehicles.length > 0 ? (
                          <select
                            value={vehiclePlate}
                            onChange={(e) => setVehiclePlate(e.target.value)}
                            className="input"
                          >
                            <option value="">-- Sin especificar --</option>
                            {vehicles.map((v) => (
                              <option key={v.id} value={v.plate_number}>
                                #{v.internal_number} - {v.plate_number}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={vehiclePlate}
                            onChange={(e) => setVehiclePlate(e.target.value)}
                            placeholder="ABC-123"
                            className="input"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          <Wallet className="inline w-4 h-4 mr-1 -mt-0.5 text-gray-500" />
                          Perdida estimada S/
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={estimatedLoss}
                          onChange={(e) => setEstimatedLoss(e.target.value)}
                          placeholder="0.00"
                          className="input"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800">
                      <Camera className="w-4 h-4 shrink-0" />
                      <span>Si tienes fotos o videos como evidencia, llevalos contigo al momento de hacer la denuncia formal.</span>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="animate-fade-in space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        Paso 4 - Tus datos
                      </h2>
                      <p className="text-sm text-gray-500">
                        Solo seran usados para hacer seguimiento del reporte.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        <User className="inline w-4 h-4 mr-1 -mt-0.5 text-gray-500" />
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        placeholder="Tu nombre y apellido"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        <Phone className="inline w-4 h-4 mr-1 -mt-0.5 text-gray-500" />
                        Telefono *
                      </label>
                      <input
                        type="tel"
                        value={reporterPhone}
                        onChange={(e) => setReporterPhone(e.target.value)}
                        placeholder="999 999 999"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Tu rol *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {(Object.entries(roleLabels) as [ReporterRole, string][]).map(([key, label]) => {
                          const active = reporterRole === key
                          return (
                            <label
                              key={key}
                              className={cn(
                                'cursor-pointer p-3 rounded-xl border-2 text-center transition-all',
                                active
                                  ? 'border-red-500 bg-red-50 ring-2 ring-red-100'
                                  : 'border-gray-200 hover:border-red-300'
                              )}
                            >
                              <input
                                type="radio"
                                name="reporterRole"
                                value={key}
                                checked={active}
                                onChange={() => setReporterRole(key)}
                                className="sr-only"
                              />
                              <p className={cn('text-sm font-semibold', active ? 'text-red-700' : 'text-gray-700')}>
                                {label}
                              </p>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="animate-fade-in space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        Paso 5 - Confirmar y enviar
                      </h2>
                      <p className="text-sm text-gray-500">
                        Revisa los datos antes de enviar el reporte.
                      </p>
                    </div>

                    <div className="rounded-2xl border-2 border-gray-100 divide-y divide-gray-100 overflow-hidden">
                      <RowSummary label="Tipo" value={type ? INCIDENT_TYPES[type as IncidentType].label : '-'} />
                      <RowSummary
                        label="Gravedad"
                        value={severity ? severityConfig[severity as Severity].label : '-'}
                      />
                      <RowSummary label="Titulo" value={title} />
                      <RowSummary label="Descripcion" value={description} />
                      <RowSummary label="Ubicacion" value={location} />
                      <RowSummary label="Vehiculo" value={vehiclePlate || 'No especificado'} />
                      <RowSummary
                        label="Perdida estimada"
                        value={estimatedLoss ? `S/ ${Number(estimatedLoss).toFixed(2)}` : 'No especificada'}
                      />
                      <RowSummary label="Reportante" value={`${reporterName} (${roleLabels[reporterRole]})`} />
                      <RowSummary label="Telefono" value={reporterPhone} />
                    </div>

                    {submitError && (
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Error al enviar</p>
                          <p>{submitError}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4 | 5) : s))}
                    disabled={step === 1 || submitting}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Atras
                  </button>

                  {step < 5 ? (
                    <button
                      onClick={() => setStep((s) => (s < 5 ? ((s + 1) as 1 | 2 | 3 | 4 | 5) : s))}
                      disabled={!canAdvance()}
                      className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Continuar
                    </button>
                  ) : (
                    <button
                      onClick={submitIncident}
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Enviar reporte
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              // ============== Success Screen ==============
              <div className="card text-center animate-fade-in">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-6 animate-bounce">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 font-[family-name:var(--font-poppins)]">
                  Reporte enviado
                </h2>
                <p className="text-gray-500 mb-2">Hemos registrado tu incidente con el numero:</p>
                <p className="text-2xl font-mono font-bold text-red-600 mb-8">
                  {createdIncident?.incident_number}
                </p>

                <div className="text-left rounded-2xl border-2 border-gray-100 divide-y divide-gray-100 overflow-hidden mb-6">
                  <RowSummary label="Tipo" value={type ? INCIDENT_TYPES[type as IncidentType].label : '-'} />
                  <RowSummary
                    label="Gravedad"
                    value={severity ? severityConfig[severity as Severity].label : '-'}
                  />
                  <RowSummary label="Titulo" value={title} />
                  <RowSummary label="Ubicacion" value={location} />
                  <RowSummary label="Reportante" value={reporterName} />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="tel:105"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-200 transition-all"
                  >
                    <Phone className="w-4 h-4" /> Notificar a PNP (105)
                  </a>
                  <button
                    onClick={resetForm}
                    className="flex-1 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                  >
                    Reportar otro
                  </button>
                </div>
              </div>
            )}

            {/* ============ Recent incidents feed ============ */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Incidentes recientes</h2>
                  <p className="text-sm text-gray-500">Feed en tiempo real</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  En vivo
                </span>
              </div>

              {recentIncidents.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-400">
                  {supabaseReady ? 'Aun no hay incidentes registrados.' : 'Conecta Supabase para ver el feed en vivo.'}
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentIncidents.map((inc) => {
                    const def = INCIDENT_TYPES[inc.type as IncidentType]
                    const Icon = def ? incidentIconMap[def.icon] : AlertCircle
                    const status = statusBadge(inc.status)
                    return (
                      <li key={inc.id} className="py-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {inc.title || (def ? def.label : inc.type)}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                            <span className="font-mono">{inc.incident_number}</span>
                            <span>-</span>
                            <span>{formatTimeAgo(inc.created_at)}</span>
                          </div>
                        </div>
                        <span className={cn('badge text-xs', status.className)}>{status.label}</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Right: Sticky emergency contacts */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="card bg-gradient-to-br from-red-600 to-red-700 text-white border-none">
                <div className="flex items-center gap-3 mb-2">
                  <AlertOctagon className="w-6 h-6" />
                  <h2 className="text-lg font-black">Contactos de emergencia</h2>
                </div>
                <p className="text-sm text-white/80 mb-4">
                  Llama directamente desde tu celular tocando una opcion.
                </p>
                <ul className="space-y-2">
                  {emergencyContacts.map((c) => (
                    <li key={c.label}>
                      <a
                        href={`tel:${c.tel}`}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]',
                          c.urgent
                            ? 'bg-white/10 hover:bg-white/20 border border-white/20'
                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                        )}
                      >
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                            c.urgent ? 'bg-white text-red-600' : 'bg-white/15 text-white'
                          )}
                        >
                          <Phone className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-tight">{c.label}</p>
                          <p className="text-xs text-white/70 mt-0.5 font-mono">{c.number}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600" /> Protocolo TransRosa
                </h3>
                <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Mantente en lugar seguro.</li>
                  <li>Si es urgente, presiona el boton SOS.</li>
                  <li>Llena el formulario con detalles claros.</li>
                  <li>Conserva evidencia (fotos, videos, testigos).</li>
                  <li>Acude a la comisaria si la PNP lo requiere.</li>
                </ol>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ============ SOS Modal ============ */}
      {showSosModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-gradient-to-br from-red-700 via-red-800 to-red-900 text-white rounded-3xl shadow-2xl ring-4 ring-red-500/40 overflow-hidden">
            {!sosSent && !sosSending && (
              <button
                onClick={resetSos}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                aria-label="Cerrar"
              >
                <span className="text-xl leading-none">x</span>
              </button>
            )}

            <div className="p-8">
              {!sosSent ? (
                <>
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="relative w-20 h-20 mb-4">
                      <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                      <div className="relative w-20 h-20 rounded-full bg-white/15 flex items-center justify-center">
                        <AlertOctagon className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-black font-[family-name:var(--font-poppins)] mb-2">
                      EMERGENCIA SOS
                    </h2>
                    <p className="text-white/80 text-sm">
                      Estas seguro de activar la emergencia? Se notificara al equipo de seguridad y a la PNP.
                    </p>
                  </div>

                  {/* Mini form */}
                  <div className="space-y-3 mb-6">
                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
                        Tu rol
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['driver', 'passenger', 'admin'] as SOSRole[]).map((r) => (
                          <button
                            key={r}
                            onClick={() => setSosRole(r)}
                            className={cn(
                              'py-2 rounded-lg text-xs font-bold transition-all',
                              sosRole === r
                                ? 'bg-white text-red-700'
                                : 'bg-white/10 text-white/80 hover:bg-white/20'
                            )}
                          >
                            {r === 'driver' ? 'Conductor' : r === 'passenger' ? 'Pasajero' : 'Admin'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
                        Placa del vehiculo (opcional)
                      </label>
                      <input
                        type="text"
                        value={sosPlate}
                        onChange={(e) => setSosPlate(e.target.value.toUpperCase())}
                        placeholder="ABC-123"
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:bg-white/20 focus:border-white/40 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
                        Que esta pasando? (opcional)
                      </label>
                      <textarea
                        value={sosDescription}
                        onChange={(e) => setSosDescription(e.target.value)}
                        rows={2}
                        placeholder="Breve descripcion..."
                        className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:bg-white/20 focus:border-white/40 text-sm resize-none"
                      />
                    </div>
                  </div>

                  {sosError && (
                    <div className="mb-4 p-3 rounded-lg bg-amber-500/20 border border-amber-300/40 text-amber-50 text-xs">
                      <p className="font-bold">{sosError}</p>
                    </div>
                  )}

                  {/* Hold-to-confirm button */}
                  <button
                    onMouseDown={startSosHold}
                    onMouseUp={cancelSosHold}
                    onMouseLeave={cancelSosHold}
                    onTouchStart={startSosHold}
                    onTouchEnd={cancelSosHold}
                    disabled={sosSending}
                    className="relative w-full overflow-hidden rounded-2xl bg-white text-red-700 py-5 font-black text-lg shadow-xl shadow-red-950/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60"
                  >
                    {/* Progress fill */}
                    <div
                      className="absolute inset-0 bg-red-200 transition-all"
                      style={{ width: `${sosProgress}%` }}
                    />
                    <span className="relative flex items-center justify-center gap-2">
                      {sosSending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" /> Enviando alerta...
                        </>
                      ) : sosConfirming ? (
                        <>MANTEN PRESIONADO ({Math.round((100 - sosProgress) / 50)}s)</>
                      ) : (
                        <>
                          <AlertOctagon className="w-5 h-5" /> MANTEN PRESIONADO 2 SEG
                        </>
                      )}
                    </span>
                  </button>

                  <p className="text-center text-xs text-white/60 mt-4">
                    Mantenlo presionado para evitar activaciones accidentales.
                  </p>
                </>
              ) : (
                // ============== SOS Sent ==============
                <div className="text-center py-4">
                  <div className="w-24 h-24 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle2 className="w-14 h-14 text-white" />
                  </div>
                  <h2 className="text-3xl font-black font-[family-name:var(--font-poppins)] mb-2">
                    ALERTA ENVIADA
                  </h2>
                  <p className="text-white/80 text-sm mb-2">
                    Esperando respuesta de la PNP
                  </p>
                  <div className="inline-flex items-center gap-2 mt-2 mb-6 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                    Tu ubicacion fue compartida con el equipo de seguridad
                  </div>
                  <a
                    href="tel:105"
                    className="block w-full px-5 py-4 rounded-2xl bg-white text-red-700 font-black text-lg shadow-lg hover:scale-[1.02] transition-transform"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Phone className="w-5 h-5" /> Llamar PNP (105)
                    </span>
                  </a>
                  <button
                    onClick={resetSos}
                    className="mt-3 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

// ============================================================
// Sub-components
// ============================================================
function RowSummary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 w-32 shrink-0">
        {label}
      </p>
      <p className="text-sm text-gray-900 flex-1 break-words">{value || '-'}</p>
    </div>
  )
}
