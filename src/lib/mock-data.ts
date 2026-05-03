// ============================================================
// TransRosa - Mock Data for Development & Demo
// Cooperativa de 50 socios, 100 vehículos
// ============================================================

import type {
  Vehicle, Driver, Trip, Ticket, MaintenanceRecord,
  DashboardStats, GPSPosition, DailyRevenue, Alert,
  Partner, Commission, ComplianceRecord,
  PassengerCheckIn, VehicleManifest, SecurityIncident, CCTVCamera, SOSAlert, SecurityStats
} from '@/types'

// --- Partners (50 socios) ---
const partnerFirstNames = [
  'Francisco', 'Carlos', 'José', 'Luis', 'Miguel', 'Pedro', 'Juan',
  'Ricardo', 'Fernando', 'Raúl', 'Alberto', 'Sergio', 'Daniel',
  'Marco', 'Hugo', 'Roberto', 'Andrés', 'Héctor', 'Óscar', 'Julio',
  'Eduardo', 'Víctor', 'Manuel', 'Arturo', 'Alejandro', 'Enrique',
  'Gustavo', 'César', 'Rafael', 'Ernesto', 'Javier', 'Antonio',
  'Jorge', 'Alfredo', 'Gonzalo', 'Iván', 'Pablo', 'Martín',
  'Esteban', 'Felipe', 'Tomás', 'Nicolás', 'Rodrigo', 'Diego',
  'Ramón', 'Wilfredo', 'Percy', 'Elmer', 'Walter', 'Gilberto'
]
const partnerLastNames = [
  'Granados Rivera', 'García Flores', 'Rodríguez López', 'Martínez Sánchez',
  'Torres Ramírez', 'Cruz Morales', 'Reyes Gutiérrez', 'Díaz Hernández',
  'Flores Rivera', 'López García', 'Sánchez Torres', 'Ramírez Cruz',
  'Morales Reyes', 'Gutiérrez Díaz', 'Hernández Flores', 'Rivera López',
  'Castillo Vargas', 'Rojas Mendoza', 'Vega Paredes', 'Quispe Huamán',
  'Huamán Quispe', 'Mendoza Rojas', 'Vargas Castillo', 'Paredes Vega',
  'Silva Chávez', 'Chávez Silva', 'Espinoza Córdova', 'Córdova Espinoza',
  'Medina Salazar', 'Salazar Medina', 'Peña Campos', 'Campos Peña',
  'Ortiz Delgado', 'Delgado Ortiz', 'Ruiz Navarro', 'Navarro Ruiz',
  'Aguilar Ponce', 'Ponce Aguilar', 'Vera Contreras', 'Contreras Vera',
  'Soto Valverde', 'Valverde Soto', 'Montes León', 'León Montes',
  'Bautista Romero', 'Romero Bautista', 'Carrillo Ibarra', 'Ibarra Carrillo',
  'Meza Villanueva', 'Villanueva Meza'
]

