// ============================================================
// TransRosa - Type Definitions
// Empresa de Transportes Santa Rosa de Vegueta S.A.
// Cooperativa de 50 socios
// ============================================================

// --- Partner / Socio ---
export type PartnerStatus = 'active' | 'suspended' | 'inactive'

export interface Partner {
  id: string
  user_id: string | null
  partner_number: number // 1-50
  first_name: string
  last_name: string
  dni: string
  ruc: string | null
  phone: string
  email: string | null
  photo_url: string | null
  address: string
  status: PartnerStatus
  join_date: string
  vehicles_count: number
  is_driver: boolean // Can also be a driver
  driver_id: string | null // If they drive, link to driver record
  total_commission_paid: number
  total_commission_pending: number
  created_at: string
  updated_at: string
  // Joined
  vehicles?: Vehicle[]
}

// --- Commission ---
export type CommissionPeriod = 'daily' | 'monthly' | 'annual'
export type CommissionStatus = 'paid' | 'pending' | 'overdue' | 'partial'

export interface Commission {
  id: string
  partner_id: string
  vehicle_id: string | null // null = applies to all partner vehicles
  period: CommissionPeriod
  amount: number
  paid_amount: number
  status: CommissionStatus
  due_date: string
  paid_date: string | null
  payment_method: 'cash' | 'yape' | 'plin' | 'transfer' | 'bank_deposit'
  receipt_number: string | null
  notes: string | null
  created_at: string
  // Joined
  partner?: Partner
}

// --- Compliance / Document Tracking ---
export type ComplianceType = 'soat' | 'technical_review' | 'vehicle_card' | 'route_permit' | 'driver_license' | 'medical_cert' | 'background_check' | 'insurance'
export type ComplianceStatus = 'valid' | 'expiring_soon' | 'expired' | 'missing'

export interface ComplianceRecord {
  id: string
  entity_type: 'vehicle' | 'driver'
  entity_id: string
  partner_id: string
  type: ComplianceType
  document_number: string | null
  issue_date: string | null
  expiry_date: string
  status: ComplianceStatus
  document_url: string | null
  notes: string | null
  verified_by: string | null
  verified_at: string | null
  created_at: string
}

// --- Partner Dashboard Stats ---
export interface PartnerDashboardStats {
  total_partners: number
  active_partners: number
  suspended_partners: number
  total_vehicles: number
  compliant_vehicles: number
  non_compliant_vehicles: number
  total_commissions_collected: number
  total_commissions_pending: number
  overdue_commissions: number
  compliance_rate: number // percentage
}

// --- Vehicle / Fleet ---
export type VehicleStatus = 'active' | 'maintenance' | 'inactive' | 'en_route'

export interface Vehicle {
  id: string
  plate_number: string
  internal_number: number
  partner_id: string
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
  // Joined
  partner?: Partner
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
  compliant_vehicles: number
  non_compliant_vehicles: number
}

