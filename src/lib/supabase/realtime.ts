'use client'

import { useEffect, useState } from 'react'
import { createClient, isSupabaseConfigured, type DBCheckIn, type DBIncident, type DBSOSAlert, type DBTicket } from './client'

/**
 * Hook: subscribe to a table and get live data updates
 */
export function useLiveTable<T>(
  table: 'tr_tickets' | 'tr_check_ins' | 'tr_incidents' | 'tr_sos_alerts',
  options: { orderBy?: string; ascending?: boolean; limit?: number } = {}
): { data: T[]; loading: boolean; error: string | null; refetch: () => Promise<void> } {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!isSupabaseConfigured()) {
      setError('Supabase no configurado')
      setLoading(false)
      return
    }
    try {
      const supabase = createClient()
      let query = supabase.from(table).select('*')
      const orderColumn = options.orderBy ?? 'created_at'
      query = query.order(orderColumn, { ascending: options.ascending ?? false })
      if (options.limit) query = query.limit(options.limit)
      const { data: rows, error: err } = await query
      if (err) throw err
      setData((rows ?? []) as T[])
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      setError('Supabase no configurado')
      return
    }

    fetchData()

    const supabase = createClient()
    const channel = supabase
      .channel(`live-${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => fetchData()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table])

  return { data, loading, error, refetch: fetchData }
}

export function useLiveTickets(limit = 50) {
  return useLiveTable<DBTicket>('tr_tickets', { limit })
}

export function useLiveCheckIns(limit = 50) {
  return useLiveTable<DBCheckIn>('tr_check_ins', { orderBy: 'check_in_time', limit })
}

export function useLiveIncidents(limit = 20) {
  return useLiveTable<DBIncident>('tr_incidents', { limit })
}

export function useLiveSOSAlerts(limit = 10) {
  return useLiveTable<DBSOSAlert>('tr_sos_alerts', { orderBy: 'triggered_at', limit })
}

/**
 * Generate a unique QR code string for a ticket
 */
export function generateTicketQR(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).slice(2, 10).toUpperCase()
  return `TR-${timestamp}-${random}`
}