export const mockPartners: Partner[] = Array.from({ length: 50 }, (_, i) => {
  const isDriver = i < 15 // ~30% are also drivers
  return {
    id: `p-${i + 1}`,
    user_id: i < 10 ? `user-p-${i + 1}` : null,
    partner_number: i + 1,
    first_name: partnerFirstNames[i],
    last_name: partnerLastNames[i],
    dni: `${10000000 + i * 178923}`,
    ruc: i % 3 === 0 ? `20${100000000 + i * 234567}` : null,
    phone: `+51 9${String(40000000 + i * 1234567).slice(-8)}`,
    email: i % 2 === 0 ? `${partnerFirstNames[i].toLowerCase()}.${partnerLastNames[i].split(' ')[0].toLowerCase()}@gmail.com` : null,
    photo_url: null,
    address: [
      'Jr. Bolognesi 245, Vegueta',
      'Av. San Martín 180, Vegueta',
      'Ca. Grau 312, Huaura',
      'Av. Los Libertadores 450, Vegueta',
      'Jr. Tarapacá 567, Huacho',
      'Av. 28 de Julio 890, Huacho',
      'Ca. Bolívar 123, Vegueta',
      'Av. Echenique 456, Huacho',
      'Jr. San Román 789, Huacho',
      'Ca. Vegueta 234, Vegueta',
    ][i % 10],
    status: i < 45 ? 'active' : i < 48 ? 'suspended' : 'inactive',
    join_date: `${2018 + Math.floor(i / 10)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    vehicles_count: 2,
    is_driver: isDriver,
    driver_id: isDriver ? `d-${i + 1}` : null,
    total_commission_paid: 15000 + i * 850,
    total_commission_pending: i < 45 ? (i % 5 === 0 ? 1200 : 0) : 2400,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2026-04-14T00:00:00Z',
  }
})

// --- Vehicles (100 units, 2 per partner) ---
export const mockVehicles: Vehicle[] = Array.from({ length: 100 }, (_, i) => ({
  id: `v-${i + 1}`,
  plate_number: `${['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'][Math.floor(i / 13)]}${String(i * 17 + 100).slice(-2)}-${String(i * 31 + 200).slice(-3)}`,
  internal_number: i + 1,
  partner_id: `p-${Math.floor(i / 2) + 1}`,
  brand: ['Toyota', 'Hyundai', 'Kia', 'Changan', 'JAC'][i % 5],
  model: ['HiAce', 'Staria', 'Carnival', 'Star 9', 'Refine'][i % 5],
  year: 2020 + (i % 5),
  capacity: 11,
  status: i < 70 ? 'active' : i < 85 ? 'en_route' : i < 94 ? 'maintenance' : 'inactive',
  soat_expiry: `2026-${String((i % 12) + 1).padStart(2, '0')}-15`,
  technical_review_expiry: `2026-${String(((i + 3) % 12) + 1).padStart(2, '0')}-20`,
  last_maintenance: '2026-03-15',
  next_maintenance: '2026-06-15',
  odometer_km: 45000 + i * 2300,
  fuel_type: i % 3 === 0 ? 'gnv' : i % 3 === 1 ? 'gasoline' : 'diesel',
  gps_device_id: `GPS-${String(i + 1).padStart(3, '0')}`,
  photo_url: null,
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2026-04-14T00:00:00Z',
}))

// --- Drivers (80 drivers, some are partners) ---
const driverFirstNames = [
  'Carlos', 'José', 'Luis', 'Miguel', 'Pedro', 'Juan', 'Ricardo',
  'Fernando', 'Raúl', 'Alberto', 'Sergio', 'Daniel', 'Marco', 'Hugo',
  'Roberto', 'Andrés', 'Héctor', 'Óscar', 'Julio', 'Eduardo',
  'Víctor', 'Manuel', 'Arturo', 'Alejandro', 'Enrique', 'Gustavo',
  'César', 'Rafael', 'Ernesto', 'Javier', 'Antonio', 'Jorge',
  'Alfredo', 'Gonzalo', 'Iván', 'Pablo', 'Martín', 'Esteban',
  'Felipe', 'Tomás'
]
const driverLastNames = [
  'García', 'Rodríguez', 'López', 'Martínez', 'Sánchez', 'Flores',
  'Rivera', 'Torres', 'Ramírez', 'Cruz', 'Morales', 'Reyes',
  'Gutiérrez', 'Díaz', 'Hernández', 'Castillo', 'Rojas', 'Mendoza',
  'Vega', 'Quispe'
]

export const mockDrivers: Driver[] = Array.from({ length: 80 }, (_, i) => ({
  id: `d-${i + 1}`,
  user_id: i < 15 ? `user-p-${i + 1}` : null, // First 15 are partner-drivers
  first_name: i < 15 ? partnerFirstNames[i] : driverFirstNames[i % driverFirstNames.length],
  last_name: i < 15
    ? partnerLastNames[i]
    : `${driverLastNames[i % driverLastNames.length]} ${driverLastNames[(i + 7) % driverLastNames.length]}`,
  dni: i < 15 ? `${10000000 + i * 178923}` : `${40000000 + i * 12345}`,
  license_number: `Q-${60000000 + i * 11111}`,
  license_category: 'A-IIb',
  license_expiry: `2027-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  phone: i < 15 ? `+51 9${String(40000000 + i * 1234567).slice(-8)}` : `+51 9${String(10000000 + i * 1111111).slice(-8)}`,
  email: `${(i < 15 ? partnerFirstNames[i] : driverFirstNames[i % driverFirstNames.length]).toLowerCase()}.${(i < 15 ? partnerLastNames[i].split(' ')[0] : driverLastNames[i % driverLastNames.length]).toLowerCase()}@transrosa.pe`,
  photo_url: null,
  status: i < 40 ? 'available' : i < 60 ? 'driving' : i < 70 ? 'resting' : 'off_duty',
  rating: 4.0 + (i % 10) * 0.1,
  total_trips: 500 + i * 47,
  hire_date: `${2020 + (i % 4)}-${String((i % 12) + 1).padStart(2, '0')}-15`,
  emergency_contact_name: `María ${driverLastNames[(i + 3) % driverLastNames.length]}`,
  emergency_contact_phone: `+51 9${String(20000000 + i * 2222222).slice(-8)}`,
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2026-04-14T00:00:00Z',
}))

