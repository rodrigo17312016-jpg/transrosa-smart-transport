'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  useLiveTickets,
  useLiveCheckIns,
  useLiveIncidents,
  useLiveSOSAlerts,
} from '@/lib/supabase/realtime'
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { cn, formatCurrency } from '@/lib/utils'
import {
  Activity,
  Ticket,
  UserCheck,
  AlertTriangle,
  AlertOctagon,
  Bus,
  Users,
  MapPin,
  Clock,
  TrendingUp,
  Wifi,
  WifiOff,
  Zap,
  ChevronRight,
  RefreshCw,
  ScanFace,
  ScanLine,
  IdCard,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react'

type TabKey = 'boletos' | 'checkins' | 'incidentes'

const FRESH_WINDOW_MS = 5_000
const NEW_MIN_WINDOW_MS = 60_000

function isToday(iso: string | null | undefined): boolean {
  if (!iso) return false
  const d = new Date(iso)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}

function isWithinMs(iso: string | null | undefined, ms: number): boolean {
  if (!iso) return false
  return Date.now() - new Date(iso).getTime() < ms
}

function formatHHMMSS(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function formatRelative(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime())
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return `hace ${sec}s`
  const min = Math.floor(sec / 60)
  if (min < 60) return `hace ${min}m`
  const hr = Math.floor(min / 60)
  return `hace ${hr}h`
}

function methodLabel(method: string): string {
  switch (method) {
    case 'facial_recognition':
      return 'Facial'
    case 'qr_code':
      return 'QR'
    case 'dni_scan':
      return 'DNI'
    case 'manual':
      return 'Manual'
    case 'cash':
      return 'Efectivo'
    case 'yape':
      return 'Yape'
    case 'plin':
      return 'Plin'
    case 'card':
      return 'Tarjeta'
    case 'transfer':
      return 'Transf.'
    default:
      return method
  }
}

function severityClasses(sev: string): string {
  switch (sev) {
    case 'critical':
      return 'bg-red-500/20 text-red-300 border-red-500/40'
    case 'high':
      return 'bg-orange-500/20 text-orange-300 border-orange-500/40'
    case 'medium':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    default:
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  }
}

function statusClasses(s: string): string {
  switch (s) {
    case 'active':
    case 'reported':
      return 'bg-red-500/20 text-red-300 border-red-500/40'
    case 'investigating':
    case 'responded':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    case 'resolved':
    case 'closed':
    case 'used':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    default:
      return 'bg-slate-500/20 text-slate-300 border-slate-500/40'
  }
}

export default function LiveOperationsPage() {
  const configured = isSupabaseConfigured()

  const tickets = useLiveTickets(50)
  const checkIns = useLiveCheckIns(50)
  const incidents = useLiveIncidents(20)
  const sosAlerts = useLiveSOSAlerts(10)

  const [now, setNow] = useState<number>(() => Date.now())
  const [tab, setTab] = useState<TabKey>('boletos')
  const [respondingId, setRespondingId] = useState<string | null>(null)

  // Tick every second so relative timestamps and "fresh" highlights refresh.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  // Build merged event timeline (most recent first, max 30).
  const events = useMemo(() => {
    const allEvents = [
      ...tickets.data.map((t) => ({
        kind: 'ticket' as const,
        time: t.created_at,
        item: t,
      })),
      ...checkIns.data.map((c) => ({
        kind: 'checkin' as const,
        time: c.check_in_time,
        item: c,
      })),
      ...incidents.data.map((i) => ({
        kind: 'incident' as const,
        time: i.created_at,
        item: i,
      })),
      ...sosAlerts.data.map((s) => ({
        kind: 'sos' as const,
        time: s.triggered_at,
        item: s,
      })),
    ]
    return allEvents
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 30)
  }, [tickets.data, checkIns.data, incidents.data, sosAlerts.data])

  // KPIs.
  const ticketsToday = useMemo(
    () => tickets.data.filter((t) => isToday(t.created_at)).length,
    [tickets.data]
  )
  const checkInsToday = useMemo(
    () => checkIns.data.filter((c) => isToday(c.check_in_time)).length,
    [checkIns.data]
  )
  const incidentsActive = useMemo(
    () =>
      incidents.data.filter(
        (i) => i.status === 'reported' || i.status === 'investigating'
      ).length,
    [incidents.data]
  )
  const sosActive = useMemo(
    () => sosAlerts.data.filter((s) => s.status === 'active').length,
    [sosAlerts.data]
  )

  // Reference `now` so "+X en último minuto" recomputes on each tick.
  const ticketsLastMinute = useMemo(
    () => tickets.data.filter((t) => isWithinMs(t.created_at, NEW_MIN_WINDOW_MS)).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tickets.data, now]
  )
  const checkInsLastMinute = useMemo(
    () =>
      checkIns.data.filter((c) => isWithinMs(c.check_in_time, NEW_MIN_WINDOW_MS)).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkIns.data, now]
  )
  const incidentsLastMinute = useMemo(
    () =>
      incidents.data.filter((i) => isWithinMs(i.created_at, NEW_MIN_WINDOW_MS)).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [incidents.data, now]
  )
  const sosLastMinute = useMemo(
    () =>
      sosAlerts.data.filter((s) => isWithinMs(s.triggered_at, NEW_MIN_WINDOW_MS)).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sosAlerts.data, now]
  )

  // Most recent active SOS for the banner.
  const activeSOS = useMemo(
    () =>
      sosAlerts.data
        .filter((s) => s.status === 'active')
        .sort(
          (a, b) =>
            new Date(b.triggered_at).getTime() - new Date(a.triggered_at).getTime()
        ),
    [sosAlerts.data]
  )
  const topSOS = activeSOS[0]

  // Ticket revenue today.
  const revenueToday = useMemo(
    () =>
      tickets.data
        .filter((t) => isToday(t.created_at))
        .reduce((acc, t) => acc + Number(t.fare ?? 0), 0),
    [tickets.data]
  )

  const loading =
    tickets.loading || checkIns.loading || incidents.loading || sosAlerts.loading
  const anyError =
    tickets.error || checkIns.error || incidents.error || sosAlerts.error
  const connected = configured && !anyError
  const hasAnyData = events.length > 0

  const refetchAll = () => {
    tickets.refetch()
    checkIns.refetch()
    incidents.refetch()
    sosAlerts.refetch()
  }

  const handleRespondSOS = async (id: string) => {
    if (!configured) return
    try {
      setRespondingId(id)
      const supabase = createClient()
      await supabase
        .from('tr_sos_alerts')
        .update({ status: 'responded', responded_at: new Date().toISOString() })
        .eq('id', id)
      // Realtime subscription will refresh, but force a refetch as backup.
      sosAlerts.refetch()
    } catch (e) {
      console.error(e)
    } finally {
      setRespondingId(null)
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
          {/* Header */}
          <header className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-poppins)]">
                  Operaciones en Vivo
                </h1>
              </div>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
                Centro de control en tiempo real - cada acción aparece automáticamente
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border',
                  connected
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                    : 'bg-red-500/15 text-red-300 border-red-500/40'
                )}
              >
                {connected ? (
                  <>
                    <Wifi className="w-3.5 h-3.5" />
                    CONECTADO
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5" />
                    OFFLINE
                  </>
                )}
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-slate-700 bg-slate-900 text-slate-300">
                <Clock className="w-3.5 h-3.5" />
                {new Date(now).toLocaleTimeString('es-PE', { hour12: false })}
              </span>
              <button
                onClick={refetchAll}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
                Refrescar
              </button>
            </div>
          </header>

          {/* Demo mode warning */}
          {!configured && (
            <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200 text-sm">
              <strong className="font-semibold">Modo demo - </strong>
              configura Supabase (variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY)
              para ver datos en vivo.
            </div>
          )}

          {/* KPI cards */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <KpiCard
              label="Boletos Hoy"
              value={ticketsToday}
              delta={ticketsLastMinute}
              icon={<Ticket className="w-5 h-5" />}
              accent="from-sky-500/20 to-sky-500/5 border-sky-500/30"
              accentText="text-sky-300"
              pulse={ticketsLastMinute > 0}
            />
            <KpiCard
              label="Check-ins Hoy"
              value={checkInsToday}
              delta={checkInsLastMinute}
              icon={<UserCheck className="w-5 h-5" />}
              accent="from-emerald-500/20 to-emerald-500/5 border-emerald-500/30"
              accentText="text-emerald-300"
              pulse={checkInsLastMinute > 0}
            />
            <KpiCard
              label="Incidentes Activos"
              value={incidentsActive}
              delta={incidentsLastMinute}
              icon={<AlertTriangle className="w-5 h-5" />}
              accent="from-amber-500/20 to-amber-500/5 border-amber-500/30"
              accentText="text-amber-300"
              pulse={incidentsLastMinute > 0}
            />
            <KpiCard
              label="SOS Activos"
              value={sosActive}
              delta={sosLastMinute}
              icon={<AlertOctagon className="w-5 h-5" />}
              accent="from-red-500/20 to-red-500/5 border-red-500/30"
              accentText="text-red-300"
              pulse={sosActive > 0 || sosLastMinute > 0}
            />
          </section>

          {/* Critical SOS banner */}
          {topSOS && (
            <div className="mb-6 rounded-2xl border border-red-500/50 bg-gradient-to-r from-red-600/30 via-red-500/20 to-red-600/30 p-4 sm:p-5 animate-pulse-slow shadow-lg shadow-red-900/30">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="relative flex h-3 w-3 mt-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold tracking-widest text-red-200">
                        SOS CRÍTICO
                      </span>
                      <span className="text-xs text-red-200/80">
                        · {formatRelative(topSOS.triggered_at)}
                      </span>
                      {activeSOS.length > 1 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-700/60 text-red-100 font-semibold">
                          +{activeSOS.length - 1} más
                        </span>
                      )}
                    </div>
                    <p className="text-white font-semibold text-base sm:text-lg leading-snug">
                      {topSOS.description ?? 'Alerta SOS activada'}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-red-100/90">
                      {topSOS.vehicle_plate && (
                        <span className="flex items-center gap-1">
                          <Bus className="w-3.5 h-3.5" /> {topSOS.vehicle_plate}
                        </span>
                      )}
                      {topSOS.lat != null && topSOS.lng != null && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {topSOS.lat.toFixed(4)}, {topSOS.lng.toFixed(4)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatHHMMSS(topSOS.triggered_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRespondSOS(topSOS.id)}
                  disabled={respondingId === topSOS.id}
                  className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-red-700 font-semibold text-sm hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {respondingId === topSOS.id ? 'Marcando...' : 'Marcar como respondido'}
                </button>
              </div>
            </div>
          )}

          {/* Two-column live feeds */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {/* LEFT: Activity Feed */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h2 className="font-semibold text-white">Actividad en vivo</h2>
                </div>
                <span className="text-xs text-slate-400">{events.length} eventos</span>
              </div>
              <div className="max-h-[640px] overflow-y-auto">
                {!hasAnyData && !loading && (
                  <EmptyState
                    title="Aún no hay actividad"
                    body="Compra un boleto desde /comprar para verlo aparecer aquí en tiempo real."
                  />
                )}
                {loading && events.length === 0 && (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    Conectando al stream en tiempo real...
                  </div>
                )}
                <ul className="divide-y divide-slate-800/70">
                  {events.map((evt) => (
                    <ActivityItem key={`${evt.kind}-${getEventId(evt)}`} evt={evt} />
                  ))}
                </ul>
              </div>
            </div>

            {/* RIGHT: Live Tables */}
            <div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 gap-2">
                <div className="flex items-center gap-1 bg-slate-950/60 rounded-xl p-1 border border-slate-800">
                  <TabButton active={tab === 'boletos'} onClick={() => setTab('boletos')}>
                    <Ticket className="w-3.5 h-3.5" />
                    Boletos
                  </TabButton>
                  <TabButton
                    active={tab === 'checkins'}
                    onClick={() => setTab('checkins')}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Check-ins
                  </TabButton>
                  <TabButton
                    active={tab === 'incidentes'}
                    onClick={() => setTab('incidentes')}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Incidentes
                  </TabButton>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  Stream activo
                </span>
              </div>
              <div className="max-h-[640px] overflow-y-auto">
                {tab === 'boletos' && (
                  <TicketsTable rows={tickets.data} loading={tickets.loading} />
                )}
                {tab === 'checkins' && (
                  <CheckInsTable rows={checkIns.data} loading={checkIns.loading} />
                )}
                {tab === 'incidentes' && (
                  <IncidentsTable rows={incidents.data} loading={incidents.loading} />
                )}
              </div>
            </div>
          </section>

          {/* Bottom panel: Stats + CTAs */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <TrendingUp className="w-4 h-4" />
                Totales del día
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Stat label="Boletos" value={ticketsToday} />
                <Stat label="Check-ins" value={checkInsToday} />
                <Stat label="Ingresos" value={formatCurrency(revenueToday)} />
                <Stat label="Incidentes" value={incidentsActive} />
              </div>
            </div>

            <CTACard
              href="/comprar"
              title="Comprar boleto"
              description="Genera un QR real y aparecerá aquí al instante."
              icon={<Ticket className="w-5 h-5" />}
              gradient="from-sky-600 via-sky-500 to-cyan-500"
            />
            <CTACard
              href="/escanear"
              title="Escanear con cámara"
              description="Usa tu celular para escanear boletos."
              icon={<UserCheck className="w-5 h-5" />}
              gradient="from-emerald-600 via-green-500 to-emerald-500"
            />
            <CTACard
              href="/reportar"
              title="Reportar / SOS"
              description="Reporta incidentes o activa una alerta de emergencia."
              icon={<AlertOctagon className="w-5 h-5" />}
              gradient="from-amber-600 via-orange-500 to-red-500"
            />
          </section>

          <p className="text-center text-xs text-slate-500">
            Última actualización: {new Date(now).toLocaleTimeString('es-PE', { hour12: false })}
            {' · '}
            Datos vía Supabase Realtime
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}

// ---------------- subcomponents ----------------

function KpiCard({
  label,
  value,
  delta,
  icon,
  accent,
  accentText,
  pulse,
}: {
  label: string
  value: number | string
  delta: number
  icon: React.ReactNode
  accent: string
  accentText: string
  pulse?: boolean
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 sm:p-5 transition-all',
        accent,
        pulse && 'ring-2 ring-emerald-500/40'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </span>
        <span className={cn('p-1.5 rounded-lg bg-slate-900/40', accentText)}>{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
          {value}
        </span>
        {delta > 0 && (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 animate-pulse',
              accentText
            )}
          >
            +{delta} en último minuto
          </span>
        )}
      </div>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
        active
          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
      )}
    >
      {children}
    </button>
  )
}

function getEventId(evt: {
  kind: string
  item: { id: string }
}): string {
  return evt.item.id
}

function ActivityItem({
  evt,
}: {
  evt:
    | { kind: 'ticket'; time: string; item: import('@/lib/supabase/client').DBTicket }
    | { kind: 'checkin'; time: string; item: import('@/lib/supabase/client').DBCheckIn }
    | { kind: 'incident'; time: string; item: import('@/lib/supabase/client').DBIncident }
    | { kind: 'sos'; time: string; item: import('@/lib/supabase/client').DBSOSAlert }
}) {
  const fresh = isWithinMs(evt.time, FRESH_WINDOW_MS)
  let dotColor = 'bg-slate-400'
  let icon: React.ReactNode = <Activity className="w-3.5 h-3.5" />
  let title = ''
  let detail = ''
  let pulse = false

  if (evt.kind === 'ticket') {
    dotColor = 'bg-sky-500'
    icon = <Ticket className="w-3.5 h-3.5" />
    title = `Boleto ${evt.item.direction === 'ida' ? 'IDA' : 'VUELTA'} - ${evt.item.passenger_name}`
    detail = `${evt.item.qr_code.slice(0, 14)}... · ${formatCurrency(Number(evt.item.fare))} · ${methodLabel(evt.item.payment_method)}`
  } else if (evt.kind === 'checkin') {
    dotColor = 'bg-emerald-500'
    icon = <UserCheck className="w-3.5 h-3.5" />
    title = `Check-in ${evt.item.passenger_name}`
    detail = `${evt.item.vehicle_plate} · ${methodLabel(evt.item.method)} · ${evt.item.terminal === 'vegueta' ? 'Vegueta' : 'Huacho'}`
  } else if (evt.kind === 'incident') {
    const sev = evt.item.severity
    dotColor =
      sev === 'critical' ? 'bg-red-500' : sev === 'high' ? 'bg-orange-500' : 'bg-amber-500'
    icon = <AlertTriangle className="w-3.5 h-3.5" />
    title = `Incidente ${evt.item.incident_number}: ${evt.item.title}`
    detail = `${evt.item.type} · ${evt.item.location} · ${evt.item.severity}`
  } else {
    dotColor = 'bg-red-500'
    icon = <AlertOctagon className="w-3.5 h-3.5" />
    pulse = evt.item.status === 'active'
    title = `SOS ${evt.item.status === 'active' ? '(activa)' : ''}`
    detail = `${evt.item.vehicle_plate ?? 'Sin vehículo'} · ${evt.item.description ?? 'Sin descripción'}`
  }

  return (
    <li
      className={cn(
        'flex items-start gap-3 px-5 py-3 transition-colors animate-slide-up',
        fresh && 'bg-emerald-500/10'
      )}
    >
      <div className="flex flex-col items-center pt-1">
        <span className={cn('relative flex h-2.5 w-2.5')}>
          {pulse && (
            <span
              className={cn(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                dotColor
              )}
            />
          )}
          <span
            className={cn('relative inline-flex rounded-full h-2.5 w-2.5', dotColor)}
          />
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mb-0.5">
          <span>{formatHHMMSS(evt.time)}</span>
          <span>·</span>
          <span className="text-slate-400">{formatRelative(evt.time)}</span>
          {fresh && (
            <span className="text-emerald-400 font-semibold uppercase tracking-wider">
              nuevo
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-sm text-white truncate">
          <span className="text-slate-400">{icon}</span>
          <span className="font-medium truncate">{title}</span>
        </div>
        <p className="text-xs text-slate-400 truncate">{detail}</p>
      </div>
    </li>
  )
}

function TicketsTable({
  rows,
  loading,
}: {
  rows: import('@/lib/supabase/client').DBTicket[]
  loading: boolean
}) {
  if (rows.length === 0) {
    return loading ? (
      <div className="p-8 text-center text-slate-500 text-sm">Cargando boletos...</div>
    ) : (
      <EmptyState
        title="No hay boletos aún"
        body="Cuando alguien compre desde /comprar, aparecerá aquí en vivo."
      />
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
            <th className="px-4 py-3 font-semibold">Hora</th>
            <th className="px-4 py-3 font-semibold">QR</th>
            <th className="px-4 py-3 font-semibold">Pasajero</th>
            <th className="px-4 py-3 font-semibold">Sentido</th>
            <th className="px-4 py-3 font-semibold text-right">Tarifa</th>
            <th className="px-4 py-3 font-semibold">Método</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/70">
          {rows.map((t) => {
            const fresh = isWithinMs(t.created_at, FRESH_WINDOW_MS)
            return (
              <tr
                key={t.id}
                className={cn(
                  'transition-colors animate-slide-up',
                  fresh ? 'bg-emerald-500/10' : 'hover:bg-slate-800/40'
                )}
              >
                <td className="px-4 py-3 text-xs font-mono text-slate-400 whitespace-nowrap">
                  {formatHHMMSS(t.created_at)}
                </td>
                <td className="px-4 py-3 text-xs font-mono text-sky-300">
                  {t.qr_code.slice(0, 12)}...
                </td>
                <td className="px-4 py-3 text-white truncate max-w-[160px]">
                  {t.passenger_name}
                </td>
                <td className="px-4 py-3 text-slate-300">
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider',
                      t.direction === 'ida'
                        ? 'bg-sky-500/20 text-sky-300'
                        : 'bg-purple-500/20 text-purple-300'
                    )}
                  >
                    {t.direction}
                  </span>
                </td>
                <td className="px-4 py-3 text-white text-right font-semibold tabular-nums">
                  {formatCurrency(Number(t.fare))}
                </td>
                <td className="px-4 py-3 text-slate-300">{methodLabel(t.payment_method)}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border',
                      statusClasses(t.status)
                    )}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function CheckInsTable({
  rows,
  loading,
}: {
  rows: import('@/lib/supabase/client').DBCheckIn[]
  loading: boolean
}) {
  if (rows.length === 0) {
    return loading ? (
      <div className="p-8 text-center text-slate-500 text-sm">Cargando check-ins...</div>
    ) : (
      <EmptyState
        title="No hay check-ins aún"
        body="Cuando un pasajero escanee su QR, aparecerá aquí en vivo."
      />
    )
  }
  const methodIcon = (m: string) => {
    switch (m) {
      case 'facial_recognition':
        return <ScanFace className="w-3.5 h-3.5" />
      case 'qr_code':
        return <ScanLine className="w-3.5 h-3.5" />
      case 'dni_scan':
        return <IdCard className="w-3.5 h-3.5" />
      default:
        return <Users className="w-3.5 h-3.5" />
    }
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
            <th className="px-4 py-3 font-semibold">Hora</th>
            <th className="px-4 py-3 font-semibold">Pasajero</th>
            <th className="px-4 py-3 font-semibold">Vehículo</th>
            <th className="px-4 py-3 font-semibold">Método</th>
            <th className="px-4 py-3 font-semibold">Terminal</th>
            <th className="px-4 py-3 font-semibold text-center">Verif.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/70">
          {rows.map((c) => {
            const fresh = isWithinMs(c.check_in_time, FRESH_WINDOW_MS)
            return (
              <tr
                key={c.id}
                className={cn(
                  'transition-colors animate-slide-up',
                  fresh ? 'bg-emerald-500/10' : 'hover:bg-slate-800/40'
                )}
              >
                <td className="px-4 py-3 text-xs font-mono text-slate-400 whitespace-nowrap">
                  {formatHHMMSS(c.check_in_time)}
                </td>
                <td className="px-4 py-3 text-white truncate max-w-[180px]">
                  {c.passenger_name}
                </td>
                <td className="px-4 py-3 text-slate-300 font-mono">{c.vehicle_plate}</td>
                <td className="px-4 py-3 text-slate-300">
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <span className="text-emerald-400">{methodIcon(c.method)}</span>
                    {methodLabel(c.method)}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300 capitalize">{c.terminal}</td>
                <td className="px-4 py-3 text-center">
                  {c.identity_verified ? (
                    <CheckCircle2 className="inline w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="text-slate-500 text-xs">—</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function IncidentsTable({
  rows,
  loading,
}: {
  rows: import('@/lib/supabase/client').DBIncident[]
  loading: boolean
}) {
  if (rows.length === 0) {
    return loading ? (
      <div className="p-8 text-center text-slate-500 text-sm">Cargando incidentes...</div>
    ) : (
      <EmptyState
        title="Sin incidentes recientes"
        body="Buenas noticias - no se han reportado incidentes."
      />
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
            <th className="px-4 py-3 font-semibold">ID</th>
            <th className="px-4 py-3 font-semibold">Tipo</th>
            <th className="px-4 py-3 font-semibold">Severidad</th>
            <th className="px-4 py-3 font-semibold">Título</th>
            <th className="px-4 py-3 font-semibold">Ubicación</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/70">
          {rows.map((i) => {
            const fresh = isWithinMs(i.created_at, FRESH_WINDOW_MS)
            return (
              <tr
                key={i.id}
                className={cn(
                  'transition-colors animate-slide-up',
                  fresh ? 'bg-emerald-500/10' : 'hover:bg-slate-800/40'
                )}
              >
                <td className="px-4 py-3 text-xs font-mono text-amber-300 whitespace-nowrap">
                  {i.incident_number}
                </td>
                <td className="px-4 py-3 text-slate-300 capitalize">
                  {i.type.replace(/_/g, ' ')}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border',
                      severityClasses(i.severity)
                    )}
                  >
                    <ShieldAlert className="w-3 h-3 mr-1" />
                    {i.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-white truncate max-w-[200px]">{i.title}</td>
                <td className="px-4 py-3 text-slate-300 truncate max-w-[160px]">
                  {i.location}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border',
                      statusClasses(i.status)
                    )}
                  >
                    {i.status}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-10 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-slate-400 mb-3">
        <Activity className="w-5 h-5" />
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-slate-400 text-sm max-w-xs mx-auto">{body}</p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-xs text-slate-400 mb-1">{label}</div>
      <div className="text-xl font-bold text-white tabular-nums">{value}</div>
    </div>
  )
}

function CTACard({
  href,
  title,
  description,
  icon,
  gradient,
}: {
  href: string
  title: string
  description: string
  icon: React.ReactNode
  gradient: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br border border-white/10 transition-transform hover:-translate-y-0.5',
        gradient
      )}
    >
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 mb-3">
            {icon}
          </div>
          <h3 className="font-bold text-lg mb-1">{title}</h3>
          <p className="text-sm text-white/85">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 mt-1 opacity-70 group-hover:translate-x-1 transition" />
      </div>
    </Link>
  )
}