// --- Dashboard Stats ---
export interface DashboardStats {
  active_vehicles: number
  total_drivers: number
  total_partners: number
  active_partners: number
  trips_today: number
  passengers_today: number
  revenue_today: number
  active_routes: number
  total_commissions_collected: number
  total_commissions_pending: number
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
export type UserRole = 'admin' | 'manager' | 'dispatcher' | 'driver' | 'partner' | 'passenger'

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

// ============================================================
// SECURITY MODULE - Passenger ID & Incident Tracking
// ============================================================

// --- Passenger Check-In ---
export type CheckInMethod = 'facial_recognition' | 'qr_code' | 'dni_scan' | 'manual'
export type CheckInStatus = 'checked_in' | 'boarded' | 'completed' | 'no_show'

export interface PassengerCheckIn {
  id: string
  trip_id: string
  vehicle_id: string
  ticket_id: string | null
  // Identity
  passenger_name: string
  passenger_dni: string
  passenger_phone: string | null
  passenger_photo_url: string | null
  // Check-in details
  method: CheckInMethod
  terminal_id: string
  terminal_name: string // 'Vegueta' or 'Huacho'
  check_in_time: string
  boarding_time: string | null
  // Position
  seat_number: number | null
  // Verification
  identity_verified: boolean
  match_confidence: number | null // 0-1 from facial recognition
  // Camera
  camera_id: string | null
  camera_snapshot_url: string | null
  status: CheckInStatus
  notes: string | null
  created_at: string
}

// --- Vehicle Manifest ---
export interface VehicleManifest {
  id: string
  trip_id: string
  vehicle_id: string
  vehicle_plate: string
  driver_id: string
  driver_name: string
  departure_time: string
  arrival_time: string | null
  total_passengers: number
  total_capacity: number
  passengers: PassengerCheckIn[]
  status: 'boarding' | 'in_transit' | 'completed' | 'incident'
  origin_terminal: string
  destination_terminal: string
  created_at: string
}

// --- Security Incident ---
export type IncidentType = 'theft' | 'assault' | 'harassment' | 'medical_emergency' | 'vehicle_breakdown' | 'accident' | 'suspicious_behavior' | 'lost_item' | 'other'
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical'
export type IncidentStatus = 'reported' | 'investigating' | 'police_notified' | 'resolved' | 'closed'

export interface SecurityIncident {
  id: string
  incident_number: string // INC-2026-001
  // What
  type: IncidentType
  severity: IncidentSeverity
  status: IncidentStatus
  title: string
  description: string
  // When & Where
  incident_date: string
  reported_date: string
  location: string // 'Vehículo #12', 'Terminal Vegueta'
  vehicle_id: string | null
  trip_id: string | null
  terminal_id: string | null
  // Who
  reported_by: string // user id or name
  reporter_role: 'driver' | 'passenger' | 'admin' | 'police' | 'partner'
  affected_passengers: string[] // check-in ids
  suspect_description: string | null
  suspect_photo_url: string | null
  // Evidence
  cctv_video_urls: string[]
  photo_evidence_urls: string[]
  witness_statements: string[]
  // Police
  police_notified: boolean
  police_report_number: string | null
  police_officer: string | null
  // Resolution
  resolution_notes: string | null
  resolved_date: string | null
  insurance_claim_number: string | null
  estimated_loss: number | null
  // Metadata
  created_at: string
  updated_at: string
}

// --- CCTV Camera ---
export type CameraStatus = 'online' | 'offline' | 'maintenance' | 'recording'
export type CameraLocation = 'terminal_entry' | 'terminal_boarding' | 'vehicle_interior' | 'vehicle_front' | 'parking_lot'

export interface CCTVCamera {
  id: string
  camera_code: string // CAM-T01-A1
  name: string
  location: CameraLocation
  terminal_id: string | null
  vehicle_id: string | null
  // Tech specs
  has_facial_recognition: boolean
  has_motion_detection: boolean
  has_night_vision: boolean
  resolution: string // '1080p', '4K'
  storage_days: number
  // Status
  status: CameraStatus
  last_ping: string
  last_recording_url: string | null
  // Position
  installed_date: string
  ip_address: string | null
  notes: string | null
}

// --- Security KPIs ---
export interface SecurityStats {
  total_check_ins_today: number
  total_passengers_active: number // Currently on board
  facial_recognition_rate: number // % checked in with face recognition
  active_incidents: number
  resolved_incidents_month: number
  cameras_online: number
  cameras_total: number
  avg_response_time_minutes: number
  identity_verification_rate: number // %
  sos_alerts_today: number
}

// --- SOS Alert ---
export interface SOSAlert {
  id: string
  triggered_by: 'driver' | 'passenger' | 'auto'
  user_id: string | null
  vehicle_id: string
  trip_id: string | null
  lat: number
  lng: number
  triggered_at: string
  responded_at: string | null
  resolved_at: string | null
  status: 'active' | 'responded' | 'resolved' | 'false_alarm'
  description: string | null
  responder: string | null
}