// --- Commissions (~30 records) ---
export const mockCommissions: Commission[] = Array.from({ length: 30 }, (_, i) => {
  const period: Commission['period'] = i < 15 ? 'daily' : i < 25 ? 'monthly' : 'annual'
  const amount = period === 'daily' ? 25 : period === 'monthly' ? 600 : 6500
  const statusOptions: Commission['status'][] = ['paid', 'pending', 'overdue', 'partial']
  const status = statusOptions[i % 4]
  const paidAmount = status === 'paid' ? amount : status === 'partial' ? Math.round(amount * 0.6) : status === 'pending' ? 0 : 0

  return {
    id: `com-${i + 1}`,
    partner_id: `p-${(i % 50) + 1}`,
    vehicle_id: i % 3 === 0 ? null : `v-${(i % 100) + 1}`,
    period,
    amount,
    paid_amount: paidAmount,
    status,
    due_date: period === 'daily'
      ? `2026-04-${String((i % 28) + 1).padStart(2, '0')}`
      : period === 'monthly'
        ? `2026-${String((i % 12) + 1).padStart(2, '0')}-01`
        : '2026-12-31',
    paid_date: status === 'paid' ? `2026-04-${String(Math.min((i % 28) + 1, 15)).padStart(2, '0')}` : null,
    payment_method: (['cash', 'yape', 'plin', 'transfer', 'bank_deposit'] as const)[i % 5],
    receipt_number: status === 'paid' ? `REC-2026-${String(i + 1).padStart(4, '0')}` : null,
    notes: i % 5 === 0 ? 'Pago adelantado' : null,
    created_at: '2026-04-01T00:00:00Z',
  }
})

// --- Compliance Records (~40 records) ---
export const mockCompliance: ComplianceRecord[] = Array.from({ length: 40 }, (_, i) => {
  const entityType: ComplianceRecord['entity_type'] = i < 25 ? 'vehicle' : 'driver'
  const complianceTypes: ComplianceRecord['type'][] = entityType === 'vehicle'
    ? ['soat', 'technical_review', 'vehicle_card', 'route_permit', 'insurance']
    : ['driver_license', 'medical_cert', 'background_check']
  const type = complianceTypes[i % complianceTypes.length]
  const statusOptions: ComplianceRecord['status'][] = ['valid', 'expiring_soon', 'expired', 'missing']
  const status = i < 28 ? 'valid' : i < 34 ? 'expiring_soon' : i < 38 ? 'expired' : 'missing'

  return {
    id: `comp-${i + 1}`,
    entity_type: entityType,
    entity_id: entityType === 'vehicle' ? `v-${(i % 100) + 1}` : `d-${(i % 80) + 1}`,
    partner_id: `p-${(i % 50) + 1}`,
    type,
    document_number: status !== 'missing' ? `DOC-${type.toUpperCase()}-${String(i + 1).padStart(5, '0')}` : null,
    issue_date: status !== 'missing' ? `2025-${String((i % 12) + 1).padStart(2, '0')}-01` : null,
    expiry_date: status === 'valid'
      ? `2027-${String((i % 12) + 1).padStart(2, '0')}-01`
      : status === 'expiring_soon'
        ? `2026-05-${String((i % 28) + 1).padStart(2, '0')}`
        : status === 'expired'
          ? `2026-02-${String((i % 28) + 1).padStart(2, '0')}`
          : `2025-12-31`,
    status,
    document_url: status !== 'missing' ? `/documents/${type}/${i + 1}.pdf` : null,
    notes: status === 'expired' ? 'Requiere renovación urgente' : status === 'expiring_soon' ? 'Próximo a vencer' : null,
    verified_by: status === 'valid' ? 'admin-1' : null,
    verified_at: status === 'valid' ? '2026-03-01T00:00:00Z' : null,
    created_at: '2026-01-15T00:00:00Z',
  }
})

