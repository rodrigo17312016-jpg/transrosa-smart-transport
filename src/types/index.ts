// ============================================================
// TransRosa - Type Definitions
// Empresa de Transportes Santa Rosa de Vegueta S.A.
// ============================================================

// --- Vehicle / Fleet ---
export type VehicleStatus = 'active' | 'maintenance' | 'inactive' | 'en_route'

export interface Vehicle {
  id: string
  plate_number: string
  internal_number: number
  brand: string
  model: string
  year: number
  capacity: number // 11 including driver
  status: VehicleStatus
  soat_expiry: string
  technical_review_expiry: string
  last_maintenance: string
  next_maintenance: string
  odometer_km: number
  fuel_type: 'gasoline' | 'diesel' | 'gnv'
  gps_device_id: string | null
  photo_url: string | null
  created_at: string
  updated_at: string
}

// --- Driver ---
export type DriverStatus = 'available' | 'driving' | 'resting' | 'off_duty' | 'suspended'

export interface Driver {
  id: string
  user_id: string | null
  first_name: string
  last_name: string
  dni: string
  license_number: string
  license_category: string
  license_expiry: string
  phone: string
  email: string | null
  photo_url: string | null
  status: DriverStatus
  rating: number
  total_trips: number
  hire_date: string
  emergency_contact_name: string
  emergency_contact_phone: string
  created_at: string
  updated_at: string
}

// --- Route ---
export interface Route {
  id: string
  code: string // RI-06
  name: string
  origin: string // Vegueta
  destination: string // Huacho
  origin_lat: number
  origin_lng: number
  destination_lat: number
  destination_lng: number
  distance_km: number // 21.67 ida
  return_distance_km: number // 21.48 vuelta
  estimated_duration_minutes: number
  base_fare: number
  waypoints: RouteWaypoint[]
  stops: RouteStop[]
  is_active: boolean
  created_at: string
}

export interface RouteWaypoint {
  lat: number
  lng: number
  order: number
}

export interface RouteStop {
  id: string
  name: string
  lat: number
  lng: number
  order: number
  is_terminal: boolean
  estimated_time_from_start: number // minutes
}

// --- Trip ---
export type TripStatus = 'scheduled' | 'boarding' | 'in_progress' | 'completed' | 'cancelled'

export interface Trip {
  id: string
  route_id: string
  vehicle_id: string
  driver_id: string
  direction: 'ida' | 'vuelta'
  scheduled_departure: string
  actual_departure: string | null
  scheduled_arrival: string | null
  actual_arrival: string | null
  status: TripStatus
  passenger_count: number
  revenue: number
  notes: string | null
  created_at: string
  // Joined
  vehicle?: Vehicle
  driver?: Driver
  route?: Route
}

// --- Ticket ---
export type TicketStatus = 'reserved' | 'confirmed' | 'used' | 'cancelled' | 'expired'

export interface Ticket {
  id: string
  trip_id: string
  passenger_name: string | null
  passenger_phone: string | null
  seat_number: number | null
  fare: number
  status: TicketStatus
  qr_code: string
  payment_method: 'cash' | 'yape' | 'plin' | 'card' | 'transfer'
  purchased_at: string
  used_at: string | null
  // Joined
  trip?: Trip
}

// --- GPS Tracking ---
export interface GPSPosition {
  vehicle_id: string
  lat: number
  lng: number
  speed: number // km/h
  heading: number // degrees
  timestamp: string
  trip_id: string | null
}

export interface VehicleTracking extends Vehicle {
  current_position: GPSPosition | null
  current_trip: Trip | null
  current_driver: Driver | null
}

// --- Maintenance ---
export type MaintenanceType = 'preventive' | 'corrective' | 'inspection'
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical'
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'

export interface MaintenanceRecord {
  id: string
  vehicle_id: string
  type: MaintenanceType
  priority: MaintenancePriority
  status: MaintenanceStatus
  description: string
  mechanic: string
  cost: number
  parts_used: string[]
  odometer_at_service: number
  scheduled_date: string
  completed_date: string | null
  next_service_km: number | null
  notes: string | null
  created_at: string
  vehicle?: Vehicle
}

// --- Finance ---
export interface DailyRevenue {
  date: string
  total_trips: number
  total_passengers: number
  total_revenue: number
  fuel_cost: number
  maintenance_cost: number
  net_revenue: number
}

export interface FinancialSummary {
  period: string
  gross_revenue: number
  total_expenses: number
  fuel_expenses: number
  maintenance_expenses: number
  salary_expenses: number
  other_expenses: number
  net_profit: number
  profit_margin: number
  revenue_per_km: number
  cost_per_passenger: number
}

// --- Analytics / AI ---
export interface DemandPrediction {
  date: string
  hour: number
  predicted_passengers: number
  confidence: number
  recommended_vehicles: number
}

export interface RouteOptimization {
  current_duration: number
  optimized_duration: number
  savings_minutes: number
  suggestions: string[]
}

export interface FleetHealth {
  total_vehicles: number
  active: number
  in_maintenance: number
  inactive: number
  avg_age_years: number
  vehicles_needing_service: number
  soat_expiring_soon: number
  review_expiring_soon: number
}

// --- Dashboard Stats ---
export interface DashboardStats {
  active_vehicles: number
  total_drivers: number
  trips_today: number
  passengers_today: number
  revenue_today: number
  active_routes: number
  fleet_health: FleetHealth
  recent_trips: Trip[]
  alerts: Alert[]
}

export interface Alert {
  id: string
  type: 'warning' | 'error' | 'info' | 'success'
  title: string
  message: string
  timestamp: string
  is_read: boolean
}

// --- User / Auth ---
export type UserRole = 'admin' | 'manager' | 'dispatcher' | 'driver' | 'passenger'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url: string | null
  phone: string | null
  is_active: boolean
  created_at: string
}
