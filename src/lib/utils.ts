import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return `${formatDate(date)} ${formatTime(date)}`
}

export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins} min`
  return `${hours}h ${mins}min`
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-800',
    available: 'bg-emerald-100 text-emerald-800',
    completed: 'bg-emerald-100 text-emerald-800',
    confirmed: 'bg-emerald-100 text-emerald-800',
    used: 'bg-emerald-100 text-emerald-800',
    en_route: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-blue-100 text-blue-800',
    driving: 'bg-blue-100 text-blue-800',
    boarding: 'bg-amber-100 text-amber-800',
    scheduled: 'bg-amber-100 text-amber-800',
    reserved: 'bg-amber-100 text-amber-800',
    resting: 'bg-amber-100 text-amber-800',
    maintenance: 'bg-orange-100 text-orange-800',
    preventive: 'bg-orange-100 text-orange-800',
    inactive: 'bg-gray-100 text-gray-800',
    off_duty: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    suspended: 'bg-red-100 text-red-800',
    expired: 'bg-red-100 text-red-800',
    critical: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