// --- Trips ---
export const mockTrips: Trip[] = Array.from({ length: 20 }, (_, i) => ({
  id: `t-${i + 1}`,
  route_id: 'ri-06',
  vehicle_id: `v-${(i % 100) + 1}`,
  driver_id: `d-${(i % 80) + 1}`,
  direction: i % 2 === 0 ? 'ida' : 'vuelta',
  scheduled_departure: `2026-04-15T${String(5 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}:00Z`,
  actual_departure: i < 15 ? `2026-04-15T${String(5 + Math.floor(i / 2)).padStart(2, '0')}:${String((i % 2 === 0 ? 0 : 30) + (i % 5)).padStart(2, '0')}:00Z` : null,
  scheduled_arrival: null,
  actual_arrival: i < 10 ? `2026-04-15T${String(5 + Math.floor(i / 2)).padStart(2, '0')}:${String((i % 2 === 0 ? 45 : 15) + (i % 5)).padStart(2, '0')}:00Z` : null,
  status: i < 8 ? 'completed' : i < 12 ? 'in_progress' : i < 16 ? 'boarding' : 'scheduled',
  passenger_count: 6 + (i % 5),
  revenue: (6 + (i % 5)) * 3.5,
  notes: null,
  created_at: '2026-04-15T00:00:00Z',
}))

export const mockGPSPositions: GPSPosition[] = mockVehicles
  .filter((v) => v.status === 'en_route' || v.status === 'active')
  .slice(0, 20)
  .map((v, i) => ({
    vehicle_id: v.id,
    lat: -11.0175 + (i * 0.005) + (Math.random() * 0.003),
    lng: -77.6420 + (i * 0.0015) + (Math.random() * 0.003),
    speed: 20 + Math.floor(Math.random() * 40),
    heading: Math.floor(Math.random() * 360),
    timestamp: new Date().toISOString(),
    trip_id: i < 10 ? `t-${i + 1}` : null,
  }))

export const mockDailyRevenue: DailyRevenue[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 2, 16 + i)
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  const baseTrips = isWeekend ? 120 : 180
  const basePassengers = baseTrips * 8
  const baseRevenue = basePassengers * 3.5

  return {
    date: date.toISOString().split('T')[0],
    total_trips: baseTrips + Math.floor(Math.random() * 30),
    total_passengers: basePassengers + Math.floor(Math.random() * 100),
    total_revenue: baseRevenue + Math.floor(Math.random() * 500),
    fuel_cost: 1200 + Math.floor(Math.random() * 300),
    maintenance_cost: 200 + Math.floor(Math.random() * 800),
    net_revenue: baseRevenue - 1600 + Math.floor(Math.random() * 400),
  }
})

export const mockAlerts: Alert[] = [
  {
    id: 'a-1',
    type: 'warning',
    title: 'SOAT por vencer',
    message: 'El vehículo #12 (B2A-456) tiene el SOAT venciendo en 5 días',
    timestamp: new Date().toISOString(),
    is_read: false,
  },
  {
    id: 'a-2',
    type: 'info',
    title: 'Mantenimiento programado',
    message: 'Vehículo #23 tiene mantenimiento preventivo mañana a las 8:00 AM',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    is_read: false,
  },
  {
    id: 'a-3',
    type: 'success',
    title: 'Meta diaria alcanzada',
    message: 'Se alcanzó la meta de 150 viajes diarios. ¡Felicidades!',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    is_read: true,
  },
  {
    id: 'a-4',
    type: 'error',
    title: 'GPS sin señal',
    message: 'El vehículo #07 perdió señal GPS hace 30 minutos',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    is_read: false,
  },
  {
    id: 'a-5',
    type: 'warning',
    title: 'Revisión técnica próxima',
    message: '3 vehículos necesitan revisión técnica este mes',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    is_read: true,
  },
  {
    id: 'a-6',
    type: 'warning',
    title: 'Comisiones pendientes',
    message: '5 socios tienen comisiones mensuales vencidas',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    is_read: false,
  },
  {
    id: 'a-7',
    type: 'error',
    title: 'Documentos vencidos',
    message: '4 vehículos tienen documentos de cumplimiento vencidos',
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    is_read: false,
  },
]

export const mockDashboardStats: DashboardStats = {
  active_vehicles: 85,
  total_drivers: 80,
  total_partners: 50,
  active_partners: 45,
  trips_today: 312,
  passengers_today: 2496,
  revenue_today: 8736,
  active_routes: 1,
  total_commissions_collected: 425000,
  total_commissions_pending: 37500,
  fleet_health: {
    total_vehicles: 100,
    active: 85,
    in_maintenance: 9,
    inactive: 6,
    avg_age_years: 2.5,
    vehicles_needing_service: 8,
    soat_expiring_soon: 6,
    review_expiring_soon: 4,
    compliant_vehicles: 88,
    non_compliant_vehicles: 12,
  },
  recent_trips: mockTrips.slice(0, 5),
  alerts: mockAlerts,
}

