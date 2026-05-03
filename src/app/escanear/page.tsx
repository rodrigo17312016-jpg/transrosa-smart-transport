'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  QrCode,
  Camera,
  CameraOff,
  ScanLine,
  Check,
  X,
  AlertTriangle,
  MapPin,
  ArrowLeft,
  RotateCcw,
  Bus,
  User,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Calendar,
  Flashlight,
  Settings,
} from 'lucide-react'
import { createClient, isSupabaseConfigured, type DBTicket, type DBVehicle } from '@/lib/supabase/client'
import { cn, formatDateTime } from '@/lib/utils'

// ============================================================
// Types
// ============================================================

type Terminal = 'vegueta' | 'huacho'

type ResultStatus = 'success' | 'used' | 'invalid' | 'unknown'

interface ScanResult {
  status: ResultStatus
  ticket?: DBTicket
  message: string
  detail?: string
  scannedAt: string
}

interface RecentScan {
  id: string
  passengerName: string
  status: ResultStatus
  time: string
}

// ============================================================
// Helpers
// ============================================================

function getStorageKey(key: string) {
  return `transrosa-scanner-${key}`
}

function readStorage(key: string): string {
  if (typeof window === 'undefined') return ''
  try {
    return window.localStorage.getItem(getStorageKey(key)) ?? ''
  } catch {
    return ''
  }
}

function writeStorage(key: string, value: string) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(getStorageKey(key), value)
  } catch {
    /* ignore */
  }
}

function formatTimeShort(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function todayDateString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function playBeep() {
  try {
    const AudioCtx =
      (typeof window !== 'undefined' &&
        ((window as unknown as { AudioContext?: typeof AudioContext }).AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)) ||
      null
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12)
    gain.gain.setValueAtTime(0.18, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.2)
  } catch {
    /* ignore */
  }
}

function playError() {
  try {
    const AudioCtx =
      (typeof window !== 'undefined' &&
        ((window as unknown as { AudioContext?: typeof AudioContext }).AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)) ||
      null
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, ctx.currentTime)
    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.32)
  } catch {
    /* ignore */
  }
}

function vibrate(pattern: number | number[]) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  } catch {
    /* ignore */
  }
}

// ============================================================
// Component
// ============================================================

