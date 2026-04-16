'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Clock, ArrowRight, Bus, Timer, Calendar, Sun, Sunrise,
  Sunset, Moon, AlertCircle, Info, ChevronRight, Route,
  CheckCircle2, ArrowDown
} from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { ROUTE_INFO } from '@/lib/constants'

function generateSchedule(): string[] {
  const times: string[] = []
  const startHour = 5
  const endHour = 21
  const frequency = ROUTE_INFO.schedule.frequency

  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += frequency) {
      if (h === endHour && m > 0) break
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      times.push(`${hh}:${mm}`)
    }
  }
  return times
}

function getCurrentTimeString(): string {
  const now = new Date()
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function getTimeOfDay(t: string): 'morning' | 'midday' | 'afternoon' | 'evening' {
  const h = parseInt(t.split(':')[0])
  if (h < 9) return 'morning'
  if (h < 13) return 'midday'
  if (h < 18) return 'afternoon'
  return 'evening'
}

export default function HorariosPage() {
  const schedule = useMemo(() => generateSchedule(), [])
  const [currentTime, setCurrentTime] = useState(getCurrentTimeString())
  const [filter, setFilter] = useState<'all' | 'morning' | 'midday' | 'afternoon' | 'evening'>('all')

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeString())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const currentMinutes = timeToMinutes(currentTime)

  const nextDepartureIndex = schedule.findIndex(
    (t) => timeToMinutes(t) >= currentMinutes
  )

  const filteredSchedule = filter === 'all'
    ? schedule
    : schedule.filter((t) => getTimeOfDay(t) === filter)

  const infoCards = [
    { icon: Timer, label: 'Frecuencia', value: `Cada ${ROUTE_INFO.schedule.frequency} min`, color: 'primary' },
    { icon: Sunrise, label: 'Primera Salida', value: '5:00 AM', color: 'emerald' },
    { icon: Sunset, label: 'Ultima Salida', value: '9:00 PM', color: 'amber' },
    { icon: Clock, label: 'Duracion del Viaje', value: `~${ROUTE_INFO.schedule.estimatedDuration} min`, color: 'blue' },
  ]

  const timeFilters = [
    { id: 'all' as const, label: 'Todos', icon: Clock },
    { id: 'morning' as const, label: 'Manana (5-9)', icon: Sunrise },
    { id: 'midday' as const, label: 'Mediodia (9-13)', icon: Sun },
    { id: 'afternoon' as const, label: 'Tarde (13-18)', icon: Sunset },
    { id: 'evening' as const, label: 'Noche (18-21)', icon: Moon },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative gradient-hero overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-3xl animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-6">
              <Clock className="w-4 h-4 text-accent-400" />
              <span className="text-sm text-white/80 font-medium">Horarios Actualizados</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight font-[family-name:var(--font-poppins)]">
              Horarios de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                Servicio
              </span>
            </h1>
            <p className="mt-6 text-lg text-white/60 max-w-xl leading-relaxed">
              Salidas cada <strong className="text-white/90">{ROUTE_INFO.schedule.frequency} minutos</strong> desde
              las <strong className="text-white/90">5:00 AM</strong> hasta
              las <strong className="text-white/90">9:00 PM</strong>. Planifica tu viaje con facilidad.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/boletos" className="btn-primary">
                Comprar Boleto <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#horarios" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10">
                <ArrowDown className="w-4 h-4" />
                Ver Horarios
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== INFO CARDS ==================== */}
      <section className="relative -mt-12 z-10 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {infoCards.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="stat-card">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{
                  backgroundColor:
                    color === 'primary' ? '#fee2e2' :
                    color === 'emerald' ? '#d1fae5' :
                    color === 'amber' ? '#fef3c7' :
                    '#dbeafe',
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{
                    color:
                      color === 'primary' ? '#dc2626' :
                      color === 'emerald' ? '#059669' :
                      color === 'amber' ? '#d97706' :
                      '#2563eb',
                  }}
                />
              </div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== NEXT DEPARTURE HIGHLIGHT ==================== */}
      <section className="py-16 max-w-5xl mx-auto px-6">
        <div className="card bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/25">
                <Bus className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Proxima Salida</p>
                <p className="text-3xl font-black text-gray-900">
                  {nextDepartureIndex >= 0 ? schedule[nextDepartureIndex] : 'Servicio cerrado'}
                </p>
                <p className="text-sm text-gray-500">Desde ambos terminales</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center px-5 py-3 bg-white rounded-xl shadow-sm">
                <p className="text-xs text-gray-500">Hora actual</p>
                <p className="text-xl font-bold text-gray-900">{currentTime}</p>
              </div>
              <Link href="/boletos" className="btn-primary">
                Reservar Ahora
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SCHEDULE TABLE ==================== */}
      <section id="horarios" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 font-[family-name:var(--font-poppins)]">
              Tabla de <span className="text-gradient">Horarios</span>
            </h2>
            <p className="mt-3 text-gray-500">
              Todas las salidas programadas para la ruta {ROUTE_INFO.code}
            </p>
          </div>

          {/* Time Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {timeFilters.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filter === id
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Two-column schedule */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Vegueta departures */}
            <div className="card p-0 overflow-hidden">
              <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <Bus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Salidas desde Vegueta</h3>
                    <p className="text-xs text-gray-500">{ROUTE_INFO.origin.address}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 max-h-[500px] overflow-y-auto">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {filteredSchedule.map((time, i) => {
                    const realIndex = schedule.indexOf(time)
                    const isCurrent = realIndex === nextDepartureIndex
                    const isPast = timeToMinutes(time) < currentMinutes

                    return (
                      <div
                        key={`v-${time}`}
                        className={`relative text-center py-2.5 px-1 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isCurrent
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 ring-2 ring-primary-300 scale-105'
                            : isPast
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-600'
                        }`}
                      >
                        {time}
                        {isCurrent && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full animate-pulse" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Huacho departures */}
            <div className="card p-0 overflow-hidden">
              <div className="px-6 py-4 bg-primary-50 border-b border-primary-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                    <Bus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Salidas desde Huacho</h3>
                    <p className="text-xs text-gray-500">{ROUTE_INFO.destination.address}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 max-h-[500px] overflow-y-auto">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {filteredSchedule.map((time, i) => {
                    const realIndex = schedule.indexOf(time)
                    const isCurrent = realIndex === nextDepartureIndex
                    const isPast = timeToMinutes(time) < currentMinutes

                    return (
                      <div
                        key={`h-${time}`}
                        className={`relative text-center py-2.5 px-1 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isCurrent
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 ring-2 ring-primary-300 scale-105'
                            : isPast
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-600'
                        }`}
                      >
                        {time}
                        {isCurrent && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full animate-pulse" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary-600" />
              <span>Proxima salida</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
              <span>Ya partio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-white border border-gray-200" />
              <span>Disponible</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WEEKEND/HOLIDAY NOTE ==================== */}
      <section className="py-16 max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card bg-amber-50 border-amber-200">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Fines de Semana</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Los sabados y domingos el servicio opera con el mismo horario de{' '}
                  <strong>5:00 AM a 9:00 PM</strong>, con salidas cada{' '}
                  <strong>{ROUTE_INFO.schedule.frequency} minutos</strong>.
                  La frecuencia puede variar en funcion de la demanda.
                </p>
              </div>
            </div>
          </div>
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Feriados y Dias Especiales</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  En feriados nacionales y eventos especiales, los horarios pueden modificarse.
                  Consulta nuestras redes sociales o llama al{' '}
                  <strong>+51 993 370 254</strong> para confirmar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-8 card">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-semibold text-gray-900 mb-2">Informacion adicional</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Las salidas son simultaneas desde ambos terminales (Vegueta y Huacho).
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  El tiempo de viaje estimado es de aproximadamente {ROUTE_INFO.schedule.estimatedDuration} minutos, dependiendo del trafico.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Puedes abordar en cualquier paradero autorizado a lo largo de la ruta.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Nuestras unidades tienen capacidad para {ROUTE_INFO.fleet.passengerCapacity} pasajeros sentados.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-20 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '30px 30px',
        }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-white font-[family-name:var(--font-poppins)]">
            Ya conoces los horarios,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
              reserva tu asiento
            </span>
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Compra tu boleto digital ahora y viaja sin preocupaciones. Paga con Yape, Plin o tarjeta.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/boletos" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 shadow-xl px-8 py-4">
              Comprar Boleto Digital
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/rutas"
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all"
            >
              <Route className="w-5 h-5" />
              Ver Ruta Completa
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