export const mockMaintenanceRecords: MaintenanceRecord[] = Array.from({ length: 15 }, (_, i) => ({
  id: `m-${i + 1}`,
  vehicle_id: `v-${(i % 100) + 1}`,
  type: ['preventive', 'corrective', 'inspection'][i % 3] as MaintenanceRecord['type'],
  priority: ['low', 'medium', 'high', 'critical'][i % 4] as MaintenanceRecord['priority'],
  status: ['scheduled', 'in_progress', 'completed'][i % 3] as MaintenanceRecord['status'],
  description: [
    'Cambio de aceite y filtros',
    'Reparación de frenos',
    'Inspección general de 10,000 km',
    'Cambio de neumáticos',
    'Reparación de transmisión',
    'Afinamiento de motor',
    'Revisión de suspensión',
    'Cambio de batería',
  ][i % 8],
  mechanic: ['Taller Central', 'Mecánica Rápida', 'Autoservicio Huacho'][i % 3],
  cost: [350, 800, 200, 1200, 2500, 450, 600, 280][i % 8],
  parts_used: ['Aceite 10W-40', 'Filtro de aceite', 'Filtro de aire'],
  odometer_at_service: 45000 + i * 5000,
  scheduled_date: `2026-04-${String((i % 28) + 1).padStart(2, '0')}`,
  completed_date: i % 3 === 2 ? `2026-04-${String((i % 28) + 1).padStart(2, '0')}` : null,
  next_service_km: 50000 + i * 5000,
  notes: null,
  created_at: '2026-04-01T00:00:00Z',
}))

// ============================================================
// SECURITY MODULE MOCK DATA
// ============================================================

const passengerNames = [
  'María García López', 'Juan Pérez Ramírez', 'Ana Torres Flores', 'Carlos Ruiz Mendoza',
  'Lucía Vega Castillo', 'Pedro Sánchez Cruz', 'Carmen Díaz Hernández', 'Miguel Reyes Quispe',
  'Rosa Morales Vargas', 'Luis Castro Paredes', 'Patricia Soto Aguilar', 'Roberto Ponce Ibarra',
  'Elena Vera Contreras', 'Daniel Salazar Medina', 'Sandra Bautista Romero', 'Hugo Carrillo León',
  'Diana Meza Villanueva', 'Jorge Espinoza Córdova', 'Silvia Peña Campos', 'Alberto Ortiz Delgado',
]

// --- Passenger Check-Ins (50 today) ---
export const mockCheckIns: PassengerCheckIn[] = Array.from({ length: 50 }, (_, i) => {
  const methods: PassengerCheckIn['method'][] = ['facial_recognition', 'qr_code', 'dni_scan', 'manual']
  const statuses: PassengerCheckIn['status'][] = ['checked_in', 'boarded', 'completed', 'no_show']
  const method = methods[i % 4]
  const isVerified = method !== 'manual'
  const now = new Date()
  const checkInTime = new Date(now.getTime() - (50 - i) * 8 * 60000)

  return {
    id: `ci-${i + 1}`,
    trip_id: `t-${(i % 20) + 1}`,
    vehicle_id: `v-${(i % 100) + 1}`,
    ticket_id: i % 4 !== 3 ? `tk-${i + 1}` : null,
    passenger_name: passengerNames[i % passengerNames.length],
    passenger_dni: `${40000000 + i * 134578}`.slice(0, 8),
    passenger_phone: i % 3 === 0 ? `+51 9${String(50000000 + i * 333333).slice(-8)}` : null,
    passenger_photo_url: null,
    method,
    terminal_id: i % 2 === 0 ? 'term-vegueta' : 'term-huacho',
    terminal_name: i % 2 === 0 ? 'Vegueta' : 'Huacho',
    check_in_time: checkInTime.toISOString(),
    boarding_time: i < 30 ? new Date(checkInTime.getTime() + 3 * 60000).toISOString() : null,
    seat_number: i % 4 === 3 ? null : ((i % 10) + 1),
    identity_verified: isVerified,
    match_confidence: method === 'facial_recognition' ? 0.92 + (i % 8) * 0.01 : null,
    camera_id: method === 'facial_recognition' ? `CAM-T${i % 2 === 0 ? '01' : '02'}-A${(i % 4) + 1}` : null,
    camera_snapshot_url: method === 'facial_recognition' ? `https://placeholder.cdn/snap-${i + 1}.jpg` : null,
    status: i < 10 ? 'completed' : i < 30 ? 'boarded' : i < 47 ? 'checked_in' : 'no_show',
    notes: null,
    created_at: checkInTime.toISOString(),
  }
})

