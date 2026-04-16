'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Bus, MapPin, Clock, Users, Shield, Smartphone, Zap, Star,
  ChevronRight, ArrowRight, Navigation, Wifi, CreditCard,
  BarChart3, Route, Phone, CheckCircle2, Play, Sparkles,
  Globe, Brain, QrCode, Bell, TrendingUp, Eye
} from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { APP_CONFIG, ROUTE_INFO } from '@/lib/constants'
import { cn } from '@/lib/utils'

// --- Animated Counter Component ---
function Counter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    const el = document.getElementById(`counter-${end}`)
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [end])

  useEffect(() => {
    if (!started) return
    let current = 0
    const increment = end / 60
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 20)
    return () => clearInterval(timer)
  }, [started, end])

  return (
    <span id={`counter-${end}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[90vh] gradient-hero overflow-hidden flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
          {/* Animated route line */}
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1440 800">
            <path
              d="M-100,400 C200,300 400,500 600,350 S900,200 1100,400 S1400,300 1600,400"
              stroke="url(#routeGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10,10"
            >
              <animate attributeName="stroke-dashoffset" values="0;-20" dur="1s" repeatCount="indefinite" />
            </path>
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-8">
                <Sparkles className="w-4 h-4 text-accent-400" />
                <span className="text-sm text-white/80 font-medium">Plataforma Inteligente de Transporte</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight font-[family-name:var(--font-poppins)]">
                Viaja
                <span className="relative inline-block mx-3">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                    Seguro
                  </span>
                  <span className="absolute bottom-2 left-0 right-0 h-3 bg-primary-600/30 -rotate-1 rounded" />
                </span>
                <br />
                Viaja
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-primary-400 ml-3">
                  Inteligente
                </span>
              </h1>

              <p className="mt-6 text-lg text-white/60 max-w-xl leading-relaxed">
                Conectamos <strong className="text-white/90">Vegueta</strong> y{' '}
                <strong className="text-white/90">Huacho</strong> con tecnología de última generación.
                GPS en tiempo real, boletos digitales con QR, predicción de demanda con IA y mucho más.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/boletos" className="btn-primary text-base px-8 py-4">
                  <QrCode className="w-5 h-5" />
                  Comprar Boleto
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/rutas" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10">
                  <Route className="w-5 h-5" />
                  Ver Ruta en Vivo
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-12 flex flex-wrap items-center gap-6">
                {[
                  { icon: Shield, text: 'SOAT al día' },
                  { icon: Navigation, text: 'GPS en vivo' },
                  { icon: Clock, text: 'Cada 10 min' },
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

            {/* Right: Visual / Stats Card */}
            <div className="relative hidden lg:block animate-fade-in">
              {/* Main floating card */}
              <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                {/* Map preview */}
                <div className="bg-secondary-800/80 rounded-2xl p-6 mb-6 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-sm text-white/80 font-medium">En vivo ahora</span>
                    </div>
                    <span className="text-xs text-white/40">12 unidades activas</span>
                  </div>
                  {/* Simulated route visualization */}
                  <div className="relative h-40">
                    <svg className="w-full h-full" viewBox="0 0 400 160">
                      {/* Route path */}
                      <path
                        d="M30,130 C80,130 100,80 150,70 S220,30 270,50 S340,80 370,40"
                        stroke="#DC2626"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                      />
                      {/* Stops */}
                      {[
                        { x: 30, y: 130, label: 'Vegueta' },
                        { x: 150, y: 70, label: 'Bellavista' },
                        { x: 270, y: 50, label: 'Puente' },
                        { x: 370, y: 40, label: 'Huacho' },
                      ].map((stop, i) => (
                        <g key={i}>
                          <circle cx={stop.x} cy={stop.y} r="6" fill="#DC2626" />
                          <circle cx={stop.x} cy={stop.y} r="3" fill="white" />
                          <text x={stop.x} y={stop.y + 20} textAnchor="middle" className="fill-white/60 text-[10px]">
                            {stop.label}
                          </text>
                        </g>
                      ))}
                      {/* Moving vehicle */}
                      <circle r="5" fill="#F59E0B">
                        <animateMotion
                          path="M30,130 C80,130 100,80 150,70 S220,30 270,50 S340,80 370,40"
                          dur="4s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </svg>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: '45', unit: 'min', label: 'Duración' },
                    { value: '21.6', unit: 'km', label: 'Distancia' },
                    { value: 'S/3.50', unit: '', label: 'Pasaje' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {stat.value}<span className="text-sm text-white/40 ml-0.5">{stat.unit}</span>
                      </p>
                      <p className="text-xs text-white/40 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating notification cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-float z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Llegada puntual</p>
                    <p className="text-xs text-gray-500">Unidad #23 - Hace 2 min</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float z-20" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">+1,200 pasajeros</p>
                    <p className="text-xs text-gray-500">Transportados hoy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-white/30">Descubre más</span>
          <ChevronRight className="w-4 h-4 text-white/30 rotate-90" />
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="relative -mt-16 z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Bus, value: 50, suffix: '+', label: 'Unidades', color: 'primary' },
            { icon: Users, value: 1200, suffix: '+', label: 'Pasajeros/día', color: 'blue' },
            { icon: Route, value: 180, suffix: '+', label: 'Viajes/día', color: 'emerald' },
            { icon: Star, value: 4.8, suffix: '/5', label: 'Satisfacción', color: 'amber' },
          ].map(({ icon: Icon, value, suffix, label, color }) => (
            <div key={label} className="stat-card">
              <div className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center mb-4',
                color === 'primary' && 'bg-primary-100',
                color === 'blue' && 'bg-blue-100',
                color === 'emerald' && 'bg-emerald-100',
                color === 'amber' && 'bg-amber-100',
              )}>
                <Icon className={cn(
                  'w-6 h-6',
                  color === 'primary' && 'text-primary-600',
                  color === 'blue' && 'text-blue-600',
                  color === 'emerald' && 'text-emerald-600',
                  color === 'amber' && 'text-amber-600',
                )} />
              </div>
              <p className="text-3xl lg:text-4xl font-black text-gray-900 font-[family-name:var(--font-poppins)]">
                <Counter end={value} suffix={suffix} />
              </p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
              <div className={cn(
                'absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity',
                color === 'primary' && 'bg-primary-500',
                color === 'blue' && 'bg-blue-500',
                color === 'emerald' && 'bg-emerald-500',
                color === 'amber' && 'bg-amber-500',
              )} />
            </div>
          ))}
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-6">
              <Zap className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">Tecnología de Punta</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-[family-name:var(--font-poppins)]">
              El Futuro del Transporte
              <br />
              <span className="text-gradient">ya llegó a Huacho</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Implementamos las mismas tecnologías que usan las empresas de transporte europeas,
              adaptadas a la realidad peruana.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Navigation,
                title: 'GPS en Tiempo Real',
                description: 'Rastrea tu minivan en vivo desde tu celular. Sabe exactamente cuándo llega tu unidad al paradero.',
                tag: 'Tracking',
                color: 'blue',
              },
              {
                icon: QrCode,
                title: 'Boletos Digitales QR',
                description: 'Compra tu boleto online y viaja con tu código QR. Sin colas, sin efectivo, sin complicaciones.',
                tag: 'Digital',
                color: 'primary',
              },
              {
                icon: Brain,
                title: 'IA Predictiva',
                description: 'Predicción de demanda con inteligencia artificial para optimizar la frecuencia de salidas.',
                tag: 'AI-Powered',
                color: 'purple',
              },
              {
                icon: CreditCard,
                title: 'Pago Digital',
                description: 'Paga con Yape, Plin, tarjeta o transferencia. Múltiples opciones de pago seguro.',
                tag: 'Pagos',
                color: 'emerald',
              },
              {
                icon: BarChart3,
                title: 'Dashboard Analytics',
                description: 'Panel de control con métricas en tiempo real, reportes financieros y análisis de rendimiento.',
                tag: 'Analytics',
                color: 'amber',
              },
              {
                icon: Bell,
                title: 'Alertas Inteligentes',
                description: 'Notificaciones automáticas de SOAT, revisión técnica, mantenimiento y más.',
                tag: 'Smart',
                color: 'rose',
              },
              {
                icon: Shield,
                title: 'Seguridad Total',
                description: 'SOAT vigente, revisión técnica al día, conductores certificados y monitoreo 24/7.',
                tag: 'Seguridad',
                color: 'cyan',
              },
              {
                icon: Smartphone,
                title: 'App PWA',
                description: 'Aplicación web progresiva. Instálala en tu celular sin necesidad de App Store.',
                tag: 'Mobile',
                color: 'indigo',
              },
              {
                icon: Globe,
                title: 'Plataforma Web',
                description: 'Consulta rutas, horarios y compra boletos desde cualquier dispositivo con internet.',
                tag: 'Web',
                color: 'teal',
              },
            ].map(({ icon: Icon, title, description, tag, color }) => (
              <div key={title} className="card group hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center',
                    `bg-${color}-100`
                  )} style={{
                    backgroundColor: color === 'primary' ? '#fee2e2' :
                      color === 'blue' ? '#dbeafe' :
                      color === 'purple' ? '#f3e8ff' :
                      color === 'emerald' ? '#d1fae5' :
                      color === 'amber' ? '#fef3c7' :
                      color === 'rose' ? '#ffe4e6' :
                      color === 'cyan' ? '#cffafe' :
                      color === 'indigo' ? '#e0e7ff' :
                      '#ccfbf1'
                  }}>
                    <Icon className="w-7 h-7" style={{
                      color: color === 'primary' ? '#dc2626' :
                        color === 'blue' ? '#2563eb' :
                        color === 'purple' ? '#9333ea' :
                        color === 'emerald' ? '#059669' :
                        color === 'amber' ? '#d97706' :
                        color === 'rose' ? '#e11d48' :
                        color === 'cyan' ? '#0891b2' :
                        color === 'indigo' ? '#4f46e5' :
                        '#0d9488'
                    }} />
                  </div>
                  <span className="badge bg-gray-100 text-gray-600">{tag}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ROUTE SECTION ==================== */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Nuestra Ruta</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-[family-name:var(--font-poppins)] leading-tight">
                Ruta Interurbana
                <br />
                <span className="text-primary-600">RI-06</span>
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Conectamos Vegueta y Huacho por la Carretera Panamericana Norte,
                con paradas estratégicas para tu comodidad.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { label: 'Origen', value: 'Av. 200 Millas - Vegueta', icon: '🟢' },
                  { label: 'Destino', value: 'Av. Luna Arrieta / Ca. Miguel Grau - Huacho', icon: '🔴' },
                  { label: 'Distancia', value: '43.15 km (ida y vuelta)', icon: '📏' },
                  { label: 'Duración', value: '~45 minutos por tramo', icon: '⏱️' },
                  { label: 'Frecuencia', value: 'Cada 10 minutos', icon: '🔄' },
                  { label: 'Horario', value: '5:00 AM - 9:00 PM', icon: '🕐' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{label}</p>
                      <p className="text-sm text-gray-500">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/rutas" className="btn-primary mt-8">
                Ver Ruta Completa
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Route visualization */}
            <div className="relative">
              <div className="bg-gradient-to-br from-secondary-50 to-primary-50 rounded-3xl p-8 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Itinerario de Ida</h3>
                <div className="relative">
                  {/* Timeline */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-primary-500 to-primary-700" />
                  <div className="space-y-3">
                    {ROUTE_INFO.itinerary.ida.slice(0, 12).map((stop, i) => (
                      <div key={i} className="flex items-center gap-4 pl-1">
                        <div className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center z-10 shrink-0',
                          i === 0 ? 'bg-emerald-500' :
                          i === ROUTE_INFO.itinerary.ida.slice(0, 12).length - 1 ? 'bg-primary-600' :
                          'bg-white border-2 border-gray-300'
                        )}>
                          {(i === 0 || i === 11) && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className={cn(
                          'text-sm',
                          (i === 0 || i === 11) ? 'font-bold text-gray-900' : 'text-gray-600'
                        )}>
                          {stop}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-4 pl-1">
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center z-10 shrink-0">
                        <span className="text-[9px] font-bold text-gray-500">+15</span>
                      </div>
                      <Link href="/rutas" className="text-sm text-primary-600 font-semibold hover:underline">
                        Ver itinerario completo →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating fare card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Tarifa</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-primary-600">S/3.50</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Pasaje regular</p>
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-gray-500">Estudiante: <span className="font-semibold">S/2.00</span></p>
                  <p className="text-xs text-gray-500">Adulto mayor: <span className="font-semibold">S/2.00</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-24 bg-secondary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <Smartphone className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-semibold text-white/80">Fácil de usar</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black font-[family-name:var(--font-poppins)]">
              Tu viaje en <span className="text-accent-400">3 pasos</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Smartphone,
                title: 'Abre TransRosa',
                description: 'Ingresa a la plataforma desde tu celular o computadora. Sin descargas necesarias.',
              },
              {
                step: '02',
                icon: QrCode,
                title: 'Compra tu Boleto',
                description: 'Selecciona tu horario, paga con Yape/Plin y recibe tu QR al instante.',
              },
              {
                step: '03',
                icon: Bus,
                title: 'Viaja Tranquilo',
                description: 'Muestra tu QR al abordar, rastrea tu unidad en vivo y llega a tu destino.',
              },
            ].map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="relative group">
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <span className="text-6xl font-black text-white/5 absolute top-4 right-6 font-[family-name:var(--font-poppins)]">
                    {step}
                  </span>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-6 shadow-lg shadow-primary-500/25">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{title}</h3>
                  <p className="text-white/50 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== DASHBOARD PREVIEW ==================== */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
              <Eye className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Panel de Control</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-[family-name:var(--font-poppins)]">
              Gestión <span className="text-gradient">360°</span> de la Flota
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Dashboard empresarial con control total de operaciones, finanzas y rendimiento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Bus, title: 'Gestión de Flota', desc: '50 unidades monitoreadas', color: '#DC2626' },
              { icon: Users, title: 'Conductores', desc: '60+ conductores activos', color: '#2563EB' },
              { icon: Navigation, title: 'GPS en Vivo', desc: 'Tracking en tiempo real', color: '#059669' },
              { icon: BarChart3, title: 'Analytics IA', desc: 'Predicción y optimización', color: '#9333EA' },
              { icon: CreditCard, title: 'Finanzas', desc: 'Ingresos y gastos al día', color: '#D97706' },
              { icon: Shield, title: 'Mantenimiento', desc: 'Programación inteligente', color: '#0891B2' },
              { icon: QrCode, title: 'Boletos QR', desc: 'Sistema de venta digital', color: '#E11D48' },
              { icon: TrendingUp, title: 'Reportes', desc: 'KPIs y métricas clave', color: '#4F46E5' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card group hover:-translate-y-1 cursor-pointer">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}15` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/dashboard" className="btn-secondary">
              Acceder al Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-[family-name:var(--font-poppins)]">
              Lo que dicen nuestros <span className="text-primary-600">pasajeros</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'María López',
                role: 'Comerciante - Vegueta',
                text: 'Antes esperaba sin saber cuándo vendría la minivan. Ahora con el GPS veo la ubicación exacta desde mi celular. ¡Increíble!',
                rating: 5,
              },
              {
                name: 'Carlos Ríos',
                role: 'Estudiante - Huacho',
                text: 'El sistema de boletos QR es genialísimo. Pago con Yape y ya no tengo que andar buscando cambio. Además el descuento estudiantil está buenazo.',
                rating: 5,
              },
              {
                name: 'Ana Torres',
                role: 'Profesora - Vegueta',
                text: 'Las minivans siempre llegan puntuales y en buen estado. Se nota que cuidan el mantenimiento. Me siento segura viajando todos los días.',
                rating: 5,
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="card">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '30px 30px',
        }} />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-5xl font-black text-white font-[family-name:var(--font-poppins)] leading-tight">
            ¿Listo para viajar con
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
              tecnología del futuro?
            </span>
          </h2>
          <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto">
            Únete a los miles de pasajeros que ya disfrutan de un transporte más inteligente,
            seguro y puntual entre Vegueta y Huacho.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/boletos" className="btn-primary text-base px-10 py-4 bg-white text-primary-600 hover:bg-gray-100 shadow-xl">
              <QrCode className="w-5 h-5" />
              Comprar Boleto Ahora
            </Link>
            <Link href="/contacto" className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all">
              <Phone className="w-5 h-5" />
              Contáctanos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
