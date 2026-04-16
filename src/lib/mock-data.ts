// ============================================================
// TransRosa - Mock Data for Development & Demo
// ============================================================

import type {
  Vehicle, Driver, Trip, Ticket, MaintenanceRecord,
  DashboardStats, GPSPosition, DailyRevenue, Alert
} from '@/types'

export const mockVehicles: Vehicle[] = Array.from({ length: 50 }, (_, i) => ({
  id: `v-${i + 1}`,
  plate_number: `${['A', 'B', 'C', 'D'][Math.floor(i / 13)]}${String(i * 17 + 100).slice(-2)}-${String(i * 31 + 200).slice(-3)}`,
  internal_number: i + 1,
  brand: ['Toyota', 'Hyundai', 'Kia', 'Changan', 'JAC'][i % 5],
  model: ['HiAce', 'Staria', 'Carnival', 'Star 9', 'Refine'][i % 5],
  year: 2020 + (i % 5),
  capacity: 11,
  status: i < 35 ? 'active' : i < 42 ? 'en_route' : i < 47 ? 'maintenance' : 'inactive',
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

export const mockDrivers: Driver[] = Array.from({ length: 60 }, (_, i) => {
  const firstNames = ['Carlos', 'José', 'Luis', 'Miguel', 'Pedro', 'Juan', 'Ricardo', 'Fernando', 'Raúl', 'Alberto', 'Sergio', 'Daniel', 'Marco', 'Hugo', 'Roberto']
  const lastNames = ['García', 'Rodríguez', 'López', 'Martínez', 'Sánchez', 'Flores', 'Rivera', 'Torres', 'Ramírez', 'Cruz', 'Morales', 'Reyes', 'Gutiérrez', 'Díaz', 'Hernández']

  return {
    id: `d-${i + 1}`,
    user_id: null,
    first_name: firstNames[i % firstNames.length],
    last_name: `${lastNames[i % lastNames.length]} ${lastNames[(i + 5) % lastNames.length]}`,
    dni: `${40000000 + i * 12345}`,
    license_number: `Q-${60000000 + i * 11111}`,
    license_category: 'A-IIb',
    license_expiry: `2027-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    phone: `+51 9${String(10000000 + i * 1111111).slice(-8)}`,
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@transrosa.pe`,
    photo_url: null,
    status: i < 30 ? 'available' : i < 45 ? 'driving' : i < 50 ? 'resting' : 'off_duty',
    rating: 4.0 + (i % 10) * 0.1,
    total_trips: 500 + i * 47,
    hire_date: `${2020 + (i % 4)}-${String((i % 12) + 1).padStart(2, '0')}-15`,
    emergency_contact_name: `María ${lastNames[(i + 3) % lastNames.length]}`,
    emergency_contact_phone: `+51 9${String(20000000 + i * 2222222).slice(-8)}`,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2026-04-14T00:00:00Z',
  }
})

export const mockTrips: Trip[] = Array.from({ length: 20 }, (_, i) => ({
  id: `t-${i + 1}`,
  route_id: 'ri-06',
  vehicle_id: `v-${(i % 50) + 1}`,
  driver_id: `d-${(i % 60) + 1}`,
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
  .slice(0, 15)
  .map((v, i) => ({
    vehicle_id: v.id,
    lat: -11.0175 + (i * 0.006) + (Math.random() * 0.003),
    lng: -77.6420 + (i * 0.002) + (Math.random() * 0.003),
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
]

export const mockDashboardStats: DashboardStats = {
  active_vehicles: 42,
  total_drivers: 58,
  trips_today: 156,
  passengers_today: 1248,
  revenue_today: 4368,
  active_routes: 1,
  fleet_health: {
    total_vehicles: 50,
    active: 42,
    in_maintenance: 5,
    inactive: 3,
    avg_age_years: 2.5,
    vehicles_needing_service: 4,
    soat_expiring_soon: 3,
    review_expiring_soon: 2,
  },
  recent_trips: mockTrips.slice(0, 5),
  alerts: mockAlerts,
}

export const mockMaintenanceRecords: MaintenanceRecord[] = Array.from({ length: 15 }, (_, i) => ({
  id: `m-${i + 1}`,
  vehicle_id: `v-${(i % 50) + 1}`,
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
