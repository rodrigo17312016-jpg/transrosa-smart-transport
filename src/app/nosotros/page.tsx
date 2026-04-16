'use client'

import Link from 'next/link'
import {
  Bus, Users, Shield, Award, Target, Eye, Heart, Star,
  ArrowRight, CheckCircle2, Building2, FileText, Scale,
  Wrench, BadgeCheck, UserCircle, Sparkles, Globe,
  Clock, MapPin, Phone, Zap
} from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { APP_CONFIG } from '@/lib/constants'

export default function NosotrosPage() {
  const values = [
    {
      icon: Shield,
      title: 'Seguridad',
      description: 'La seguridad de nuestros pasajeros es nuestra maxima prioridad. Cumplimos con todas las normativas vigentes.',
      color: '#2563eb',
      bg: '#dbeafe',
    },
    {
      icon: Clock,
      title: 'Puntualidad',
      description: 'Respetamos tu tiempo. Salidas cada 10 minutos con un servicio confiable y constante.',
      color: '#059669',
      bg: '#d1fae5',
    },
    {
      icon: Heart,
      title: 'Servicio',
      description: 'Atendemos a nuestros pasajeros con amabilidad, respeto y profesionalismo en cada viaje.',
      color: '#dc2626',
      bg: '#fee2e2',
    },
    {
      icon: Zap,
      title: 'Innovacion',
      description: 'Apostamos por la tecnologia para ofrecer un servicio de transporte moderno y eficiente.',
      color: '#9333ea',
      bg: '#f3e8ff',
    },
    {
      icon: Scale,
      title: 'Transparencia',
      description: 'Operamos con total transparencia en nuestras tarifas, horarios y procesos administrativos.',
      color: '#d97706',
      bg: '#fef3c7',
    },
    {
      icon: Users,
      title: 'Compromiso Social',
      description: 'Contribuimos al desarrollo de nuestra comunidad conectando Vegueta y Huacho de manera accesible.',
      color: '#0891b2',
      bg: '#cffafe',
    },
  ]

  const certifications = [
    {
      icon: Shield,
      title: 'SOAT Vigente',
      description: 'Todas nuestras unidades cuentan con Seguro Obligatorio de Accidentes de Transito al dia.',
    },
    {
      icon: Wrench,
      title: 'Revisiones Tecnicas',
      description: 'Inspecciones tecnicas vehiculares periodicas aprobadas por centros autorizados.',
    },
    {
      icon: BadgeCheck,
      title: 'Autorizacion MTC',
      description: 'Servicio autorizado conforme a las disposiciones del Ministerio de Transportes y Comunicaciones.',
    },
    {
      icon: FileText,
      title: 'Resolucion Municipal',
      description: APP_CONFIG.legal.resolucion,
    },
  ]

  const timeline = [
    {
      title: 'Fundacion de la Cooperativa',
      description: 'Nace como una cooperativa de transporte para conectar Vegueta y Huacho, respondiendo a la necesidad de transporte publico interurbano en la provincia.',
    },
    {
      title: 'Autorizacion Municipal',
      description: `Obtuvimos la autorizacion oficial de la Municipalidad Provincial de Huaura mediante la ${APP_CONFIG.legal.resolucion}, conforme a la ${APP_CONFIG.legal.ordenanza}.`,
    },
    {
      title: 'Ruta RI-06 Establecida',
      description: `Se nos asigna oficialmente la ${APP_CONFIG.legal.ruta}, cubriendo el recorrido interurbano entre Vegueta y Huacho por la Panamericana Norte.`,
    },
    {
      title: 'Transformacion Digital',
      description: 'Lanzamiento de la plataforma TransRosa con GPS en tiempo real, boletos digitales con QR, dashboard de gestion y sistema de pagos electronicos.',
    },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative gradient-hero overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-20 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 right-20 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-3xl animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-6">
              <Building2 className="w-4 h-4 text-accent-400" />
              <span className="text-sm text-white/80 font-medium">Sobre Nosotros</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight font-[family-name:var(--font-poppins)]">
              {APP_CONFIG.shortName}
            </h1>
            <p className="mt-2 text-xl text-white/70 font-medium">{APP_CONFIG.fullName}</p>
            <p className="mt-6 text-lg text-white/60 max-w-xl leading-relaxed">
              {APP_CONFIG.slogan}. Somos la empresa de transporte interurbano que conecta Vegueta y Huacho con seguridad, puntualidad y la mejor tecnologia.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              {[
                { icon: Shield, text: 'SOAT vigente' },
                { icon: Bus, text: '50+ unidades' },
                { icon: Star, text: '+15 anos de servicio' },
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
        </div>
      </section>

      {/* ==================== COMPANY HISTORY ==================== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-6">
                <Globe className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-semibold text-primary-700">Nuestra Historia</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-[family-name:var(--font-poppins)]">
                Una historia de <span className="text-gradient">compromiso</span>
              </h2>
              <p className="mt-6 text-gray-600 leading-relaxed">
                La <strong>{APP_CONFIG.fullName}</strong> nacio como una cooperativa de
                transporte con la mision de ofrecer un servicio de transporte publico interurbano
                seguro, accesible y eficiente entre las localidades de Vegueta y Huacho, en la
                provincia de Huaura, Lima.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Fuimos autorizados por la <strong>Municipalidad Provincial de Huaura</strong> mediante
                la <strong>{APP_CONFIG.legal.resolucion}</strong>, conforme a la{' '}
                <strong>{APP_CONFIG.legal.ordenanza}</strong>, para operar la{' '}
                <strong>{APP_CONFIG.legal.ruta}</strong>.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Hoy, con mas de 50 unidades modernas y un equipo comprometido de conductores profesionales,
                transportamos a mas de 1,200 pasajeros diariamente. Nuestra reciente transformacion digital
                con la plataforma TransRosa nos posiciona como una empresa de transporte innovadora y a la
                vanguardia del sector.
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-accent-500" />
              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-5 pl-0">
                    <div className="relative z-10 shrink-0">
                      <div className="w-12 h-12 rounded-full bg-white border-2 border-primary-300 flex items-center justify-center shadow-md">
                        <span className="text-sm font-bold text-primary-600">{String(i + 1).padStart(2, '0')}</span>
                      </div>
                    </div>
                    <div className="card flex-1">
                      <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MISSION, VISION, VALUES ==================== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-accent-600" />
              <span className="text-sm font-semibold text-accent-700">Nuestro Proposito</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-[family-name:var(--font-poppins)]">
              Mision, Vision y <span className="text-gradient">Valores</span>
            </h2>
          </div>

          {/* Mission and Vision */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="card bg-gradient-to-br from-primary-50 to-white border-primary-200 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center">
                  <Target className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Mision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Brindar un servicio de transporte publico interurbano seguro, accesible,
                puntual y tecnologicamente avanzado entre Vegueta y Huacho, contribuyendo al
                desarrollo economico y social de la provincia de Huaura, garantizando la
                satisfaccion de nuestros pasajeros en cada viaje.
              </p>
            </div>
            <div className="card bg-gradient-to-br from-accent-50 to-white border-accent-200 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-accent-100 flex items-center justify-center">
                  <Eye className="w-7 h-7 text-accent-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Ser la empresa de transporte interurbano lider en innovacion tecnologica
                de la provincia de Huaura, reconocida por la excelencia de nuestro servicio,
                la seguridad de nuestros pasajeros y la implementacion de soluciones
                inteligentes que transformen la movilidad urbana en el Peru.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, description, color, bg }) => (
              <div key={title} className="card group hover:-translate-y-1">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: bg }}
                >
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FLEET INFO ==================== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Fleet visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-secondary-50 to-primary-50 rounded-3xl p-8 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Bus, value: '50+', label: 'Minivans Modernas', color: '#dc2626' },
                    { icon: Users, value: '11', label: 'Capacidad por Unidad', color: '#2563eb' },
                    { icon: Shield, value: '100%', label: 'SOAT Vigente', color: '#059669' },
                    { icon: Wrench, value: 'Al dia', label: 'Rev. Tecnicas', color: '#d97706' },
                  ].map(({ icon: Icon, value, label, color }) => (
                    <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                        style={{ backgroundColor: `${color}15` }}
                      >
                        <Icon className="w-6 h-6" style={{ color }} />
                      </div>
                      <p className="text-2xl font-black text-gray-900">{value}</p>
                      <p className="text-xs text-gray-500 mt-1">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-white/80 rounded-xl border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Caracteristicas de la Flota</h4>
                  <div className="space-y-2">
                    {[
                      'Minivans categorias M1 y M2',
                      'Capacidad: 11 pasajeros (incluido conductor)',
                      'Aire acondicionado',
                      'Asientos comodos y ergonomicos',
                      'GPS integrado para tracking en vivo',
                      'Mantenimiento preventivo programado',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
                <Bus className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Nuestra Flota</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-gray-900 font-[family-name:var(--font-poppins)]">
                Flota <span className="text-gradient">Moderna</span> y Segura
              </h2>
              <p className="mt-6 text-gray-600 leading-relaxed">
                Contamos con mas de <strong>50 minivans modernas</strong> con capacidad
                para <strong>11 pasajeros</strong> (incluido el conductor), equipadas con
                tecnologia GPS de ultima generacion para el rastreo en tiempo real de cada unidad.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Nuestras unidades pertenecen a las categorias <strong>M1 y M2</strong>,
                cumpliendo con todos los requisitos tecnicos y de seguridad establecidos
                por el Ministerio de Transportes y Comunicaciones. Cada vehiculo pasa por
                inspecciones tecnicas periodicas y cuenta con SOAT vigente.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                El mantenimiento preventivo programado garantiza que nuestras unidades
                esten siempre en optimas condiciones para ofrecerte un viaje seguro y comodo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== LEADERSHIP ==================== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
              <UserCircle className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Liderazgo</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 font-[family-name:var(--font-poppins)]">
              Nuestro <span className="text-gradient">Equipo Directivo</span>
            </h2>
            <p className="mt-4 text-gray-500">
              Un equipo comprometido con la excelencia y la innovacion en el transporte.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="card text-center hover:-translate-y-1">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-900 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-600/20">
                <UserCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{APP_CONFIG.legal.gerente}</h3>
              <p className="text-primary-600 font-semibold mt-1">Gerente General</p>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                Liderando la transformacion digital de {APP_CONFIG.shortName} y la
                implementacion de tecnologias inteligentes en el transporte publico
                interurbano de la provincia de Huaura.
              </p>
              <div className="mt-5 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Building2 className="w-3.5 h-3.5" />
                  {APP_CONFIG.shortName}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5" />
                  Huacho, Lima
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== LEGAL & CERTIFICATIONS ==================== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-6">
              <Award className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">Legal y Certificaciones</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 font-[family-name:var(--font-poppins)]">
              Operamos con <span className="text-gradient">Total Legalidad</span>
            </h2>
          </div>

          {/* Legal Info Card */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="card bg-gradient-to-br from-secondary-50 to-white border-secondary-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-secondary-700" />
                Informacion Legal
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Razon Social', value: APP_CONFIG.fullName },
                  { label: 'RUC', value: APP_CONFIG.ruc },
                  { label: 'Gerente General', value: APP_CONFIG.legal.gerente },
                  { label: 'Ruta Autorizada', value: APP_CONFIG.legal.ruta },
                  { label: 'Resolucion', value: APP_CONFIG.legal.resolucion },
                  { label: 'Ordenanza Base', value: APP_CONFIG.legal.ordenanza },
                  { label: 'Direccion', value: APP_CONFIG.contact.address },
                  { label: 'Telefono', value: APP_CONFIG.contact.phone },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 bg-white rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
                    <p className="text-sm text-gray-800 font-medium mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card text-center hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
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
            Forma parte de la{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">
              familia TransRosa
            </span>
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Viaja con nosotros y experimenta el futuro del transporte interurbano en la provincia de Huaura.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/boletos" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 shadow-xl px-8 py-4">
              Comprar Boleto
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-all"
            >
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