// --- Vehicle Manifests (8 active) ---
export const mockManifests: VehicleManifest[] = Array.from({ length: 8 }, (_, i) => {
  const passengers = mockCheckIns.filter((_, idx) => idx % 8 === i).slice(0, 5 + (i % 5))
  return {
    id: `mn-${i + 1}`,
    trip_id: `t-${i + 1}`,
    vehicle_id: `v-${i + 1}`,
    vehicle_plate: mockVehicles[i].plate_number,
    driver_id: `d-${i + 1}`,
    driver_name: `${mockDrivers[i].first_name} ${mockDrivers[i].last_name}`,
    departure_time: new Date(Date.now() - i * 12 * 60000).toISOString(),
    arrival_time: i < 3 ? new Date(Date.now() - (i - 3) * 12 * 60000 + 45 * 60000).toISOString() : null,
    total_passengers: passengers.length,
    total_capacity: 10,
    passengers,
    status: i < 3 ? 'completed' : i < 6 ? 'in_transit' : 'boarding',
    origin_terminal: i % 2 === 0 ? 'Vegueta' : 'Huacho',
    destination_terminal: i % 2 === 0 ? 'Huacho' : 'Vegueta',
    created_at: new Date().toISOString(),
  }
})

// --- Security Incidents (12 records, mix of statuses) ---
export const mockIncidents: SecurityIncident[] = [
  {
    id: 'inc-1', incident_number: 'INC-2026-001',
    type: 'theft', severity: 'high', status: 'investigating',
    title: 'Hurto de celular reportado', description: 'Pasajera reporta hurto de celular Samsung A54 durante el trayecto. Posible sospechoso identificado en CCTV.',
    incident_date: new Date(Date.now() - 2 * 3600000).toISOString(),
    reported_date: new Date(Date.now() - 1.5 * 3600000).toISOString(),
    location: 'Vehículo #12 - Trayecto Vegueta a Huacho',
    vehicle_id: 'v-12', trip_id: 't-3', terminal_id: null,
    reported_by: 'María García', reporter_role: 'passenger',
    affected_passengers: ['ci-3'], suspect_description: 'Hombre, 25-30 años, polo rojo, gorra negra',
    suspect_photo_url: 'https://placeholder.cdn/suspect-1.jpg',
    cctv_video_urls: ['https://placeholder.cdn/cctv-inc1.mp4'],
    photo_evidence_urls: [], witness_statements: ['Testigo: Carlos Ruiz - asiento 4'],
    police_notified: true, police_report_number: 'PNP-HUA-2026-0089', police_officer: 'Sof. Ramírez',
    resolution_notes: null, resolved_date: null, insurance_claim_number: null, estimated_loss: 1800,
    created_at: new Date(Date.now() - 1.5 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'inc-2', incident_number: 'INC-2026-002',
    type: 'lost_item', severity: 'low', status: 'resolved',
    title: 'Cartera olvidada', description: 'Pasajero olvida cartera con documentos. Recuperada por conductor.',
    incident_date: new Date(Date.now() - 24 * 3600000).toISOString(),
    reported_date: new Date(Date.now() - 23 * 3600000).toISOString(),
    location: 'Terminal Huacho', vehicle_id: 'v-23', trip_id: null, terminal_id: 'term-huacho',
    reported_by: 'Juan Pérez', reporter_role: 'passenger', affected_passengers: [],
    suspect_description: null, suspect_photo_url: null, cctv_video_urls: [], photo_evidence_urls: [],
    witness_statements: [], police_notified: false, police_report_number: null, police_officer: null,
    resolution_notes: 'Cartera entregada al pasajero en oficina central',
    resolved_date: new Date(Date.now() - 12 * 3600000).toISOString(),
    insurance_claim_number: null, estimated_loss: null,
    created_at: new Date(Date.now() - 23 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: 'inc-3', incident_number: 'INC-2026-003',
    type: 'medical_emergency', severity: 'critical', status: 'resolved',
    title: 'Emergencia médica - desmayo', description: 'Pasajera adulta mayor sufre desmayo. Atendida por SAMU.',
    incident_date: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    reported_date: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    location: 'Vehículo #7', vehicle_id: 'v-7', trip_id: 't-15', terminal_id: null,
    reported_by: 'Conductor Carlos García', reporter_role: 'driver', affected_passengers: ['ci-7'],
    suspect_description: null, suspect_photo_url: null, cctv_video_urls: [], photo_evidence_urls: [],
    witness_statements: [], police_notified: false, police_report_number: null, police_officer: null,
    resolution_notes: 'Pasajera estabilizada, trasladada a Hospital Regional',
    resolved_date: new Date(Date.now() - 5 * 24 * 3600000 + 2 * 3600000).toISOString(),
    insurance_claim_number: 'INS-2026-018', estimated_loss: null,
    created_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 3600000 + 2 * 3600000).toISOString(),
  },
  {
    id: 'inc-4', incident_number: 'INC-2026-004',
    type: 'suspicious_behavior', severity: 'medium', status: 'reported',
    title: 'Comportamiento sospechoso detectado por IA', description: 'Sistema CCTV con IA detecta a sujeto merodeando paradero por más de 40 minutos.',
    incident_date: new Date(Date.now() - 1 * 3600000).toISOString(),
    reported_date: new Date(Date.now() - 50 * 60000).toISOString(),
    location: 'Terminal Vegueta', vehicle_id: null, trip_id: null, terminal_id: 'term-vegueta',
    reported_by: 'Sistema IA', reporter_role: 'admin', affected_passengers: [],
    suspect_description: 'Hombre, 30-40 años, mochila negra grande', suspect_photo_url: null,
    cctv_video_urls: ['https://placeholder.cdn/cctv-inc4.mp4'],
    photo_evidence_urls: [], witness_statements: [],
    police_notified: false, police_report_number: null, police_officer: null,
    resolution_notes: null, resolved_date: null, insurance_claim_number: null, estimated_loss: null,
    created_at: new Date(Date.now() - 50 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 50 * 60000).toISOString(),
  },
  ...Array.from({ length: 8 }, (_, i) => {
    const idx = i + 5
    const types: SecurityIncident['type'][] = ['lost_item', 'harassment', 'theft', 'vehicle_breakdown', 'lost_item', 'suspicious_behavior', 'lost_item', 'theft']
    const severities: SecurityIncident['severity'][] = ['low', 'medium', 'medium', 'medium', 'low', 'low', 'low', 'medium']
    const statuses: SecurityIncident['status'][] = ['closed', 'resolved', 'resolved', 'closed', 'closed', 'closed', 'resolved', 'closed']
    const daysAgo = 7 + i * 3
    return {
      id: `inc-${idx}`, incident_number: `INC-2026-00${idx}`,
      type: types[i], severity: severities[i], status: statuses[i],
      title: ['Maleta extraviada', 'Discusión entre pasajeros', 'Hurto de mochila', 'Falla mecánica menor', 'Documento olvidado', 'Persona ebria en paradero', 'Lentes olvidados', 'Hurto de billetera'][i],
      description: 'Caso resuelto satisfactoriamente. Documentación archivada.',
      incident_date: new Date(Date.now() - daysAgo * 24 * 3600000).toISOString(),
      reported_date: new Date(Date.now() - daysAgo * 24 * 3600000).toISOString(),
      location: i % 2 === 0 ? `Vehículo #${(i % 50) + 1}` : i % 3 === 0 ? 'Terminal Vegueta' : 'Terminal Huacho',
      vehicle_id: i % 2 === 0 ? `v-${(i % 50) + 1}` : null, trip_id: null,
      terminal_id: i % 2 !== 0 ? (i % 3 === 0 ? 'term-vegueta' : 'term-huacho') : null,
      reported_by: passengerNames[i % passengerNames.length], reporter_role: 'passenger',
      affected_passengers: [], suspect_description: null, suspect_photo_url: null,
      cctv_video_urls: [], photo_evidence_urls: [], witness_statements: [],
      police_notified: i === 7, police_report_number: i === 7 ? 'PNP-HUA-2026-0034' : null, police_officer: null,
      resolution_notes: 'Resuelto', resolved_date: new Date(Date.now() - (daysAgo - 1) * 24 * 3600000).toISOString(),
      insurance_claim_number: null, estimated_loss: i === 7 ? 250 : null,
      created_at: new Date(Date.now() - daysAgo * 24 * 3600000).toISOString(),
      updated_at: new Date(Date.now() - (daysAgo - 1) * 24 * 3600000).toISOString(),
    } as SecurityIncident
  }),
]

// --- CCTV Cameras ---
export const mockCameras: CCTVCamera[] = [
  // Terminal Vegueta cameras
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `cam-t1-${i + 1}`, camera_code: `CAM-T01-A${i + 1}`,
    name: ['Entrada Principal', 'Sala de Espera', 'Zona de Boletería', 'Andén Salida', 'Estacionamiento', 'Salida Trasera'][i],
    location: (i < 2 ? 'terminal_entry' : i < 4 ? 'terminal_boarding' : 'parking_lot') as CCTVCamera['location'],
    terminal_id: 'term-vegueta', vehicle_id: null,
    has_facial_recognition: i < 4, has_motion_detection: true, has_night_vision: i >= 3,
    resolution: i < 2 ? '4K' : '1080p', storage_days: 30,
    status: (i === 5 ? 'maintenance' : 'recording') as CCTVCamera['status'],
    last_ping: new Date(Date.now() - (i === 5 ? 3 * 3600000 : 60000)).toISOString(),
    last_recording_url: null, installed_date: '2025-08-15',
    ip_address: `192.168.1.${100 + i}`, notes: null,
  })),
  // Terminal Huacho cameras
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `cam-t2-${i + 1}`, camera_code: `CAM-T02-B${i + 1}`,
    name: ['Entrada Principal', 'Sala de Espera', 'Boletería', 'Andén Salida', 'Andén Llegada', 'Estacionamiento'][i],
    location: (i < 2 ? 'terminal_entry' : i < 5 ? 'terminal_boarding' : 'parking_lot') as CCTVCamera['location'],
    terminal_id: 'term-huacho', vehicle_id: null,
    has_facial_recognition: i < 4, has_motion_detection: true, has_night_vision: true,
    resolution: i < 3 ? '4K' : '1080p', storage_days: 30, status: 'recording' as CCTVCamera['status'],
    last_ping: new Date().toISOString(), last_recording_url: null, installed_date: '2025-09-01',
    ip_address: `192.168.2.${100 + i}`, notes: null,
  })),
  // Vehicle interior cameras (15 vehicles equipped)
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `cam-v-${i + 1}`, camera_code: `CAM-V${String(i + 1).padStart(3, '0')}`,
    name: `Interior Vehículo #${i + 1}`, location: 'vehicle_interior' as CCTVCamera['location'],
    terminal_id: null, vehicle_id: `v-${i + 1}`,
    has_facial_recognition: false, has_motion_detection: true, has_night_vision: true,
    resolution: '1080p', storage_days: 7,
    status: (i === 12 ? 'offline' : 'recording') as CCTVCamera['status'],
    last_ping: new Date(Date.now() - (i === 12 ? 6 * 3600000 : 120000)).toISOString(),
    last_recording_url: null, installed_date: '2025-10-20',
    ip_address: null, notes: i === 12 ? 'Cámara con falla, reemplazo programado' : null,
  })),
]

