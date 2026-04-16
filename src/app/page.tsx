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

// --- Animated Counter Component (smoother easing) ---
function Counter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.3 }
    )
    const el = document.getElementById(`counter-${end}-${suffix}`)
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [end, suffix])

  useEffect(() => {
    if (!started) return
    const duration = 1800
    const startTime = performance.now()
    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo for smooth deceleration
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = eased * end
      setCount(Number(current.toFixed(end % 1 !== 0 ? 1 : 0)))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, end])

  return (
    <span id={`counter-${end}-${suffix}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

// --- Parallax background hook ---
function useParallax() {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const handler = () => setOffset(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return offset
}

export default function HomePage() {
  const scrollY = useParallax()

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[90vh] gradient-hero overflow-hidden flex items-center">
        {/* Animated background elements with parallax */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-20 left-10 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow"
            style={{ transform: `translateY(${scrollY * 0.08}px)` }}
          />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: '1s', transform: `translateY(${scrollY * -0.05}px)` }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl"
            style={{ transform: `translate(-50%, -50%) scale(${1 + scrollY * 0.0003})` }}
          />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
          {/* Animated route line with enhanced vehicle */}
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
            {/* Glowing vehicle indicator */}
            <g>
              <animateMotion
                path="M-100,400 C200,300 400,500 600,350 S900,200 1100,400 S1400,300 1600,400"
                dur="8s"
                repeatCount="indefinite"
              />
              <circle r="8" fill="#F59E0B" opacity="0.3">
                <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle r="5" fill="#F59E0B" />
              <rect x="-10" y="-4" width="20" height="8" rx="3" fill="#F59E0B" opacity="0.9" />
            </g>
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
                <span className="text-sm text-white/80 font-medium">Cooperativa Inteligente de Transporte</span>
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
                Somos una <strong className="text-white/90">cooperativa de 50 socios</strong> que conecta{' '}
                <strong className="text-white/90">Vegueta</strong> y{' '}
                <strong className="text-white/90">Huacho</strong> con 100 unidades y tecnologia de ultima generacion.
                GPS en tiempo real, boletos digitales con QR, prediccion de demanda con IA y mucho mas.
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
                  { icon: Shield, text: 'SOAT al dia' },
                  { icon: Navigation, text: 'GPS en vivo' },
                  { icon: Clock, text: 'Cada 10 min' },
                  { icon: Users, text: '50 Socios' },
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
                    <span className="text-xs text-white/40">100 unidades en flota</span>
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
                        strokeDasharray="6,4"
                      >
                        <animate attributeName="stroke-dashoffset" values="0;-10" dur="0.8s" repeatCount="indefinite" />
                      </path>
                      {/* Route glow */}
                      <path
                        d="M30,130 C80,130 100,80 150,70 S220,30 270,50 S340,80 370,40"
                        stroke="#DC2626"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        opacity="0.15"
                      />
                      {/* Stops */}
                      {[
                        { x: 30, y: 130, label: 'Vegueta' },
                        { x: 150, y: 70, label: 'Bellavista' },
                        { x: 270, y: 50, label: 'Puente' },
                        { x: 370, y: 40, label: 'Huacho' },
                      ].map((stop, i) => (
                        <g key={i}>
                          <circle cx={stop.x} cy={stop.y} r="8" fill="#DC2626" opacity="0.2">
                            <animate attributeName="r" values="8;12;8" dur="3s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
                          </circle>
                          <circle cx={stop.x} cy={stop.y} r="6" fill="#DC2626" />
                          <circle cx={stop.x} cy={stop.y} r="3" fill="white" />
                          <text x={stop.x} y={stop.y + 20} textAnchor="middle" className="fill-white/60 text-[10px]">
                            {stop.label}
                          </text>
                        </g>
                      ))}
                      {/* Moving vehicle with trail */}
                      <g>
                        <animateMotion
                          path="M30,130 C80,130 100,80 150,70 S220,30 270,50 S340,80 370,40"
                          dur="4s"
                          repeatCount="indefinite"
                        />
                        <circle r="8" fill="#F59E0B" opacity="0.2">
                          <animate attributeName="r" values="8;14;8" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                        <rect x="-8" y="-3" width="16" height="6" rx="2" fill="#F59E0B" />
                        <circle r="4" fill="#F59E0B" />
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: '45', unit: 'min', label: 'Duracion' },
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

              {/* Floating notification cards with smoother animation */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 z-20" style={{
                animation: 'float 6s cubic-bezier(0.37, 0, 0.63, 1) infinite',
              }}>
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

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 z-20" style={{
                animation: 'float 6s cubic-bezier(0.37, 0, 0.63, 1) infinite',
                animationDelay: '2s',
              }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">+1,500 pasajeros</p>
                    <p className="text-xs text-gray-500">Transportados hoy</p>
                  </div>
                </div>
              </div>

              {/* New: Cooperative badge floating card */}
              <div className="absolute top-1/2 -left-10 bg-white rounded-2xl shadow-xl p-3 z-20" style={{
                animation: 'float 6s cubic-bezier(0.37, 0, 0.63, 1) infinite',
                animationDelay: '4s',
              }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">50 Socios</p>
                    <p className="text-[10px] text-gray-500">100 vehiculos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-white/30">Descubre mas</span>
          <ChevronRight className="w-4 h-4 text-white/30 rotate-90" />
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="relative -mt-16 z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { icon: Bus, value: 100, suffix: '+', label: 'Unidades', color: 'primary' },
            { icon: Users, value: 50, suffix: '', label: 'Socios', color: 'amber' },
            { icon: Users, value: 1500, suffix: '+', label: 'Pasajeros/dia', color: 'blue' },
            { icon: Route, value: 200, suffix: '+', label: 'Viajes/dia', color: 'emerald' },
            { icon: Star, value: 4.8, suffix: '/5', label: 'Satisfaccion', color: 'rose' },
          ].map(({ icon: Icon, value, suffix, label, color }, index) => (
            <div key={label} className="stat-card" style={{ animationDelay: `${index * 100}ms` }}>
              <div className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center mb-4',
                color === 'primary' && 'bg-primary-100',
                color === 'blue' && 'bg-blue-100',
                color === 'emerald' && 'bg-emerald-100',
                color === 'amber' && 'bg-amber-100',
                color === 'rose' && 'bg-rose-100',
              )}>
                <Icon className={cn(
                  'w-6 h-6',
                  color === 'primary' && 'text-primary-600',
                  color === 'blue' && 'text-blue-600',
                  color === 'emerald' && 'text-emerald-600',
                  color === 'amber' && 'text-amber-600',
                  color === 'rose' && 'text-rose-600',
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
                color === 'rose' && 'bg-rose-500',
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
              <span className="text-sm font-semibold text-primary-700">Tecnologia de Punta</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-[family-name:var(--font-poppins)]">
              El Futuro del Transporte
              <br />
              <span className="text-gradient">ya llego a Huacho</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Implementamos las mismas tecnologias que usan las empresas de transporte europeas,
              adaptadas a la realidad peruana.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Navigation,
                title: 'GPS en Tiempo Real',
                description: 'Rastrea tu minivan en vivo desde tu celular. Sabe exactamente cuando llega tu unidad al paradero.',
                tag: 'Tracking',
                color: 'blue',
              },
              {
                icon: QrCode,
                title: 'Boletos Digitales QR',
                description: 'Compra tu boleto online y viaja con tu codigo QR. Sin colas, sin efectivo, sin complicaciones.',
                tag: 'Digital',
                color: 'primary',
              },
              {
                icon: Brain,
                title: 'IA Predictiva',
                description: 'Prediccion de demanda con inteligencia artificial para optimizar la frecuencia de salidas.',
                tag: 'AI-Powered',
                color: 'purple',
              },
              {
                icon: CreditCard,
                title: 'Pago Digital',
                description: 'Paga con Yape, Plin, tarjeta o transferencia. Multiples opciones de pago seguro.',
                tag: 'Pagos',
                color: 'emerald',
              },
              {
                icon: Users,
                title: 'Gestion de Socios',
                description: 'Panel personalizado para cada socio con seguimiento de comisiones diarias (S/25), mensuales (S/600) y anuales (S/6,500) por vehiculo.',
                tag: 'Cooperativa',
                color: 'amber',
              },
              {
                icon: Shield,
                title: 'Compliance Total',
                description: 'Control de SOAT, revision tecnica, licencias y permisos. Alertas automaticas antes del vencimiento de cada documento.',
                tag: 'Cumplimiento',
                color: 'cyan',
              },
              {
                icon: BarChart3,
                title: 'Dashboard Analytics',
                description: 'Panel de control con metricas en tiempo real, reportes financieros y analisis de rendimiento.',
                tag: 'Analytics',
                color: 'rose',
              },
              {
                icon: Bell,
                title: 'Alertas Inteligentes',
                description: 'Notificaciones automaticas de SOAT, revision tecnica, mantenimiento y cobro de comisiones.',
                tag: 'Smart',
                color: 'indigo',
              },
              {
                icon: Globe,
                title: 'Plataforma Web',
                description: 'Consulta rutas, horarios y compra boletos desde cualquier dispositivo con internet.',
                tag: 'Web',
                color: 'teal',
              },
            ].map(({ icon: Icon, title, description, tag, color }, index) => (
              <div
                key={title}
                className="card group hover:-translate-y-2 transition-all duration-500"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110',
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
                100 vehiculos operados por 50 socios conectan Vegueta y Huacho por la
                Carretera Panamericana Norte, con paradas estrategicas para tu comodidad.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { label: 'Origen', value: 'Av. 200 Millas - Vegueta', icon: '🟢' },
                  { label: 'Destino', value: 'Av. Luna Arrieta / Ca. Miguel Grau - Huacho', icon: '🔴' },
                  { label: 'Distancia', value: '43.15 km (ida y vuelta)', icon: '📏' },
                  { label: 'Duracion', value: '~45 minutos por tramo', icon: '⏱️' },
                  { label: 'Frecuencia', value: 'Cada 10 minutos', icon: '🔄' },
                  { label: 'Horario', value: '5:00 AM - 9:00 PM', icon: '🕐' },
                  { label: 'Flota', value: '100 vehiculos (50 socios x 2 unidades)', icon: '🚐' },
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

      {/* ==================== MODELO COOPERATIVO ==================== */}
      <section className="py-24 bg-gradient-to-br from-amber-50 via-white to-primary-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-6">
              <Users className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700">Modelo Cooperativo</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-[family-name:var(--font-poppins)]">
              Una cooperativa de
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">50 socios propietarios</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Cada socio es dueno de 2 vehiculos, formando una flota de 100 unidades.
              Gestion transparente, comisiones claras y cumplimiento total.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: '50 Socios Propietarios',
                description: 'Cada socio posee 2 vehiculos y puede conducir o contratar conductores para sus unidades.',
                highlight: '50 socios x 2 vehiculos',
                color: '#D97706',
                bg: '#FEF3C7',
              },
              {
                icon: CreditCard,
                title: 'Comisiones Transparentes',
                description: 'Sistema digital de cobro: S/25 diario, S/600 mensual o S/6,500 anual por vehiculo.',
                highlight: 'S/25 / S/600 / S/6,500',
                color: '#059669',
                bg: '#D1FAE5',
              },
              {
                icon: Shield,
                title: 'Cumplimiento Documentario',
                description: 'La empresa garantiza que todos los vehiculos y conductores cumplen al 100% con las regulaciones.',
                highlight: '100% al dia',
                color: '#DC2626',
                bg: '#FEE2E2',
              },
              {
                icon: BarChart3,
                title: 'Dashboard por Socio',
                description: 'Cada socio accede a un panel personalizado con ingresos, gastos, comisiones y estado de sus vehiculos.',
                highlight: 'Panel personalizado',
                color: '#4F46E5',
                bg: '#E0E7FF',
              },
            ].map(({ icon: Icon, title, description, highlight, color, bg }, index) => (
              <div
                key={title}
                className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-1.5" style={{ backgroundColor: color }} />
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: bg }}>
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{description}</p>
                <div className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold" style={{ backgroundColor: bg, color }}>
                  {highlight}
                </div>
              </div>
            ))}
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
              <span className="text-sm font-semibold text-white/80">Facil de usar</span>
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
            ].map(({ step, icon: Icon, title, description }, index) => (
              <div key={step} className="relative group" style={{ animationDelay: `${index * 150}ms` }}>
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
              Gestion <span className="text-gradient">360</span> de la Flota
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Dashboard empresarial con control total de operaciones, socios, finanzas y rendimiento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Bus, title: 'Gestion de Flota', desc: '100 unidades monitoreadas', color: '#DC2626' },
              { icon: Users, title: 'Socios', desc: '50 socios, 2 vehiculos c/u', color: '#D97706' },
              { icon: Users, title: 'Conductores', desc: '100+ conductores activos', color: '#2563EB' },
              { icon: Navigation, title: 'GPS en Vivo', desc: 'Tracking en tiempo real', color: '#059669' },
              { icon: BarChart3, title: 'Analytics IA', desc: 'Prediccion y optimizacion', color: '#9333EA' },
              { icon: CreditCard, title: 'Comisiones', desc: 'Cobro diario/mensual/anual', color: '#D97706' },
              { icon: Shield, title: 'Compliance', desc: 'Documentacion al 100%', color: '#0891B2' },
              { icon: TrendingUp, title: 'Reportes', desc: 'KPIs y metricas clave', color: '#4F46E5' },
            ].map(({ icon: Icon, title, desc, color }, index) => (
              <div
                key={title}
                className="card group hover:-translate-y-2 cursor-pointer transition-all duration-500"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: `${color}15` }}>
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
              Lo que dicen nuestros <span className="text-primary-600">pasajeros y socios</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Maria Lopez',
                role: 'Comerciante - Vegueta',
                text: 'Antes esperaba sin saber cuando vendria la minivan. Ahora con el GPS veo la ubicacion exacta desde mi celular.',
                rating: 5,
              },
              {
                name: 'Carlos Rios',
                role: 'Estudiante - Huacho',
                text: 'El sistema de boletos QR es genial. Pago con Yape y ya no tengo que andar buscando cambio. El descuento estudiantil esta buenazo.',
                rating: 5,
              },
              {
                name: 'Ana Torres',
                role: 'Profesora - Vegueta',
                text: 'Las minivans siempre llegan puntuales y en buen estado. Se nota que cuidan el mantenimiento. Me siento segura viajando.',
                rating: 5,
              },
              {
                name: 'Roberto Mendez',
                role: 'Socio Propietario #12',
                text: 'Como socio, el dashboard me permite ver las comisiones de mis 2 vehiculos en tiempo real. Todo transparente y digital, sin papeleos.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="card transition-all duration-500 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    testimonial.role.includes('Socio') ? 'bg-amber-100' : 'bg-primary-100'
                  )}>
                    <span className={cn(
                      "text-sm font-bold",
                      testimonial.role.includes('Socio') ? 'text-amber-600' : 'text-primary-600'
                    )}>
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
            Listo para viajar con
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
              tecnologia del futuro?
            </span>
          </h2>
          <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto">
            Unete a los miles de pasajeros que ya disfrutan de un transporte mas inteligente,
            seguro y puntual entre Vegueta y Huacho. Respaldado por 50 socios comprometidos.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/boletos" className="btn-primary text-base px-10 py-4 bg-white text-primary-600 hover:bg-gray-100 shadow-xl">
              <QrCode className="w-5 h-5" />
              Comprar Boleto Ahora
            </Link>
            <Link href="/contacto" className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all">
              <Phone className="w-5 h-5" />
              Contactanos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
