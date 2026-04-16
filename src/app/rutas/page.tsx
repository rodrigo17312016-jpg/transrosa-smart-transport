'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MapPin, Clock, Route, ArrowRight, ArrowDown, ChevronRight,
  Download, Bus, Users, Ruler, Timer, DollarSign, Navigation,
  Shield, CheckCircle2, Info, Milestone, CircleDot
} from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { ROUTE_INFO } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

export default function RutasPage() {
  const [activeTab, setActiveTab] = useState<'ida' | 'vuelta'>('ida')

  const fares = [
    { type: 'Regular', price: ROUTE_INFO.fare.regular, icon: Users, description: 'Pasajero adulto', color: 'primary' },
    { type: 'Estudiante', price: ROUTE_INFO.fare.student, icon: Users, description: 'Con carné vigente', color: 'blue' },
    { type: 'Adulto Mayor', price: ROUTE_INFO.fare.senior, icon: Users, description: '60 años a más', color: 'emerald' },
    { type: 'Niño', price: ROUTE_INFO.fare.child, icon: Users, description: 'Menores de 12 años', color: 'amber' },
  ]

  const routeStats = [
    { icon: Ruler, label: 'Distancia Ida', value: `${ROUTE_INFO.distances.ida} km` },
    { icon: Ruler, label: 'Distancia Vuelta', value: `${ROUTE_INFO.distances.vuelta} km` },
    { icon: Route, label: 'Distancia Total', value: `${ROUTE_INFO.distances.total} km` },
    { icon: Timer, label: 'Duración Estimada', value: `~${ROUTE_INFO.schedule.estimatedDuration} min` },
    { icon: Milestone, label: 'Paradas Ida', value: `${ROUTE_INFO.itinerary.ida.length} paradas` },
    { icon: Milestone, label: 'Paradas Vuelta', value: `${ROUTE_INFO.itinerary.vuelta.length} paradas` },
  ]

  const currentItinerary = activeTab === 'ida' ? ROUTE_INFO.itinerary.ida : ROUTE_INFO.itinerary.vuelta

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative gradient-hero overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1440 400">
            <path
              d="M-100,200 C200,150 400,250 600,180 S900,100 1100,200 S1400,150 1600,200"
              stroke="url(#heroRouteGrad)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10,10"
            >
              <animate attributeName="stroke-dashoffset" values="0;-20" dur="1s" repeatCount="indefinite" />
            </path>
            <defs>
              <linearGradient id="heroRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-3xl animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-6">
              <Route className="w-4 h-4 text-accent-400" />
              <span className="text-sm text-white/80 font-medium">Ruta Interurbana {ROUTE_INFO.code}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight font-[family-name:var(--font-poppins)]">
              Nuestra Ruta{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                RI-06
              </span>
            </h1>
            <p className="mt-6 text-lg text-white/60 max-w-xl leading-relaxed">
              Conectamos <strong className="text-white/90">Vegueta</strong> y{' '}
              <strong className="text-white/90">Huacho</strong> a lo largo de{' '}
              {ROUTE_INFO.distances.total} km con {ROUTE_INFO.itinerary.ida.length} paradas
              estrategicas para tu comodidad.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/boletos" className="btn-primary">
                Comprar Boleto <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#itinerario" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10">
                <ArrowDown className="w-4 h-4" />
                Ver Itinerario
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ROUTE STATS ==================== */}
      <section className="relative -mt-12 z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {routeStats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="stat-card">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary-600" />
              </div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== ORIGIN/DESTINATION ==================== */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <CircleDot className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Origen</p>
                <h3 className="text-xl font-bold text-gray-900">{ROUTE_INFO.origin.name}</h3>
              </div>
            </div>
            <p className="text-sm text-gray-600">{ROUTE_INFO.origin.address}</p>
            <p className="text-sm text-gray-500">{ROUTE_INFO.origin.zone}, {ROUTE_INFO.origin.district}</p>
          </div>
          <div className="card border-l-4 border-l-primary-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Destino</p>
                <h3 className="text-xl font-bold text-gray-900">{ROUTE_INFO.destination.name}</h3>
              </div>
            </div>
            <p className="text-sm text-gray-600">{ROUTE_INFO.destination.address}</p>
            <p className="text-sm text-gray-500">{ROUTE_INFO.destination.zone}, {ROUTE_INFO.destination.district}</p>
          </div>
        </div>
      </section>

      {/* ==================== MAP PLACEHOLDER ==================== */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="card p-0 overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Mapa de Ruta</h3>
                <p className="text-xs text-gray-500">Visualizacion interactiva del recorrido</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge bg-emerald-100 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse inline-block" />
                En vivo
              </span>
            </div>
          </div>
          <div
            id="route-map"
            className="w-full h-[450px] bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center">
              <Navigation className="w-8 h-8 text-gray-400 animate-pulse" />
            </div>
            <p className="text-gray-500 font-medium">Mapa interactivo cargando...</p>
            <p className="text-sm text-gray-400">Ruta {ROUTE_INFO.code}: {ROUTE_INFO.origin.name} - {ROUTE_INFO.destination.name}</p>
          </div>
        </div>
      </section>

      {/* ==================== ITINERARY ==================== */}
      <section id="itinerario" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-6">
              <Milestone className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">Itinerario Completo</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-[family-name:var(--font-poppins)]">
              Recorrido <span className="text-gradient">Detallado</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Conoce cada parada de nuestro recorrido en ambas direcciones.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
              <button
                onClick={() => setActiveTab('ida')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'ida'
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Ida: Vegueta → Huacho
                </span>
              </button>
              <button
                onClick={() => setActiveTab('vuelta')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'vuelta'
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Vuelta: Huacho → Vegueta
                </span>
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-primary-500 to-primary-700" />

              <div className="space-y-0">
                {currentItinerary.map((stop, i) => {
                  const isFirst = i === 0
                  const isLast = i === currentItinerary.length - 1
                  return (
                    <div key={`${activeTab}-${i}`} className="flex items-center gap-5 pl-0 py-2.5 group">
                      {/* Node */}
                      <div className="relative z-10 shrink-0">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isFirst
                              ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                              : isLast
                              ? 'bg-primary-600 shadow-lg shadow-primary-600/30'
                              : 'bg-white border-2 border-gray-300 group-hover:border-primary-400 group-hover:shadow-md'
                          }`}
                        >
                          {isFirst ? (
                            <CircleDot className="w-5 h-5 text-white" />
                          ) : isLast ? (
                            <MapPin className="w-5 h-5 text-white" />
                          ) : (
                            <span className="text-xs font-bold text-gray-400 group-hover:text-primary-600 transition-colors">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div
                        className={`flex-1 py-3 px-5 rounded-xl transition-all duration-200 ${
                          isFirst
                            ? 'bg-emerald-50 border border-emerald-200'
                            : isLast
                            ? 'bg-primary-50 border border-primary-200'
                            : 'bg-white border border-gray-100 group-hover:border-primary-200 group-hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p
                              className={`font-semibold ${
                                isFirst
                                  ? 'text-emerald-800'
                                  : isLast
                                  ? 'text-primary-800'
                                  : 'text-gray-800'
                              }`}
                            >
                              {stop}
                            </p>
                            {isFirst && (
                              <p className="text-xs text-emerald-600 mt-0.5 font-medium">Punto de partida</p>
                            )}
                            {isLast && (
                              <p className="text-xs text-primary-600 mt-0.5 font-medium">Punto de llegada</p>
                            )}
                          </div>
                          {(isFirst || isLast) && (
                            <span
                              className={`badge ${
                                isFirst ? 'bg-emerald-100 text-emerald-700' : 'bg-primary-100 text-primary-700'
                              }`}
                            >
                              {isFirst ? 'Inicio' : 'Fin'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="mt-8 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Milestone className="w-4 h-4 text-primary-500" />
                <span className="font-semibold">{currentItinerary.length}</span> paradas
              </div>
              <div className="w-px h-5 bg-gray-200" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Ruler className="w-4 h-4 text-primary-500" />
                <span className="font-semibold">
                  {activeTab === 'ida' ? ROUTE_INFO.distances.ida : ROUTE_INFO.distances.vuelta}
                </span> km
              </div>
              <div className="w-px h-5 bg-gray-200" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Timer className="w-4 h-4 text-primary-500" />
                ~<span className="font-semibold">{ROUTE_INFO.schedule.estimatedDuration}</span> minutos
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FARE TABLE ==================== */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 rounded-full mb-6">
              <DollarSign className="w-4 h-4 text-accent-600" />
              <span className="text-sm font-semibold text-accent-700">Tarifas</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-[family-name:var(--font-poppins)]">
              Tabla de <span className="text-gradient">Tarifas</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Tarifas accesibles y transparentes para todos nuestros pasajeros.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fares.map(({ type, price, description, color }) => (
              <div
                key={type}
                className={`card text-center hover:-translate-y-1 ${
                  color === 'primary' ? 'ring-2 ring-primary-200 shadow-lg' : ''
                }`}
              >
                {color === 'primary' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge bg-primary-600 text-white">Popular</span>
                  </div>
                )}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    backgroundColor:
                      color === 'primary' ? '#fee2e2' :
                      color === 'blue' ? '#dbeafe' :
                      color === 'emerald' ? '#d1fae5' :
                      '#fef3c7',
                  }}
                >
                  <Users
                    className="w-7 h-7"
                    style={{
                      color:
                        color === 'primary' ? '#dc2626' :
                        color === 'blue' ? '#2563eb' :
                        color === 'emerald' ? '#059669' :
                        '#d97706',
                    }}
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{type}</h3>
                <p className="text-sm text-gray-500 mb-4">{description}</p>
                <p className="text-3xl font-black text-primary-600">{formatCurrency(price)}</p>
                <p className="text-xs text-gray-400 mt-1">por viaje</p>
              </div>
            ))}
          </div>

          {/* Fare notes */}
          <div className="mt-10 card bg-blue-50 border-blue-200">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Informacion importante sobre tarifas</p>
                <ul className="space-y-1 text-blue-700">
                  <li>- Tarifa estudiante requiere presentar carne universitario o escolar vigente.</li>
                  <li>- Tarifa adulto mayor aplica para personas de 60 anos a mas con DNI.</li>
                  <li>- Ninos menores de 5 anos viajan gratis en brazos de un adulto.</li>
                  <li>- Las tarifas estan sujetas a la regulacion de la Municipalidad Provincial de Huaura.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== DOWNLOAD / CTA ==================== */}
      <section className="py-20 bg-secondary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-black font-[family-name:var(--font-poppins)]">
            Lleva la informacion de la ruta <span className="text-accent-400">contigo</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Descarga el itinerario completo con todas las paradas, horarios y tarifas
            para consultarlo sin conexion.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100 shadow-xl px-8 py-4">
              <Download className="w-5 h-5" />
              Descargar Info de Ruta
            </button>
            <Link
              href="/horarios"
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all"
            >
              <Clock className="w-5 h-5" />
              Ver Horarios
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
            {[
              { icon: Shield, text: 'Ruta autorizada' },
              { icon: Bus, text: `${ROUTE_INFO.fleet.totalVehicles}+ unidades` },
              { icon: Clock, text: 'Cada 10 min' },
              { icon: CheckCircle2, text: 'SOAT vigente' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-accent-400" />
                </div>
                <span className="text-sm text-white/60 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
