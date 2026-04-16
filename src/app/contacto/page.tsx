'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Phone, Mail, MapPin, MessageCircle, Clock, Send,
  ArrowRight, Facebook, Instagram, ChevronDown, ChevronUp,
  Building2, Headphones, AlertCircle, CheckCircle2,
  Navigation, HelpCircle, User, AtSign, FileText
} from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { APP_CONFIG } from '@/lib/constants'

interface FaqItem {
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    question: 'Cual es el horario de servicio?',
    answer: 'Nuestro servicio opera desde las 5:00 AM hasta las 9:00 PM, con salidas cada 10 minutos desde ambos terminales (Vegueta y Huacho).',
  },
  {
    question: 'Cuanto cuesta el pasaje?',
    answer: 'El pasaje regular cuesta S/3.50. Estudiantes y adultos mayores pagan S/2.00, y ninos menores de 12 anos pagan S/1.50. Ninos menores de 5 anos viajan gratis en brazos de un adulto.',
  },
  {
    question: 'Como puedo comprar mi boleto digital?',
    answer: 'Puedes comprar tu boleto a traves de nuestra plataforma web en la seccion de Boletos. Aceptamos pagos con Yape, Plin, tarjeta y efectivo. Recibiras un codigo QR que deberas mostrar al abordar.',
  },
  {
    question: 'Donde puedo abordar la minivan?',
    answer: 'Puedes abordar en cualquiera de los paraderos autorizados a lo largo de la ruta RI-06, entre Vegueta y Huacho. Consulta nuestra seccion de Rutas para ver el itinerario completo.',
  },
  {
    question: 'Las minivans tienen aire acondicionado?',
    answer: 'Si, nuestras unidades cuentan con aire acondicionado para tu comodidad. Ademas, todas tienen asientos comodos y estan equipadas con GPS para el rastreo en tiempo real.',
  },
  {
    question: 'Que hago si pierdo un objeto en la minivan?',
    answer: 'Contactanos inmediatamente al +51 993 370 254 o por WhatsApp. Nuestro equipo coordinara con el conductor para localizar y devolver tu objeto lo antes posible.',
  },
  {
    question: 'Puedo llevar equipaje o paquetes?',
    answer: 'Si, puedes llevar equipaje de mano y paquetes pequenos sin costo adicional, siempre que no ocupen un asiento adicional ni obstaculicen el paso de otros pasajeros.',
  },
  {
    question: 'Como puedo rastrear mi minivan en vivo?',
    answer: 'A traves de nuestra plataforma web puedes ver la ubicacion en tiempo real de todas nuestras unidades activas en la ruta, con estimaciones de llegada a cada paradero.',
  },
]

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  const contactCards = [
    {
      icon: Phone,
      title: 'Telefono',
      value: APP_CONFIG.contact.phone,
      description: 'Llamanos en horario de atencion',
      href: `tel:${APP_CONFIG.contact.phone.replace(/\s/g, '')}`,
      color: '#2563eb',
      bg: '#dbeafe',
    },
    {
      icon: Mail,
      title: 'Email',
      value: APP_CONFIG.contact.email,
      description: 'Respuesta en menos de 24 horas',
      href: `mailto:${APP_CONFIG.contact.email}`,
      color: '#dc2626',
      bg: '#fee2e2',
    },
    {
      icon: MapPin,
      title: 'Direccion',
      value: APP_CONFIG.contact.address,
      description: 'Oficina principal',
      href: '#mapa',
      color: '#059669',
      bg: '#d1fae5',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: '+51 993 370 254',
      description: 'Atencion rapida y directa',
      href: APP_CONFIG.social.whatsapp,
      color: '#16a34a',
      bg: '#dcfce7',
    },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative gradient-hero overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-10 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 left-20 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-3xl animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-6">
              <Headphones className="w-4 h-4 text-accent-400" />
              <span className="text-sm text-white/80 font-medium">Atencion al Cliente</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight font-[family-name:var(--font-poppins)]">
              Contacta con{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                Nosotros
              </span>
            </h1>
            <p className="mt-6 text-lg text-white/60 max-w-xl leading-relaxed">
              Estamos aqui para ayudarte. Escribenos, llamanos o visitanos en nuestra oficina.
              Respondemos en menos de 24 horas.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== CONTACT CARDS ==================== */}
      <section className="relative -mt-12 z-10 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {contactCards.map(({ icon: Icon, title, value, description, href, color, bg }) => (
            <a
              key={title}
              href={href}
              target={title === 'WhatsApp' ? '_blank' : undefined}
              rel={title === 'WhatsApp' ? 'noopener noreferrer' : undefined}
              className="stat-card hover:-translate-y-1 cursor-pointer"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: bg }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{title}</p>
              <p className="text-sm font-bold text-gray-900 mt-1">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* ==================== CONTACT FORM + INFO ==================== */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Envianos un mensaje</h2>
              <p className="text-gray-500 mb-8">Completa el formulario y te responderemos a la brevedad.</p>

              {submitted && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="text-sm text-emerald-800 font-medium">
                    Mensaje enviado correctamente. Te responderemos pronto.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-gray-400" />
                        Nombre completo
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      required
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center gap-1.5">
                        <AtSign className="w-4 h-4 text-gray-400" />
                        Correo electronico
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                      className="input"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-gray-400" />
                        Telefono
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+51 999 999 999"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Asunto
                      </span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="input"
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="info">Informacion general</option>
                      <option value="boletos">Consulta sobre boletos</option>
                      <option value="rutas">Consulta sobre rutas</option>
                      <option value="reclamo">Reclamo</option>
                      <option value="sugerencia">Sugerencia</option>
                      <option value="objetos">Objetos perdidos</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                      Mensaje
                    </span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Escribe tu mensaje aqui..."
                    required
                    rows={5}
                    className="input resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full sm:w-auto">
                  <Send className="w-4 h-4" />
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Operating Hours */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent-600" />
                </div>
                <h3 className="font-bold text-gray-900">Horario de Atencion</h3>
              </div>
              <div className="space-y-3">
                {[
                  { day: 'Lunes a Viernes', hours: '5:00 AM - 9:00 PM' },
                  { day: 'Sabados', hours: '5:00 AM - 9:00 PM' },
                  { day: 'Domingos y Feriados', hours: '5:00 AM - 9:00 PM' },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600">{day}</span>
                    <span className="text-sm font-semibold text-gray-900">{hours}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-500">
                La oficina administrativa atiende de lunes a viernes de 8:00 AM a 5:00 PM.
              </p>
            </div>

            {/* Social Media */}
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">Siguenos en Redes</h3>
              <div className="space-y-3">
                <a
                  href={APP_CONFIG.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                    <Facebook className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Facebook</p>
                    <p className="text-xs text-gray-500">@transrosa</p>
                  </div>
                </a>
                <a
                  href={APP_CONFIG.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Instagram</p>
                    <p className="text-xs text-gray-500">@transrosa</p>
                  </div>
                </a>
                <a
                  href={APP_CONFIG.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">WhatsApp</p>
                    <p className="text-xs text-gray-500">+51 993 370 254</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick contact via WhatsApp */}
            <a
              href={APP_CONFIG.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="block card bg-gradient-to-r from-green-500 to-green-600 border-green-500 text-white hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg">Escribenos por WhatsApp</p>
                  <p className="text-white/80 text-sm">Respuesta inmediata</p>
                </div>
                <ArrowRight className="w-5 h-5 ml-auto" />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ==================== MAP PLACEHOLDER ==================== */}
      <section id="mapa" className="max-w-7xl mx-auto px-6 pb-16">
        <div className="card p-0 overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Nuestra Ubicacion</h3>
                <p className="text-xs text-gray-500">{APP_CONFIG.contact.address}</p>
              </div>
            </div>
          </div>
          <div className="w-full h-[350px] bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center">
              <MapPin className="w-8 h-8 text-gray-400 animate-pulse" />
            </div>
            <p className="text-gray-500 font-medium">Mapa de ubicacion cargando...</p>
            <p className="text-sm text-gray-400">{APP_CONFIG.contact.address}</p>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-6">
              <HelpCircle className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">Preguntas Frecuentes</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 font-[family-name:var(--font-poppins)]">
              Resolvemos tus <span className="text-gradient">Dudas</span>
            </h2>
            <p className="mt-3 text-gray-500">
              Encuentra respuestas rapidas a las preguntas mas comunes.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`card p-0 overflow-hidden transition-all duration-300 ${
                  openFaq === i ? 'ring-2 ring-primary-200 shadow-md' : ''
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-primary-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 animate-fade-in">
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-500">
              No encontraste lo que buscabas?{' '}
              <a href={APP_CONFIG.social.whatsapp} target="_blank" rel="noopener noreferrer" className="text-primary-600 font-semibold hover:underline">
                Escribenos por WhatsApp
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