// --- SOS Alerts ---
export const mockSOSAlerts: SOSAlert[] = [
  {
    id: 'sos-1', triggered_by: 'driver', user_id: 'd-7', vehicle_id: 'v-7', trip_id: 't-15',
    lat: -11.0625, lng: -77.6254,
    triggered_at: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    responded_at: new Date(Date.now() - 5 * 24 * 3600000 + 4 * 60000).toISOString(),
    resolved_at: new Date(Date.now() - 5 * 24 * 3600000 + 30 * 60000).toISOString(),
    status: 'resolved', description: 'Emergencia médica de pasajera', responder: 'PNP - Sof. Ramírez',
  },
  {
    id: 'sos-2', triggered_by: 'driver', user_id: 'd-12', vehicle_id: 'v-12', trip_id: null,
    lat: -11.0875, lng: -77.6189,
    triggered_at: new Date(Date.now() - 10 * 60000).toISOString(),
    responded_at: new Date(Date.now() - 8 * 60000).toISOString(),
    resolved_at: null, status: 'responded', description: 'Hurto en curso', responder: 'PNP-Huaura',
  },
]

// --- Security Stats ---
export const mockSecurityStats: SecurityStats = {
  total_check_ins_today: 248,
  total_passengers_active: 42,
  facial_recognition_rate: 78.5,
  active_incidents: 2,
  resolved_incidents_month: 14,
  cameras_online: 25,
  cameras_total: 27,
  avg_response_time_minutes: 4.2,
  identity_verification_rate: 94.3,
  sos_alerts_today: 1,
}
