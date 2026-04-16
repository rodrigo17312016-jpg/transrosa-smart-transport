'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  QrCode, ArrowRight, Bus, Clock, User, Phone, CreditCard,
  Smartphone, CheckCircle2, ArrowLeft, MapPin, Wallet,
  Calendar, Shield, Info, DollarSign, ChevronRight, Ticket,
  Banknote, CircleDot
} from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { ROUTE_INFO, APP_CONFIG } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

type Direction = 'vegueta-huacho' | 'huacho-vegueta'
type FareType = 'regular' | 'student' | 'senior' | 'child'
type PaymentMethod = 'yape' | 'plin' | 'cash' | 'card'

function generateTimeSlots(): string[] {
  const times: string[] = []
  for (let h = 5; h <= 21; h++) {
    for (let m = 0; m < 60; m += 10) {
      if (h === 21 && m > 0) break
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      times.push(`${hh}:${mm}`)
    }
  }
  return times
}

function getTodayString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function BoletosPage() {
  const timeSlots = useMemo(() => generateTimeSlots(), [])
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState<Direction | null>(null)
  const [date, setDate] = useState(getTodayString())
  const [time, setTime] = useState('')
  const [fareType, setFareType] = useState<FareType>('regular')
  const [passengerName, setPassengerName] = useState('')
  const [passengerPhone, setPassengerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const farePrice = ROUTE_INFO.fare[fareType]

  const directionLabel =
    direction === 'vegueta-huacho'
      ? 'Vegueta → Huacho'
      : direction === 'huacho-vegueta'
      ? 'Huacho → Vegueta'
      : ''

  const fareTypeLabels: Record<FareType, string> = {
    regular: 'Regular',
    student: 'Estudiante',
    senior: 'Adulto Mayor',
    child: 'Nino',
  }

  const paymentLabels: Record<PaymentMethod, string> = {
    yape: 'Yape',
    plin: 'Plin',
    cash: 'Efectivo',
    card: 'Tarjeta',
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return direction !== null
      case 2:
        return date !== '' && time !== ''
      case 3:
        return passengerName.trim() !== '' && passengerPhone.trim() !== ''
      case 4:
        return paymentMethod !== null && acceptTerms
      default:
        return false
    }
  }

  const handleConfirm = () => {
    setConfirmed(true)
  }

  const handleReset = () => {
    setStep(1)
    setDirection(null)
    setDate(getTodayString())
    setTime('')
    setFareType('regular')
    setPassengerName('')
    setPassengerPhone('')
    setPaymentMethod(null)
    setAcceptTerms(false)
    setConfirmed(false)
  }

  const steps = [
    { num: 1, label: 'Direccion' },
    { num: 2, label: 'Fecha y Hora' },
    { num: 3, label: 'Pasajero' },
    { num: 4, label: 'Pago' },
  ]

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative gradient-hero overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-20 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="max-w-3xl animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-6">
              <QrCode className="w-4 h-4 text-accent-400" />
              <span className="text-sm text-white/80 font-medium">Boletos Digitales</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight font-[family-name:var(--font-poppins)]">
              Compra tu Boleto{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                Digital
              </span>
            </h1>
            <p className="mt-6 text-lg text-white/60 max-w-xl leading-relaxed">
              Selecciona tu ruta, horario y forma de pago. Recibe tu codigo QR al instante
              y aborda sin complicaciones.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6">
              {[
                { icon: Shield, text: 'Pago seguro' },
                { icon: QrCode, text: 'QR instantaneo' },
                { icon: Smartphone, text: 'Yape & Plin' },
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

      {/* ==================== BOOKING SECTION ==================== */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        {confirmed ? (
          /* ---- Confirmation ---- */
          <div className="max-w-lg mx-auto text-center animate-slide-up">
            <div className="card p-10">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Compra Confirmada</h2>
              <p className="text-gray-500 mb-6">Tu boleto digital ha sido generado exitosamente.</p>

              <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ruta</span>
                  <span className="font-semibold text-gray-900">{directionLabel}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Fecha</span>
                  <span className="font-semibold text-gray-900">{date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Hora</span>
                  <span className="font-semibold text-gray-900">{time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pasajero</span>
                  <span className="font-semibold text-gray-900">{passengerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tipo</span>
                  <span className="font-semibold text-gray-900">{fareTypeLabels[fareType]}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-black text-primary-600">{formatCurrency(farePrice)}</span>
                </div>
              </div>

              <div className="bg-primary-50 rounded-2xl p-6 mb-6 border border-primary-200">
                <QrCode className="w-16 h-16 text-primary-600 mx-auto mb-3" />
                <p className="text-sm text-primary-800 font-medium">
                  Tu codigo QR ha sido enviado al numero <strong>{passengerPhone}</strong>.
                  Presentalo al conductor al momento de abordar.
                </p>
              </div>

              <button onClick={handleReset} className="btn-primary w-full">
                <Ticket className="w-5 h-5" />
                Comprar Otro Boleto
              </button>
            </div>
          </div>
        ) : (
          /* ---- Booking Form ---- */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {/* Step Indicator */}
              <div className="flex items-center justify-between mb-10 max-w-lg mx-auto lg:mx-0">
                {steps.map(({ num, label }, i) => (
                  <div key={num} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                          step === num
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                            : step > num
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
                      </div>
                      <span className="text-xs text-gray-500 mt-1.5 font-medium hidden sm:block">{label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`w-12 sm:w-20 h-0.5 mx-1 sm:mx-2 mt-0 sm:-mt-5 ${
                          step > num ? 'bg-emerald-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Direction */}
              {step === 1 && (
                <div className="animate-slide-up">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Selecciona la direccion</h2>
                  <p className="text-gray-500 mb-6">Elige el sentido de tu viaje.</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setDirection('vegueta-huacho')}
                      className={`card text-left transition-all duration-200 cursor-pointer ${
                        direction === 'vegueta-huacho'
                          ? 'ring-2 ring-primary-500 border-primary-300 shadow-lg'
                          : 'hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <CircleDot className="w-5 h-5 text-emerald-600" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-primary-600" />
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900">Vegueta → Huacho</h3>
                      <p className="text-sm text-gray-500 mt-1">{ROUTE_INFO.distances.ida} km - ~{ROUTE_INFO.schedule.estimatedDuration} min</p>
                      {direction === 'vegueta-huacho' && (
                        <div className="mt-3">
                          <span className="badge bg-primary-100 text-primary-700">Seleccionado</span>
                        </div>
                      )}
                    </button>
                    <button
                      onClick={() => setDirection('huacho-vegueta')}
                      className={`card text-left transition-all duration-200 cursor-pointer ${
                        direction === 'huacho-vegueta'
                          ? 'ring-2 ring-primary-500 border-primary-300 shadow-lg'
                          : 'hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-primary-600" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                          <CircleDot className="w-5 h-5 text-emerald-600" />
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900">Huacho → Vegueta</h3>
                      <p className="text-sm text-gray-500 mt-1">{ROUTE_INFO.distances.vuelta} km - ~{ROUTE_INFO.schedule.estimatedDuration} min</p>
                      {direction === 'huacho-vegueta' && (
                        <div className="mt-3">
                          <span className="badge bg-primary-100 text-primary-700">Seleccionado</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <div className="animate-slide-up">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Selecciona fecha y hora</h2>
                  <p className="text-gray-500 mb-6">Elige cuando deseas viajar.</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          Fecha de viaje
                        </span>
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={getTodayString()}
                        className="input max-w-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-gray-400" />
                          Hora de salida
                        </span>
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[300px] overflow-y-auto pr-2">
                        {timeSlots.map((t) => (
                          <button
                            key={t}
                            onClick={() => setTime(t)}
                            className={`py-2.5 px-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                              time === t
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                                : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-600'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          Tipo de tarifa
                        </span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {(Object.entries(ROUTE_INFO.fare) as [FareType, number][]).map(([key, price]) => (
                          <button
                            key={key}
                            onClick={() => setFareType(key)}
                            className={`p-3 rounded-xl text-center transition-all duration-200 ${
                              fareType === key
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                                : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300'
                            }`}
                          >
                            <p className="text-xs font-medium mb-1 opacity-80">{fareTypeLabels[key]}</p>
                            <p className="text-lg font-bold">{formatCurrency(price)}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Passenger Info */}
              {step === 3 && (
                <div className="animate-slide-up">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Datos del pasajero</h2>
                  <p className="text-gray-500 mb-6">Ingresa tu informacion para el boleto.</p>

                  <div className="space-y-5 max-w-lg">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <span className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-gray-400" />
                          Nombre completo
                        </span>
                      </label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        placeholder="Juan Perez"
                        required
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4 text-gray-400" />
                          Numero de celular
                        </span>
                      </label>
                      <input
                        type="tel"
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                        placeholder="999 999 999"
                        required
                        className="input"
                      />
                      <p className="text-xs text-gray-400 mt-1.5">Recibiras tu codigo QR en este numero.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {step === 4 && (
                <div className="animate-slide-up">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Metodo de pago</h2>
                  <p className="text-gray-500 mb-6">Selecciona como deseas pagar.</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                      { id: 'yape' as PaymentMethod, label: 'Yape', icon: Smartphone, color: '#7B2D8E', bg: '#f3e8ff' },
                      { id: 'plin' as PaymentMethod, label: 'Plin', icon: Smartphone, color: '#00BFA5', bg: '#d1fae5' },
                      { id: 'cash' as PaymentMethod, label: 'Efectivo', icon: Banknote, color: '#059669', bg: '#d1fae5' },
                      { id: 'card' as PaymentMethod, label: 'Tarjeta', icon: CreditCard, color: '#2563eb', bg: '#dbeafe' },
                    ].map(({ id, label, icon: Icon, color, bg }) => (
                      <button
                        key={id}
                        onClick={() => setPaymentMethod(id)}
                        className={`card text-center transition-all duration-200 cursor-pointer ${
                          paymentMethod === id
                            ? 'ring-2 ring-primary-500 border-primary-300 shadow-lg'
                            : 'hover:shadow-md'
                        }`}
                      >
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                          style={{ backgroundColor: bg }}
                        >
                          <Icon className="w-6 h-6" style={{ color }} />
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">{label}</p>
                        {paymentMethod === id && (
                          <CheckCircle2 className="w-4 h-4 text-primary-600 mx-auto mt-2" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Terms */}
                  <div className="max-w-lg">
                    <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-600">
                        Acepto los{' '}
                        <Link href="/terminos" className="text-primary-600 font-semibold hover:underline">
                          Terminos y Condiciones
                        </Link>{' '}
                        del servicio de transporte de {APP_CONFIG.fullName} y autorizo el tratamiento de mis datos personales.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-10 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="btn-ghost"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Anterior
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    onClick={() => canProceed() && setStep(step + 1)}
                    disabled={!canProceed()}
                    className={`btn-primary ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Siguiente
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleConfirm}
                    disabled={!canProceed()}
                    className={`btn-primary bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25 hover:shadow-emerald-600/30 ${
                      !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Confirmar Compra
                  </button>
                )}
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <div className="card bg-gradient-to-br from-secondary-50 to-white border-secondary-200">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-primary-600" />
                    Resumen de Compra
                  </h3>

                  <div className="space-y-4">
                    {/* Direction */}
                    <div className="p-3 bg-white rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Direccion</p>
                      <p className="text-sm font-medium text-gray-800 mt-1">
                        {direction ? directionLabel : '---'}
                      </p>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Fecha</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{date || '---'}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Hora</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{time || '---'}</p>
                      </div>
                    </div>

                    {/* Passenger */}
                    <div className="p-3 bg-white rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Pasajero</p>
                      <p className="text-sm font-medium text-gray-800 mt-1">{passengerName || '---'}</p>
                      {passengerPhone && (
                        <p className="text-xs text-gray-500 mt-0.5">{passengerPhone}</p>
                      )}
                    </div>

                    {/* Fare */}
                    <div className="p-3 bg-white rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Tipo de Tarifa</p>
                      <p className="text-sm font-medium text-gray-800 mt-1">{fareTypeLabels[fareType]}</p>
                    </div>

                    {/* Payment */}
                    {paymentMethod && (
                      <div className="p-3 bg-white rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Metodo de Pago</p>
                        <p className="text-sm font-medium text-gray-800 mt-1">{paymentLabels[paymentMethod]}</p>
                      </div>
                    )}

                    {/* Total */}
                    <div className="p-4 bg-primary-50 rounded-xl border border-primary-200">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-2xl font-black text-primary-600">{formatCurrency(farePrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fare Reference */}
                <div className="mt-4 card">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    Tarifas Disponibles
                  </h4>
                  <div className="space-y-2">
                    {(Object.entries(ROUTE_INFO.fare) as [FareType, number][]).map(([key, price]) => (
                      <div
                        key={key}
                        className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-sm ${
                          fareType === key ? 'bg-primary-50 text-primary-800' : 'text-gray-600'
                        }`}
                      >
                        <span>{fareTypeLabels[key]}</span>
                        <span className="font-semibold">{formatCurrency(price)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QR Info */}
                <div className="mt-4 card bg-blue-50 border-blue-200">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Sobre tu codigo QR</p>
                      <p className="text-blue-700">
                        Al confirmar tu compra recibiras un codigo QR por SMS que deberas
                        presentar al conductor al abordar la unidad.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
