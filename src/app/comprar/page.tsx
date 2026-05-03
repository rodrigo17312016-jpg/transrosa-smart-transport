'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import QRCode from 'qrcode'
import {
  ArrowRight, ArrowLeft, Check, CheckCircle2, QrCode, Calendar, Clock,
  User, Phone, CreditCard, MapPin, Loader2, Download, Share2, AlertCircle,
  Wallet, Smartphone, Bus,
} from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { createClient, isSupabaseConfigured, type DBTicket } from '@/lib/supabase/client'
import { generateTicketQR } from '@/lib/supabase/realtime'
import { ROUTE_INFO, APP_CONFIG } from '@/lib/constants'
import { formatCurrency, cn } from '@/lib/utils'

// ============================================================
// Types
// ============================================================
type Direction = 'ida' | 'vuelta'
type FareType = 'regular' | 'student' | 'senior' | 'child'
type PaymentMethod = 'cash' | 'yape' | 'plin' | 'card'

interface FareOption {
  id: FareType
  label: string
  price: number
  description: string
}

interface PaymentOption {
  id: PaymentMethod
  label: string
  description: string
  Icon: typeof Wallet
  color: string
  bg: string
  border: string
}

// ============================================================
// Helpers
// ============================================================
function getTodayString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getMaxDateString(): string {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = 5; h <= 21; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 21 && m > 0) break
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return slots
}

function formatDateLabel(dateStr: string): string {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(y, m - 1, d))
}

const FARE_OPTIONS: FareOption[] = [
  { id: 'regular', label: 'Regular', price: ROUTE_INFO.fare.regular, description: 'Adulto general' },
  { id: 'student', label: 'Estudiante', price: ROUTE_INFO.fare.student, description: 'Con carnet vigente' },
  { id: 'senior', label: 'Adulto Mayor', price: ROUTE_INFO.fare.senior, description: '60+ años' },
  { id: 'child', label: 'Niño', price: ROUTE_INFO.fare.child, description: 'Hasta 12 años' },
]

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    id: 'cash', label: 'Efectivo', description: 'Pagar al abordar',
    Icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200',
  },
  {
    id: 'yape', label: 'Yape', description: 'BCP transferencia móvil',
    Icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200',
  },
  {
    id: 'plin', label: 'Plin', description: 'BBVA / Interbank',
    Icon: Smartphone, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200',
  },
  {
    id: 'card', label: 'Tarjeta', description: 'Visa / Mastercard',
    Icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200',
  },
]

