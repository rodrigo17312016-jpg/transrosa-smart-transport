'use client'

import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

let cachedClient: SupabaseClient | null = null

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function isSupabaseConfigured(): boolean {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    !SUPABASE_URL.includes('placeholder')
  )
}

export function createClient(): SupabaseClient {
  if (cachedClient) return cachedClient
  if (!isSupabaseConfigured()) {
    // Return a stub that will throw if used. Pages should check isSupabaseConfigured() first.
    throw new Error('Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }
  cachedClient = createSupabaseClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: 10 } },
  })
  return cachedClient
}

// ============================================================
// Database Types (for type-safe queries)
// ============================================================

export interface DBTicket {
  id: string
  qr_code: string
  passenger_name: string
  passenger_dni: string
  passenger_phone: string | null
  fare: number
  fare_type: 'regular' | 'student' | 'senior' | 'child'
  payment_method: 'cash' | 'yape' | 'plin' | 'card' | 'transfer'
  direction: 'ida' | 'vuelta'
  departure_time: string
  status: 'active' | 'used' | 'cancelled' | 'expired'
  created_at: string
  used_at: string | null
}

export interface DBCheckIn {
  id: string
  ticket_id: string | null
  passenger_name: string
  passenger_dni: string
  passenger_phone: string | null
  passenger_photo_url: string | null
  vehicle_plate: string
  driver_name: string | null
  method: 'facial_recognition' | 'qr_code' | 'dni_scan' | 'manual'
  terminal: 'vegueta' | 'huacho'
  check_in_time: string
  identity_verified: boolean
  status: 'checked_in' | 'boarded' | 'completed' | 'no_show'
  notes: string | null
}

export interface DBIncident {
  id: string
  incident_number: string
  type: 'theft' | 'assault' | 'harassment' | 'medical_emergency' | 'vehicle_breakdown' | 'accident' | 'suspicious_behavior' | 'lost_item' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'reported' | 'investigating' | 'police_notified' | 'resolved' | 'closed'
  title: string
  description: string
  location: string
  vehicle_plate: string | null
  reporter_name: string
  reporter_phone: string | null
  reporter_role: 'driver' | 'passenger' | 'admin' | 'partner'
  estimated_loss: number | null
  police_notified: boolean
  police_report_number: string | null
  resolved_at: string | null
  created_at: string
  updated_at: string
}

export interface DBSOSAlert {
  id: string
  triggered_by: 'driver' | 'passenger' | 'admin'
  vehicle_plate: string | null
  description: string | null
  lat: number | null
  lng: number | null
  status: 'active' | 'responded' | 'resolved' | 'false_alarm'
  responder: string | null
  triggered_at: string
  responded_at: string | null
  resolved_at: string | null
}

export interface DBVehicle {
  id: string
  internal_number: number
  plate_number: string
  brand: string
  model: string
  year: number
  capacity: number
  status: 'active' | 'en_route' | 'maintenance' | 'inactive'
  partner_id: string | null
  soat_expiry: string | null
  technical_review_expiry: string | null
  odometer_km: number
  fuel_type: string
  created_at: string
}