export default function EscanearPage() {
  // Configuration state
  const [vehicles, setVehicles] = useState<DBVehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState('')
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal>('vegueta')
  const [demoMode, setDemoMode] = useState(false)

  // Scanner state
  const [scanning, setScanning] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [browserSupported, setBrowserSupported] = useState(true)
  const [torchOn, setTorchOn] = useState(false)
  const [torchAvailable, setTorchAvailable] = useState(false)

  // Scan result state
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null)
  const [recentScans, setRecentScans] = useState<RecentScan[]>([])

  // Stats
  const [todayCount, setTodayCount] = useState(0)
  const [verifiedCount, setVerifiedCount] = useState(0)

  // Scanner ref + locks
  const scannerRef = useRef<unknown | null>(null)
  const processingRef = useRef(false)
  const lastScanRef = useRef<{ code: string; ts: number }>({ code: '', ts: 0 })
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ----------------------------------------------------------
  // Initial mount: load config + check browser support
  // ----------------------------------------------------------
  useEffect(() => {
    // Check browser support for camera
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== 'function'
    ) {
      setBrowserSupported(false)
    }

    // Check Supabase
    if (!isSupabaseConfigured()) {
      setDemoMode(true)
    }

    // Restore from localStorage
    const savedVehicle = readStorage('vehicle')
    const savedTerminal = readStorage('terminal') as Terminal
    if (savedVehicle) setSelectedVehicle(savedVehicle)
    if (savedTerminal === 'vegueta' || savedTerminal === 'huacho') {
      setSelectedTerminal(savedTerminal)
    }
  }, [])

  // ----------------------------------------------------------
  // Persist config
  // ----------------------------------------------------------
  useEffect(() => {
    writeStorage('vehicle', selectedVehicle)
  }, [selectedVehicle])

  useEffect(() => {
    writeStorage('terminal', selectedTerminal)
  }, [selectedTerminal])

  // ----------------------------------------------------------
  // Load vehicles list
  // ----------------------------------------------------------
  useEffect(() => {
    if (!isSupabaseConfigured()) return

    const loadVehicles = async () => {
      try {
        const supabase = createClient()
        const { data, error: err } = await supabase
          .from('tr_vehicles')
          .select('*')
          .order('internal_number', { ascending: true })
        if (err) throw err
        setVehicles((data ?? []) as DBVehicle[])
      } catch (e) {
        console.error('Error loading vehicles', e)
      }
    }

    loadVehicles()
  }, [])

  // ----------------------------------------------------------
  // Load stats (today's check-ins)
  // ----------------------------------------------------------
  const loadStats = async () => {
    if (!isSupabaseConfigured()) return
    try {
      const supabase = createClient()
      const startOfDay = `${todayDateString()}T00:00:00`

      // Total today
      const { count: total } = await supabase
        .from('tr_check_ins')
        .select('id', { count: 'exact', head: true })
        .gte('check_in_time', startOfDay)
      setTodayCount(total ?? 0)

      // Verified (filtered by selected vehicle if any)
      let verifiedQuery = supabase
        .from('tr_check_ins')
        .select('id', { count: 'exact', head: true })
        .gte('check_in_time', startOfDay)
        .eq('identity_verified', true)
      if (selectedVehicle) {
        verifiedQuery = verifiedQuery.eq('vehicle_plate', selectedVehicle)
      }
      const { count: verified } = await verifiedQuery
      setVerifiedCount(verified ?? 0)
    } catch (e) {
      console.error('Error loading stats', e)
    }
  }

  useEffect(() => {
    loadStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVehicle])

  // ----------------------------------------------------------
  // Scanner lifecycle
  // ----------------------------------------------------------
  useEffect(() => {
    if (!scanning) return

    let cancelled = false
    let scanner: {
      start: (
        constraints: { facingMode: string },
        config: { fps: number; qrbox: { width: number; height: number } },
        onSuccess: (decodedText: string) => Promise<void>,
        onError: () => void
      ) => Promise<void>
      stop: () => Promise<void>
      clear: () => void
      pause: (shouldPause: boolean) => void
      resume: () => void
      applyVideoConstraints: (constraints: MediaTrackConstraints) => Promise<void>
      getRunningTrackCameraCapabilities?: () => { torchFeature?: () => { isSupported: () => boolean } }
    } | null = null

    const startScanner = async () => {
      try {
        const mod = await import('html5-qrcode')
        if (cancelled) return
        const Html5QrcodeCtor = mod.Html5Qrcode
        scanner = new Html5QrcodeCtor('qr-reader') as unknown as typeof scanner
        scannerRef.current = scanner

        await scanner!.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText: string) => {
            if (processingRef.current) return
            // Debounce same-code scans within 2.5 seconds
            const now = Date.now()
            if (
              lastScanRef.current.code === decodedText &&
              now - lastScanRef.current.ts < 2500
            ) {
              return
            }
            lastScanRef.current = { code: decodedText, ts: now }
            processingRef.current = true
            try {
              if (scanner) {
                try {
                  scanner.pause(true)
                } catch {
                  /* ignore */
                }
              }
              await handleScan(decodedText)
            } finally {
              processingRef.current = false
            }
          },
          () => {
            /* per-frame errors are noisy, ignore */
          }
        )

        if (cancelled) {
          try {
            await scanner!.stop()
            scanner!.clear()
          } catch {
            /* ignore */
          }
          return
        }

        setCameraReady(true)
        setError(null)

        // Detect torch capability (best-effort, browser-dependent)
        try {
          const stream = (document.querySelector('#qr-reader video') as HTMLVideoElement | null)
            ?.srcObject as MediaStream | null
          const track = stream?.getVideoTracks?.()[0]
          if (track) {
            const capabilities = track.getCapabilities?.() as
              | (MediaTrackCapabilities & { torch?: boolean })
              | undefined
            if (capabilities && 'torch' in capabilities && capabilities.torch) {
              setTorchAvailable(true)
            }
          }
        } catch {
          /* ignore */
        }
      } catch (err) {
        console.error('Scanner start error:', err)
        if (!cancelled) {
          setCameraReady(false)
          const msg =
            err instanceof Error
              ? err.message.toLowerCase().includes('permission') ||
                err.message.toLowerCase().includes('denied') ||
                err.message.toLowerCase().includes('notallowed')
                ? 'permission'
                : 'unknown'
              : 'unknown'
          setError(
            msg === 'permission'
              ? 'Activa la cámara para escanear. Revisa los permisos del navegador.'
              : 'No se pudo acceder a la cámara. Verifica que esté disponible.'
          )
        }
      }
    }

    startScanner()

    return () => {
      cancelled = true
      const s = scanner
      if (s) {
        s
          .stop()
          .then(() => {
            try {
              s.clear()
            } catch {
              /* ignore */
            }
          })
          .catch(() => {
            try {
              s.clear()
            } catch {
              /* ignore */
            }
          })
      }
      scannerRef.current = null
      setCameraReady(false)
      setTorchOn(false)
      setTorchAvailable(false)
    }
  }, [scanning])

  // Cleanup auto-clear timer on unmount
  useEffect(() => {
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current)
    }
  }, [])

  // ----------------------------------------------------------
  // Toggle torch
  // ----------------------------------------------------------
  const toggleTorch = async () => {
    if (!torchAvailable) return
    try {
      const stream = (document.querySelector('#qr-reader video') as HTMLVideoElement | null)
        ?.srcObject as MediaStream | null
      const track = stream?.getVideoTracks?.()[0]
      if (!track) return
      const next = !torchOn
      // @ts-expect-error torch is non-standard but supported on many mobile browsers
      await track.applyConstraints({ advanced: [{ torch: next }] })
      setTorchOn(next)
    } catch (e) {
      console.error('Torch toggle failed', e)
    }
  }

  // ----------------------------------------------------------
  // Resume scanner after a result is shown
  // ----------------------------------------------------------
  const resumeAfterDelay = (ms: number) => {
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current)
    clearTimerRef.current = setTimeout(() => {
      setCurrentResult(null)
      const s = scannerRef.current as
        | { resume: () => void; getState?: () => number }
        | null
      if (s && scanning) {
        try {
          s.resume()
        } catch {
          /* ignore */
        }
      }
    }, ms)
  }

  // ----------------------------------------------------------
  // Add to recent scans
  // ----------------------------------------------------------
  const addRecentScan = (passengerName: string, status: ResultStatus) => {
    const newScan: RecentScan = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      passengerName,
      status,
      time: new Date().toISOString(),
    }
    setRecentScans((prev) => [newScan, ...prev].slice(0, 5))
  }

  // ----------------------------------------------------------
  // Handle a successful QR decode
  // ----------------------------------------------------------
  const handleScan = async (decodedText: string) => {
    const code = decodedText.trim()

    // Demo mode: don't hit DB
    if (!isSupabaseConfigured()) {
      const result: ScanResult = {
        status: 'unknown',
        message: 'QR NO RECONOCIDO',
        detail: 'Modo demo: los escaneos no se guardan en la base de datos.',
        scannedAt: new Date().toISOString(),
      }
      setCurrentResult(result)
      addRecentScan(code.slice(0, 18), 'unknown')
      playError()
      vibrate([60, 60, 60])
      resumeAfterDelay(3000)
      return
    }

    try {
      const supabase = createClient()
      const { data: ticket, error: queryErr } = await supabase
        .from('tr_tickets')
        .select('*')
        .eq('qr_code', code)
        .maybeSingle()

      if (queryErr) {
        const result: ScanResult = {
          status: 'unknown',
          message: 'ERROR DE CONEXIÓN',
          detail: queryErr.message,
          scannedAt: new Date().toISOString(),
        }
        setCurrentResult(result)
        playError()
        vibrate([100, 60, 100])
        resumeAfterDelay(3500)
        return
      }

      if (!ticket) {
        const result: ScanResult = {
          status: 'unknown',
          message: 'QR NO RECONOCIDO',
          detail: 'Este código no es un boleto válido de TransRosa',
          scannedAt: new Date().toISOString(),
        }
        setCurrentResult(result)
        addRecentScan(code.slice(0, 18), 'unknown')
        playError()
        vibrate([60, 60, 60])
        resumeAfterDelay(3000)
        return
      }

      const t = ticket as DBTicket

      // Already used
      if (t.status === 'used') {
        const result: ScanResult = {
          status: 'used',
          ticket: t,
          message: 'BOLETO YA USADO',
          detail: t.used_at ? `Usado: ${formatDateTime(t.used_at)}` : 'Este boleto ya fue utilizado',
          scannedAt: new Date().toISOString(),
        }
        setCurrentResult(result)
        addRecentScan(t.passenger_name, 'used')
        playError()
        vibrate([100, 60, 100, 60, 100])
        resumeAfterDelay(3500)
        return
      }

      // Cancelled / expired
      if (t.status === 'cancelled' || t.status === 'expired') {
        const result: ScanResult = {
          status: 'invalid',
          ticket: t,
          message: 'BOLETO INVÁLIDO',
          detail: t.status === 'cancelled' ? 'El boleto fue cancelado' : 'El boleto ha expirado',
          scannedAt: new Date().toISOString(),
        }
        setCurrentResult(result)
        addRecentScan(t.passenger_name, 'invalid')
        playError()
        vibrate([100, 80, 100])
        resumeAfterDelay(3500)
        return
      }

      // Active ticket: check in!
      if (t.status === 'active') {
        const checkInPayload = {
          ticket_id: t.id,
          passenger_name: t.passenger_name,
          passenger_dni: t.passenger_dni,
          passenger_phone: t.passenger_phone,
          vehicle_plate: selectedVehicle || null,
          method: 'qr_code' as const,
          terminal: selectedTerminal,
          identity_verified: true,
          status: 'boarded' as const,
        }

        const { error: checkInErr } = await supabase.from('tr_check_ins').insert(checkInPayload)
        if (checkInErr) {
          const result: ScanResult = {
            status: 'unknown',
            ticket: t,
            message: 'ERROR AL REGISTRAR',
            detail: checkInErr.message,
            scannedAt: new Date().toISOString(),
          }
          setCurrentResult(result)
          playError()
          vibrate([100, 60, 100])
          resumeAfterDelay(3500)
          return
        }

        // Update ticket status to 'used'
        const { error: updateErr } = await supabase
          .from('tr_tickets')
          .update({ status: 'used', used_at: new Date().toISOString() })
          .eq('id', t.id)

        if (updateErr) {
          console.error('Failed to mark ticket as used:', updateErr)
        }

        const result: ScanResult = {
          status: 'success',
          ticket: t,
          message: 'ABORDADO',
          detail: 'Pasajero verificado correctamente',
          scannedAt: new Date().toISOString(),
        }
        setCurrentResult(result)
        addRecentScan(t.passenger_name, 'success')
        playBeep()
        vibrate([120])
        loadStats()
        resumeAfterDelay(3000)
        return
      }

      // Fallback for unknown status
      const result: ScanResult = {
        status: 'invalid',
        ticket: t,
        message: 'ESTADO DESCONOCIDO',
        detail: `Estado: ${t.status}`,
        scannedAt: new Date().toISOString(),
      }
      setCurrentResult(result)
      playError()
      vibrate([100])
      resumeAfterDelay(3000)
    } catch (e) {
      console.error('handleScan error', e)
      const result: ScanResult = {
        status: 'unknown',
        message: 'ERROR INESPERADO',
        detail: e instanceof Error ? e.message : 'Error desconocido',
        scannedAt: new Date().toISOString(),
      }
      setCurrentResult(result)
      playError()
      vibrate([100, 60, 100])
      resumeAfterDelay(3500)
    }
  }

  // ----------------------------------------------------------
  // UI handlers
  // ----------------------------------------------------------
  const startScanning = () => {
    setError(null)
    setCurrentResult(null)
    setScanning(true)
  }

  const stopScanning = () => {
    setScanning(false)
    setCurrentResult(null)
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current)
  }

  // ----------------------------------------------------------
  // Result styles
  // ----------------------------------------------------------
  const resultBg: Record<ResultStatus, string> = {
    success: 'bg-emerald-500/95 border-emerald-300',
    used: 'bg-red-500/95 border-red-300',
    invalid: 'bg-amber-500/95 border-amber-300',
    unknown: 'bg-gray-700/95 border-gray-500',
  }

  const flashOverlay: Record<ResultStatus, string> = {
    success: 'bg-emerald-400/30',
    used: 'bg-red-500/30',
    invalid: 'bg-amber-400/30',
    unknown: 'bg-gray-700/40',
  }

  const ResultIcon = ({ status }: { status: ResultStatus }) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={2.5} />
      case 'used':
        return <X className="w-16 h-16 text-white" strokeWidth={3} />
      case 'invalid':
        return <AlertTriangle className="w-16 h-16 text-white" strokeWidth={2.5} />
      default:
        return <QrCode className="w-16 h-16 text-white" strokeWidth={2} />
    }
  }

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-11 h-11 rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-colors"
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-primary-400" />
            <h1 className="text-lg font-bold">Escáner de Boletos</h1>
          </div>
          <button
            onClick={toggleTorch}
            disabled={!torchAvailable || !scanning}
            className={cn(
              'flex items-center justify-center w-11 h-11 rounded-xl transition-colors',
              torchAvailable && scanning
                ? torchOn
                  ? 'bg-amber-500 text-gray-900 hover:bg-amber-400'
                  : 'hover:bg-gray-800 active:bg-gray-700'
                : 'opacity-30 cursor-not-allowed'
            )}
            aria-label="Linterna"
          >
            <Flashlight className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pb-8">
        {/* ===== Demo banner ===== */}
        {demoMode && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-start gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-amber-300">Modo demo</p>
              <p className="text-amber-200/80 text-xs">
                Supabase no está configurado: los escaneos no se guardarán.
              </p>
            </div>
          </div>
        )}

        {/* ===== Stats ===== */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gray-900 border border-gray-800 p-4">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <User className="w-3.5 h-3.5" />
              <span>Hoy abordaron</span>
            </div>
            <p className="text-2xl font-black">
              {todayCount} <span className="text-xs font-medium text-gray-400">pasajeros</span>
            </p>
          </div>
          <div className="rounded-2xl bg-gray-900 border border-gray-800 p-4">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verificados</span>
            </div>
            <p className="text-2xl font-black text-emerald-400">
              {verifiedCount}
              <span className="text-xs font-medium text-gray-400 ml-1">
                {selectedVehicle ? `(${selectedVehicle})` : ''}
              </span>
            </p>
          </div>
        </div>

        {/* ===== Vehicle / Terminal selectors ===== */}
        <div className="mt-4 rounded-2xl bg-gray-900 border border-gray-800 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <Settings className="w-3.5 h-3.5" />
            Configuración
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5" />
                Vehículo
              </span>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full min-h-[48px] px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
              >
                <option value="">— Sin asignar —</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.plate_number}>
                    {v.plate_number} · #{v.internal_number}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-gray-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Terminal
              </span>
              <select
                value={selectedTerminal}
                onChange={(e) => setSelectedTerminal(e.target.value as Terminal)}
                className="w-full min-h-[48px] px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500"
              >
                <option value="vegueta">Vegueta</option>
                <option value="huacho">Huacho</option>
              </select>
            </label>
          </div>
        </div>

        {/* ===== Camera viewport ===== */}
        <div className="mt-4 relative aspect-square w-full rounded-3xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
          {/* The html5-qrcode element */}
          <div
            id="qr-reader"
            className={cn(
              'absolute inset-0 w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover',
              !scanning && 'hidden'
            )}
          />

          {/* Initial / idle overlay */}
          {!scanning && !browserSupported && (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center bg-gray-900">
              <CameraOff className="w-16 h-16 text-gray-600 mb-4" />
              <p className="font-bold text-lg mb-2">Navegador no compatible</p>
              <p className="text-sm text-gray-400">
                Tu navegador no soporta acceso a cámara. Usa Chrome o Safari en móvil.
              </p>
            </div>
          )}

          {!scanning && browserSupported && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary-600/20 border border-primary-500/40 flex items-center justify-center mb-5">
                <QrCode className="w-10 h-10 text-primary-400" />
              </div>
              <p className="font-bold text-lg mb-1">Listo para escanear</p>
              <p className="text-sm text-gray-400 mb-6 max-w-xs">
                Apunta la cámara al código QR del boleto
              </p>
              <button
                onClick={startScanning}
                className="inline-flex items-center justify-center gap-2 px-8 min-h-[56px] bg-primary-600 hover:bg-primary-500 active:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-600/30 transition-colors"
              >
                <Camera className="w-5 h-5" />
                Iniciar Escáner
              </button>
            </div>
          )}

          {!scanning && error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <CameraOff className="w-16 h-16 text-red-400 mb-4" />
              <p className="font-bold text-lg mb-2">Cámara bloqueada</p>
              <p className="text-sm text-gray-400 mb-5">{error}</p>
              <button
                onClick={startScanning}
                className="inline-flex items-center justify-center gap-2 px-6 min-h-[48px] bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Intentar de nuevo
              </button>
            </div>
          )}

          {/* Scanning overlay (frame + animated line) */}
          {scanning && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Dim overlay outside the box */}
              <div className="absolute inset-0 bg-black/40" />
              {/* Centered scan box */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-2/3 max-w-[260px] aspect-square">
                  {/* Cutout (transparent area) — created via box-shadow trick */}
                  <div className="absolute inset-0 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]" />
                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-primary-400 rounded-tl-2xl" />
                  <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-primary-400 rounded-tr-2xl" />
                  <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-primary-400 rounded-bl-2xl" />
                  <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-primary-400 rounded-br-2xl" />
                  {/* Animated scan line */}
                  <div className="absolute inset-x-2 top-0 h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent shadow-[0_0_12px_rgba(248,113,113,0.8)] animate-scan-line" />
                </div>
              </div>

              {/* Top status pill */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-700 flex items-center gap-2 text-xs font-semibold pointer-events-none">
                {cameraReady ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Buscando QR...</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Iniciando cámara...</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Result overlay (covers camera) */}
          {currentResult && scanning && (
            <>
              {/* Flash */}
              <div className={cn('absolute inset-0 animate-flash pointer-events-none', flashOverlay[currentResult.status])} />
              {/* Centered card */}
              <div className="absolute inset-0 flex items-center justify-center p-4 animate-fade-in">
                <div
                  className={cn(
                    'w-full max-w-sm rounded-3xl border-2 backdrop-blur-md p-6 text-center shadow-2xl',
                    resultBg[currentResult.status]
                  )}
                >
                  <div className="mx-auto w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-3">
                    <ResultIcon status={currentResult.status} />
                  </div>
                  <p className="text-2xl font-black tracking-wide mb-1">{currentResult.message}</p>
                  {currentResult.detail && (
                    <p className="text-sm text-white/90 mb-3">{currentResult.detail}</p>
                  )}
                  {currentResult.ticket && (
                    <div className="mt-4 rounded-2xl bg-black/25 p-3 text-left text-sm space-y-1.5">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 opacity-80" />
                        <span className="font-bold">{currentResult.ticket.passenger_name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-white/90">
                        <div>
                          <span className="opacity-70">DNI:</span>{' '}
                          <span className="font-mono font-semibold">
                            {currentResult.ticket.passenger_dni}
                          </span>
                        </div>
                        <div>
                          <span className="opacity-70">Tarifa:</span>{' '}
                          <span className="font-bold">
                            S/ {Number(currentResult.ticket.fare).toFixed(2)}
                          </span>
                        </div>
                        <div className="col-span-2 flex items-center gap-1">
                          <MapPin className="w-3 h-3 opacity-70" />
                          <span className="capitalize">
                            {currentResult.ticket.direction === 'ida' ? 'Ida' : 'Vuelta'}
                          </span>
                          <span className="opacity-50">·</span>
                          <Clock className="w-3 h-3 opacity-70" />
                          <span>{currentResult.ticket.departure_time}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {currentResult.status === 'success' && (
                    <span className="inline-flex items-center gap-1 mt-4 px-4 py-1.5 rounded-full bg-white text-emerald-700 text-xs font-black tracking-wider">
                      <Check className="w-3.5 h-3.5" />
                      ABORDADO
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ===== Cancel button ===== */}
        {scanning && (
          <button
            onClick={stopScanning}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 min-h-[52px] bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold rounded-2xl transition-colors"
          >
            <X className="w-5 h-5" />
            Cancelar
          </button>
        )}

        {/* ===== Recent scans ===== */}
        <div className="mt-6 rounded-2xl bg-gray-900 border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Escaneos recientes</span>
            </div>
            <span className="text-xs text-gray-500">{recentScans.length} de 5</span>
          </div>
          {recentScans.length === 0 ? (
            <div className="py-8 text-center">
              <QrCode className="w-10 h-10 text-gray-700 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Aún no se han escaneado boletos</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-800">
              {recentScans.map((scan) => {
                const dotColor =
                  scan.status === 'success'
                    ? 'bg-emerald-400'
                    : scan.status === 'used'
                    ? 'bg-red-400'
                    : scan.status === 'invalid'
                    ? 'bg-amber-400'
                    : 'bg-gray-500'
                const label =
                  scan.status === 'success'
                    ? 'Abordado'
                    : scan.status === 'used'
                    ? 'Ya usado'
                    : scan.status === 'invalid'
                    ? 'Inválido'
                    : 'No reconocido'
                return (
                  <li key={scan.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', dotColor)} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{scan.passengerName}</p>
                        <p className="text-[11px] text-gray-500">{label}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono shrink-0">
                      {formatTimeShort(scan.time)}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* ===== Help footer ===== */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Mantén el código QR dentro del recuadro. El escaneo es automático.
        </p>
      </main>

      {/* Inline component-scoped animations */}
      <style jsx global>{`
        @keyframes scan-line {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(calc(100% + 0.25rem));
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-scan-line {
          animation: scan-line 2s ease-in-out infinite;
        }

        @keyframes flash {
          0% {
            opacity: 0.85;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-flash {
          animation: flash 0.45s ease-out forwards;
        }

        /* Hide html5-qrcode default UI we don't want */
        #qr-reader__dashboard,
        #qr-reader__scan_region img,
        #qr-reader__status_span {
          display: none !important;
        }
        #qr-reader__scan_region {
          background: transparent !important;
          padding: 0 !important;
        }
        #qr-reader video {
          border-radius: 0 !important;
        }
      `}</style>
    </div>
  )
}