// ============================================================
// Component
// ============================================================
export default function ComprarPage() {
  const timeSlots = useMemo(() => generateTimeSlots(), [])
  const supabaseReady = useMemo(() => isSupabaseConfigured(), [])

  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [direction, setDirection] = useState<Direction | null>(null)
  const [date, setDate] = useState(getTodayString())
  const [time, setTime] = useState('')
  const [fareType, setFareType] = useState<FareType>('regular')
  const [passengerName, setPassengerName] = useState('')
  const [passengerDni, setPassengerDni] = useState('')
  const [passengerPhone, setPassengerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Submission state
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Success state
  const [savedTicket, setSavedTicket] = useState<DBTicket | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [showConfetti, setShowConfetti] = useState(false)

  // Derived values
  const fare = useMemo(
    () => FARE_OPTIONS.find((f) => f.id === fareType)?.price ?? ROUTE_INFO.fare.regular,
    [fareType]
  )
  const directionLabel = direction === 'ida' ? 'Vegueta → Huacho' : direction === 'vuelta' ? 'Huacho → Vegueta' : ''
  const distanceKm = direction === 'ida' ? ROUTE_INFO.distances.ida : direction === 'vuelta' ? ROUTE_INFO.distances.vuelta : 0

  // ============================================================
  // Step navigation + validation
  // ============================================================
  const validateStep = (s: number): boolean => {
    const next: Record<string, string> = {}
    if (s === 1 && !direction) next.direction = 'Selecciona una dirección'
    if (s === 2) {
      if (!date) next.date = 'Selecciona una fecha'
      if (!time) next.time = 'Selecciona un horario'
    }
    if (s === 3) {
      if (!passengerName.trim() || passengerName.trim().length < 3) next.name = 'Ingresa tu nombre completo'
      if (!/^\d{8}$/.test(passengerDni)) next.dni = 'DNI debe tener exactamente 8 dígitos'
      if (passengerPhone && !/^\d{9}$/.test(passengerPhone)) next.phone = 'El teléfono debe tener 9 dígitos'
    }
    if (s === 4) {
      if (!paymentMethod) next.payment = 'Selecciona un método de pago'
      if (!acceptTerms) next.terms = 'Debes aceptar los términos para continuar'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const goNext = () => {
    if (!validateStep(step)) return
    if (step < 4) setStep((step + 1) as 1 | 2 | 3 | 4)
    else handleConfirm()
  }

  const goBack = () => {
    if (step > 1 && step < 5) setStep((step - 1) as 1 | 2 | 3 | 4)
  }

  // ============================================================
  // Submit: insert into Supabase + render QR
  // ============================================================
  async function handleConfirm() {
    if (!validateStep(4)) return
    setSubmitting(true)
    setSubmitError(null)

    try {
      const qrString = generateTicketQR()
      const departureIso = new Date(`${date}T${time}:00`).toISOString()

      let ticket: DBTicket | null = null

      if (supabaseReady) {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('tr_tickets')
          .insert({
            qr_code: qrString,
            passenger_name: passengerName.trim(),
            passenger_dni: passengerDni,
            passenger_phone: passengerPhone || null,
            fare,
            fare_type: fareType,
            payment_method: paymentMethod,
            direction,
            departure_time: departureIso,
            status: 'active',
          })
          .select()
          .single()

        if (error) throw error
        ticket = data as DBTicket
      } else {
        // Demo mode: build a local-only ticket
        ticket = {
          id: `demo-${Date.now()}`,
          qr_code: qrString,
          passenger_name: passengerName.trim(),
          passenger_dni: passengerDni,
          passenger_phone: passengerPhone || null,
          fare,
          fare_type: fareType,
          payment_method: paymentMethod ?? 'cash',
          direction: direction ?? 'ida',
          departure_time: departureIso,
          status: 'active',
          created_at: new Date().toISOString(),
          used_at: null,
        }
      }

      // Generate QR PNG dataURL
      const dataUrl = await QRCode.toDataURL(qrString, {
        width: 400,
        margin: 2,
        color: { dark: '#DC2626', light: '#ffffff' },
      })

      setSavedTicket(ticket)
      setQrDataUrl(dataUrl)
      setStep(5)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3500)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'No se pudo guardar el boleto. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  // ============================================================
  // Reset / download / share
  // ============================================================
  function resetForm() {
    setStep(1)
    setDirection(null)
    setDate(getTodayString())
    setTime('')
    setFareType('regular')
    setPassengerName('')
    setPassengerDni('')
    setPassengerPhone('')
    setPaymentMethod(null)
    setAcceptTerms(false)
    setErrors({})
    setSubmitError(null)
    setSavedTicket(null)
    setQrDataUrl('')
  }

  function downloadQR() {
    if (!qrDataUrl || !savedTicket) return
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `boleto-transrosa-${savedTicket.qr_code}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async function shareQR() {
    if (!savedTicket || !qrDataUrl) return
    const text = `Mi boleto TransRosa\nCódigo: ${savedTicket.qr_code}\nRuta: ${directionLabel}\nFecha: ${formatDateLabel(date)} ${time}\nPasajero: ${savedTicket.passenger_name}`
    try {
      // Try Web Share API with image
      if (typeof navigator !== 'undefined' && 'canShare' in navigator) {
        const blob = await (await fetch(qrDataUrl)).blob()
        const file = new File([blob], `boleto-${savedTicket.qr_code}.png`, { type: 'image/png' })
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: 'Boleto TransRosa', text, files: [file] })
          return
        }
      }
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: 'Boleto TransRosa', text })
        return
      }
      // Fallback: copy code to clipboard
      await navigator.clipboard.writeText(text)
      alert('Detalles del boleto copiados al portapapeles')
    } catch {
      /* user cancelled or unsupported */
    }
  }

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-red-50/30">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white pt-32 pb-16 px-4">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex items-center gap-2 text-sm text-red-100 mb-4">
            <Link href="/" className="hover:text-white transition">Inicio</Link>
            <ChevronDot />
            <span className="text-white font-medium">Comprar Boleto</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs font-bold uppercase tracking-wider mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
                </span>
                Sistema en tiempo real
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Compra tu Boleto Digital
              </h1>
              <p className="mt-3 text-lg text-red-100 max-w-2xl">
                Reserva tu lugar en {ROUTE_INFO.code} {ROUTE_INFO.name} con QR escaneable, conectado a la base de datos en vivo.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-4">
              <Bus className="w-8 h-8 text-accent-300" />
              <div>
                <div className="text-xs uppercase tracking-wider text-red-100">Tarifa desde</div>
                <div className="text-2xl font-bold">{formatCurrency(ROUTE_INFO.fare.child)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo banner */}
      {!supabaseReady && step !== 5 && (
        <div className="container mx-auto max-w-6xl px-4 -mt-8 relative z-20">
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-2xl p-4 flex items-start gap-3 shadow-md">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900">Modo Demo</p>
              <p className="text-sm text-amber-800">
                Los boletos no se guardarán en la base de datos. El QR se genera localmente para demostración.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="container mx-auto max-w-6xl px-4 py-12 flex-1">
        {/* Step indicator */}
        {step !== 5 && (
          <div className="mb-10">
            <StepIndicator current={step} />
          </div>
        )}

        <div className={cn('grid gap-8', step !== 5 ? 'lg:grid-cols-[1fr_360px]' : 'grid-cols-1')}>
          {/* LEFT: form area */}
          <div className="min-w-0">
            {step === 1 && (
              <StepDirection
                direction={direction}
                setDirection={(d) => { setDirection(d); setErrors({}) }}
                error={errors.direction}
              />
            )}

            {step === 2 && (
              <StepDateTime
                date={date}
                setDate={setDate}
                time={time}
                setTime={setTime}
                fareType={fareType}
                setFareType={setFareType}
                timeSlots={timeSlots}
                errors={errors}
              />
            )}

            {step === 3 && (
              <StepPassenger
                name={passengerName}
                setName={setPassengerName}
                dni={passengerDni}
                setDni={setPassengerDni}
                phone={passengerPhone}
                setPhone={setPassengerPhone}
                errors={errors}
              />
            )}

            {step === 4 && (
              <StepPayment
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                acceptTerms={acceptTerms}
                setAcceptTerms={setAcceptTerms}
                errors={errors}
                submitError={submitError}
              />
            )}

            {step === 5 && savedTicket && (
              <StepSuccess
                ticket={savedTicket}
                qrDataUrl={qrDataUrl}
                directionLabel={directionLabel}
                date={date}
                time={time}
                onDownload={downloadQR}
                onShare={shareQR}
                onReset={resetForm}
                showConfetti={showConfetti}
                supabaseReady={supabaseReady}
              />
            )}

            {/* Bottom navigation */}
            {step !== 5 && (
              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 1 || submitting}
                  className={cn(
                    'inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition',
                    step === 1
                      ? 'opacity-40 cursor-not-allowed text-gray-400'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  disabled={submitting}
                  className={cn(
                    'btn-primary min-w-[180px]',
                    submitting && 'opacity-80 cursor-wait'
                  )}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : step === 4 ? (
                    <>
                      <Check className="w-4 h-4" />
                      Confirmar compra
                    </>
                  ) : (
                    <>
                      Siguiente
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: sticky summary (hidden on success) */}
          {step !== 5 && (
            <aside className="lg:sticky lg:top-28 self-start">
              <SummaryCard
                directionLabel={directionLabel}
                distanceKm={distanceKm}
                date={date}
                time={time}
                fareType={fareType}
                fare={fare}
                passengerName={passengerName}
                passengerDni={passengerDni}
                paymentMethod={paymentMethod}
              />
            </aside>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

// ============================================================
// Sub-components
// ============================================================

function ChevronDot() {
  return (
    <span aria-hidden className="inline-block w-1 h-1 rounded-full bg-red-200" />
  )
}

function StepIndicator({ current }: { current: number }) {
  const steps = [
    { n: 1, label: 'Dirección', Icon: MapPin },
    { n: 2, label: 'Fecha y Hora', Icon: Calendar },
    { n: 3, label: 'Pasajero', Icon: User },
    { n: 4, label: 'Pago', Icon: CreditCard },
  ]
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <ol className="flex items-center justify-between gap-2">
        {steps.map(({ n, label, Icon }, i) => {
          const isDone = current > n
          const isActive = current === n
          return (
            <li key={n} className="flex-1 flex items-center min-w-0">
              <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                <div
                  className={cn(
                    'w-11 h-11 rounded-full flex items-center justify-center font-bold transition-all duration-300',
                    isDone && 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30',
                    isActive && 'bg-primary-600 text-white shadow-lg shadow-primary-600/40 scale-110',
                    !isDone && !isActive && 'bg-gray-100 text-gray-400'
                  )}
                >
                  {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span
                  className={cn(
                    'text-xs font-semibold uppercase tracking-wider truncate max-w-full',
                    isActive ? 'text-primary-700' : isDone ? 'text-emerald-600' : 'text-gray-400'
                  )}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'h-1 flex-1 rounded-full mx-1 transition',
                    current > n ? 'bg-emerald-500' : 'bg-gray-200'
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

// ----- Step 1: Direction -----
function StepDirection({
  direction, setDirection, error,
}: {
  direction: Direction | null
  setDirection: (d: Direction) => void
  error?: string
}) {
  const options: Array<{ id: Direction; from: string; to: string; address: string; distance: number }> = [
    {
      id: 'ida',
      from: ROUTE_INFO.origin.name,
      to: ROUTE_INFO.destination.name,
      address: `${ROUTE_INFO.origin.address}`,
      distance: ROUTE_INFO.distances.ida,
    },
    {
      id: 'vuelta',
      from: ROUTE_INFO.destination.name,
      to: ROUTE_INFO.origin.name,
      address: `${ROUTE_INFO.destination.address}`,
      distance: ROUTE_INFO.distances.vuelta,
    },
  ]
  return (
    <section className="card animate-slide-up">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">¿A dónde viajas?</h2>
        <p className="text-gray-500 mt-1">Selecciona el sentido de tu viaje en la ruta {ROUTE_INFO.code}.</p>
      </header>
      <div className="grid md:grid-cols-2 gap-4">
        {options.map((opt) => {
          const selected = direction === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setDirection(opt.id)}
              className={cn(
                'group relative text-left p-5 rounded-2xl border-2 transition-all duration-300',
                selected
                  ? 'border-primary-500 bg-primary-50/60 shadow-lg shadow-primary-500/10 -translate-y-0.5'
                  : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-gray-50'
              )}
            >
              {selected && (
                <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center shadow">
                  <Check className="w-4 h-4" />
                </span>
              )}
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-600 mb-3">
                <Bus className="w-4 h-4" /> {ROUTE_INFO.code}
              </div>
              <div className="flex items-center gap-3 text-gray-900 mb-3">
                <span className="text-xl font-bold">{opt.from}</span>
                <ArrowRight className="w-5 h-5 text-primary-500" />
                <span className="text-xl font-bold">{opt.to}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-500 mb-4">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Salida: {opt.address}</span>
              </div>
              <div className="flex items-center gap-4 pt-3 border-t border-gray-100 text-sm">
                <span className="inline-flex items-center gap-1.5 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <strong>{opt.distance} km</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <strong>~{ROUTE_INFO.schedule.estimatedDuration} min</strong>
                </span>
              </div>
            </button>
          )
        })}
      </div>
      {error && <ErrorLine>{error}</ErrorLine>}
    </section>
  )
}

// ----- Step 2: Date + Time -----
function StepDateTime({
  date, setDate, time, setTime, fareType, setFareType, timeSlots, errors,
}: {
  date: string
  setDate: (s: string) => void
  time: string
  setTime: (s: string) => void
  fareType: FareType
  setFareType: (f: FareType) => void
  timeSlots: string[]
  errors: Record<string, string>
}) {
  return (
    <div className="space-y-6 animate-slide-up">
      <section className="card">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary-600" />
          Fecha del viaje
        </h2>
        <p className="text-gray-500 mt-1 mb-4">Puedes reservar hasta con 7 días de anticipación.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">Fecha</label>
            <input
              id="date"
              type="date"
              className="input"
              value={date}
              min={getTodayString()}
              max={getMaxDateString()}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && <ErrorLine>{errors.date}</ErrorLine>}
            <p className="mt-2 text-xs text-gray-500">{formatDateLabel(date)}</p>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-6 h-6 text-primary-600" />
          Horario de salida
        </h2>
        <p className="text-gray-500 mt-1 mb-4">
          Servicio cada 10 minutos de {ROUTE_INFO.schedule.firstDeparture} a {ROUTE_INFO.schedule.lastDeparture}.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {timeSlots.map((slot) => {
            const selected = time === slot
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={cn(
                  'px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all',
                  selected
                    ? 'border-primary-500 bg-primary-600 text-white shadow-md shadow-primary-500/30 scale-105'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50'
                )}
              >
                {slot}
              </button>
            )
          })}
        </div>
        {errors.time && <ErrorLine>{errors.time}</ErrorLine>}
      </section>

      <section className="card">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Wallet className="w-6 h-6 text-primary-600" />
          Tipo de tarifa
        </h2>
        <p className="text-gray-500 mt-1 mb-4">Selecciona la tarifa que corresponda a tu condición.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {FARE_OPTIONS.map((opt) => {
            const selected = fareType === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFareType(opt.id)}
                className={cn(
                  'flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left',
                  selected
                    ? 'border-primary-500 bg-primary-50/60 shadow-md'
                    : 'border-gray-200 bg-white hover:border-primary-300'
                )}
              >
                <div>
                  <div className="font-semibold text-gray-900">{opt.label}</div>
                  <div className="text-xs text-gray-500">{opt.description}</div>
                </div>
                <div className={cn(
                  'text-xl font-bold',
                  selected ? 'text-primary-600' : 'text-gray-700'
                )}>
                  {formatCurrency(opt.price)}
                </div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

// ----- Step 3: Passenger -----
function StepPassenger({
  name, setName, dni, setDni, phone, setPhone, errors,
}: {
  name: string
  setName: (s: string) => void
  dni: string
  setDni: (s: string) => void
  phone: string
  setPhone: (s: string) => void
  errors: Record<string, string>
}) {
  return (
    <section className="card animate-slide-up">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="w-6 h-6 text-primary-600" />
          Datos del pasajero
        </h2>
        <p className="text-gray-500 mt-1">
          Estos datos se imprimirán en tu boleto y son obligatorios para el manifiesto del vehículo.
        </p>
      </header>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre completo <span className="text-primary-600">*</span>
          </label>
          <div className="relative">
            <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              id="name"
              type="text"
              className="input pl-11"
              placeholder="Ej: María García López"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          {errors.name && <ErrorLine>{errors.name}</ErrorLine>}
        </div>

        <div>
          <label htmlFor="dni" className="block text-sm font-semibold text-gray-700 mb-2">
            DNI <span className="text-primary-600">*</span>
          </label>
          <div className="relative">
            <CreditCard className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              id="dni"
              type="text"
              inputMode="numeric"
              maxLength={8}
              className="input pl-11 tracking-widest font-mono"
              placeholder="12345678"
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
              autoComplete="off"
            />
          </div>
          {errors.dni && <ErrorLine>{errors.dni}</ErrorLine>}
          <p className="mt-1 text-xs text-gray-500">8 dígitos. Necesario para validar la identidad al abordar.</p>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Teléfono <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <div className="relative">
            <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              maxLength={9}
              className="input pl-11 font-mono"
              placeholder="987654321"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
              autoComplete="tel"
            />
          </div>
          {errors.phone && <ErrorLine>{errors.phone}</ErrorLine>}
          <p className="mt-1 text-xs text-gray-500">Recibe tu boleto por WhatsApp.</p>
        </div>
      </div>
    </section>
  )
}

// ----- Step 4: Payment -----
function StepPayment({
  paymentMethod, setPaymentMethod, acceptTerms, setAcceptTerms, errors, submitError,
}: {
  paymentMethod: PaymentMethod | null
  setPaymentMethod: (p: PaymentMethod) => void
  acceptTerms: boolean
  setAcceptTerms: (b: boolean) => void
  errors: Record<string, string>
  submitError: string | null
}) {
  return (
    <div className="space-y-6 animate-slide-up">
      <section className="card">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary-600" />
            Método de pago
          </h2>
          <p className="text-gray-500 mt-1">Elige cómo quieres pagar tu boleto.</p>
        </header>

        <div className="grid sm:grid-cols-2 gap-3">
          {PAYMENT_OPTIONS.map((opt) => {
            const selected = paymentMethod === opt.id
            const { Icon } = opt
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPaymentMethod(opt.id)}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left',
                  selected
                    ? `border-primary-500 ${opt.bg} shadow-md`
                    : `border-gray-200 bg-white hover:${opt.border}`
                )}
              >
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', opt.bg)}>
                  <Icon className={cn('w-6 h-6', opt.color)} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">{opt.label}</div>
                  <div className="text-xs text-gray-500">{opt.description}</div>
                </div>
                {selected && (
                  <CheckCircle2 className="w-6 h-6 text-primary-600 shrink-0" />
                )}
              </button>
            )
          })}
        </div>
        {errors.payment && <ErrorLine>{errors.payment}</ErrorLine>}
      </section>

      <section className="card">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 shrink-0"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />
          <span className="text-sm text-gray-700">
            Acepto los <Link href="#" className="text-primary-600 font-semibold hover:underline">Términos y Condiciones</Link> y la
            <Link href="#" className="text-primary-600 font-semibold hover:underline ml-1">Política de Privacidad</Link> de {APP_CONFIG.name}.
            Confirmo que los datos del pasajero son verídicos.
          </span>
        </label>
        {errors.terms && <ErrorLine>{errors.terms}</ErrorLine>}
      </section>

      {submitError && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-900">No se pudo guardar el boleto</p>
            <p className="text-sm text-red-800 mt-0.5">{submitError}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ----- Step 5: Success -----
function StepSuccess({
  ticket, qrDataUrl, directionLabel, date, time,
  onDownload, onShare, onReset, showConfetti, supabaseReady,
}: {
  ticket: DBTicket
  qrDataUrl: string
  directionLabel: string
  date: string
  time: string
  onDownload: () => void
  onShare: () => void
  onReset: () => void
  showConfetti: boolean
  supabaseReady: boolean
}) {
  return (
    <div className="relative">
      {/* Confetti dots */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden -m-8" aria-hidden>
          {Array.from({ length: 24 }).map((_, i) => {
            const colors = ['#DC2626', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']
            const color = colors[i % colors.length]
            const left = (i * 4.2 + Math.random() * 4) % 100
            const delay = Math.random() * 0.6
            const duration = 1.5 + Math.random() * 1.2
            return (
              <span
                key={i}
                style={{
                  left: `${left}%`,
                  background: color,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
                className="absolute -top-4 w-2.5 h-3.5 rounded-sm opacity-80 confetti-piece"
              />
            )
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(700px) rotate(720deg); opacity: 0; }
        }
        .confetti-piece { animation: confetti-fall linear forwards; }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pop-in { animation: pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>

      <div className="card border-2 border-emerald-200 bg-gradient-to-br from-white via-emerald-50/40 to-white animate-slide-up">
        {/* Big check */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="pop-in w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 mb-4">
            <CheckCircle2 className="w-12 h-12" strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">¡Boleto confirmado!</h2>
          <p className="text-gray-600 mt-2 max-w-md">
            {supabaseReady
              ? 'Tu boleto fue registrado en la base de datos. Muéstralo al abordar.'
              : 'Tu boleto fue generado en modo demo. Puedes escanearlo para verificar.'}
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Activo
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* QR */}
          <div className="bg-white rounded-2xl border-2 border-dashed border-primary-200 p-5 flex flex-col items-center justify-center">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt={`QR del boleto ${ticket.qr_code}`}
                className="w-full max-w-[280px] h-auto rounded-xl"
              />
            ) : (
              <div className="w-[280px] h-[280px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            )}
            <p className="mt-4 text-center text-sm font-bold text-gray-900 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-primary-600" />
              Mostrar este QR al abordar
            </p>
            <p className="mt-1 text-center text-xs text-gray-500 max-w-[260px]">
              El conductor escaneará este código en su app para registrar tu acceso.
            </p>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <DetailRow label="Código del boleto" value={ticket.qr_code} mono highlight />
            <DetailRow label="Pasajero" value={ticket.passenger_name} />
            <DetailRow label="DNI" value={ticket.passenger_dni} mono />
            <DetailRow label="Ruta" value={directionLabel} />
            <DetailRow label="Fecha" value={formatDateLabel(date)} />
            <DetailRow label="Hora de salida" value={time} mono />
            <DetailRow label="Tarifa" value={formatCurrency(ticket.fare)} />
            <DetailRow label="Pago" value={ticket.payment_method.toUpperCase()} />
            <DetailRow label="ID interno" value={ticket.id.slice(0, 13).toUpperCase()} mono />
          </div>
        </div>

        {/* Tip */}
        <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
          <QrCode className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900">Tip</p>
            <p className="text-sm text-blue-800">
              Pídele al conductor que abra <strong>/escanear</strong> en su teléfono y apunte al QR para registrar tu abordaje en tiempo real.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <button type="button" onClick={onDownload} className="btn-primary">
            <Download className="w-4 h-4" /> Descargar QR
          </button>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary-900 text-white font-semibold rounded-xl hover:bg-secondary-800 transition"
          >
            <Share2 className="w-4 h-4" /> Compartir
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary-600 text-primary-600 font-semibold rounded-xl hover:bg-primary-600 hover:text-white transition"
          >
            <ArrowRight className="w-4 h-4" /> Comprar otro
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailRow({
  label, value, mono, highlight,
}: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div className={cn(
      'flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl border',
      highlight ? 'bg-primary-50 border-primary-200' : 'bg-white border-gray-100'
    )}>
      <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold shrink-0">{label}</span>
      <span className={cn(
        'text-right font-semibold truncate',
        mono && 'font-mono',
        highlight ? 'text-primary-700' : 'text-gray-900'
      )}>
        {value}
      </span>
    </div>
  )
}

// ----- Right sidebar summary -----
function SummaryCard({
  directionLabel, distanceKm, date, time, fareType, fare,
  passengerName, passengerDni, paymentMethod,
}: {
  directionLabel: string
  distanceKm: number
  date: string
  time: string
  fareType: FareType
  fare: number
  passengerName: string
  passengerDni: string
  paymentMethod: PaymentMethod | null
}) {
  const fareLabel = FARE_OPTIONS.find((f) => f.id === fareType)?.label ?? 'Regular'
  const paymentLabel = paymentMethod
    ? PAYMENT_OPTIONS.find((p) => p.id === paymentMethod)?.label ?? '—'
    : '—'
  return (
    <div className="card border-2 border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
          <Bus className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Resumen</h3>
      </div>

      <div className="space-y-3 text-sm">
        <SummaryRow Icon={MapPin} label="Ruta" value={directionLabel || 'Por seleccionar'} />
        <SummaryRow Icon={MapPin} label="Distancia" value={distanceKm ? `${distanceKm} km` : '—'} />
        <SummaryRow Icon={Calendar} label="Fecha" value={date ? formatDateLabel(date) : 'Por seleccionar'} />
        <SummaryRow Icon={Clock} label="Hora" value={time || 'Por seleccionar'} />
        <SummaryRow Icon={Wallet} label="Tarifa" value={fareLabel} />
        <SummaryRow Icon={User} label="Pasajero" value={passengerName || 'Por completar'} />
        <SummaryRow Icon={CreditCard} label="DNI" value={passengerDni || '—'} mono />
        <SummaryRow Icon={CreditCard} label="Pago" value={paymentLabel} />
      </div>

      <div className="mt-5 pt-5 border-t border-dashed border-gray-200 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Total</span>
        <span className="text-3xl font-bold text-primary-600">{formatCurrency(fare)}</span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        Boleto digital con QR escaneable
      </div>
    </div>
  )
}

function SummaryRow({
  Icon, label, value, mono,
}: { Icon: typeof MapPin; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="flex items-center gap-1.5 text-gray-500 shrink-0">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
      <span className={cn(
        'text-right text-gray-900 font-medium truncate',
        mono && 'font-mono'
      )}>
        {value}
      </span>
    </div>
  )
}

function ErrorLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5 animate-fade-in">
      <AlertCircle className="w-4 h-4" />
      {children}
    </p>
  )
}
