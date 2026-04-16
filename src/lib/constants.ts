// ============================================================
// TransRosa - Constants & Configuration
// ============================================================

export const APP_CONFIG = {
  name: 'TransRosa',
  fullName: 'Empresa de Transportes Santa Rosa de Vegueta S.A.',
  shortName: 'ET Santa Rosa',
  ruc: '20361745281',
  slogan: 'Cooperativa de transporte con 50 socios conectando Vegueta y Huacho',
  description: 'Plataforma inteligente de gestión de transporte público interurbano',
  version: '1.0.0',
  contact: {
    phone: '+51 993 370 254',
    email: 'info@transrosa.pe',
    address: 'Calle Adan Acevedo N\u00ba701, Huacho, Lima',
  },
  social: {
    facebook: 'https://facebook.com/transrosa',
    instagram: 'https://instagram.com/transrosa',
    tiktok: 'https://tiktok.com/@transrosa',
    whatsapp: 'https://wa.me/51993370254',
  },
  legal: {
    gerente: 'Francisco Edwer Granados Rivera',
    resolucion: 'Resolución Sub Gerencial N°073-2025-SGTYSV/MPH',
    ordenanza: 'Ordenanza Municipal N° 014-2016-MPH',
    ruta: 'Ruta Interurbana N° 06 (RI-06)',
  },
} as const

export const ROUTE_INFO = {
  code: 'RI-06',
  name: 'Vegueta - Huacho',
  origin: {
    name: 'Vegueta',
    address: 'Av. 200 Millas cdra. 1',
    zone: 'C.P. 200 Millas',
    district: 'Vegueta',
    lat: -11.0175,
    lng: -77.6420,
  },
  destination: {
    name: 'Huacho',
    address: 'Av. Luna Arrieta / Ca. Miguel Grau',
    zone: 'Huacho',
    district: 'Huacho',
    lat: -11.1075,
    lng: -77.6089,
  },
  distances: {
    ida: 21.67,
    vuelta: 21.48,
    total: 43.15,
  },
  itinerary: {
    ida: [
      'Av. 200 Millas', 'Av. Augusto B. Leguía', 'Ca. Bolognesi',
      'Ca. Gamarra', 'Calle Sin Nombre', 'Av. Los Libertadores',
      'Av. San Isidro', 'Ca. Bolívar', 'Ca. Vegueta',
      'AA.HH. Bellavista', 'Ca. Sin Nombre', 'Carretera Principal Vegueta',
      'Ant. Carr. Panamericana Norte', 'Av. Coronel Portillo',
      'Puente Huaura', 'Ant. Carr. Panamericana Norte',
      'Óvalo de Huacho', 'Av. Túpac Amaru', 'Av. 28 de Julio',
      'Jr. Simón Bolívar', 'Av. Leoncio Prado', 'Jr. San Román',
      'Jr. José Gálvez', 'Av. Echenique', 'Av. Mercedes Indacochea',
      'Av. Aminco Mar', 'Av. Luna Arrieta',
    ],
    vuelta: [
      'Av. Luna Arrieta', 'Av. Aminco Mar', 'Av. Mercedes Indacochea',
      'Av. Echenique', 'Av. Miguel Grau', 'Av. Espinar',
      'Ant. Carr. Panamericana Norte', 'Óvalo de Huacho',
      'Ant. Carr. Panamericana Norte', 'Puente Huaura',
      'Av. Coronel Portillo', 'Ant. Carr. Panamericana Norte',
      'Carretera A Vegueta', 'Ca. Sin Nombre', 'AA.HH. Bellavista',
      'Ca. Vegueta', 'Ca. Bolívar', 'Av. San Isidro',
      'Av. Los Libertadores', 'Av. Grau', 'Ca. Tarapacá',
      'Ca. San Martín', 'Ca. Bolognesi', 'Av. Augusto B. Leguía',
      'Av. 200 Millas',
    ],
  },
  schedule: {
    firstDeparture: '05:00',
    lastDeparture: '21:00',
    frequency: 10, // minutes
    estimatedDuration: 45, // minutes
  },
  fleet: {
    totalVehicles: 100,
    totalPartners: 50,
    vehiclesPerPartner: 2,
    capacity: 11, // including driver
    passengerCapacity: 10,
    vehicleType: 'Minivan',
    categories: ['M1', 'M2'],
  },
  fare: {
    regular: 3.50,
    student: 2.00,
    senior: 2.00,
    child: 1.50,
  },
} as const

export const COMMISSION_RATES = {
  daily: 25,      // S/25 per vehicle per day
  monthly: 600,   // S/600 per vehicle per month
  annual: 6500,   // S/6,500 per vehicle per year
} as const

export const MAP_CONFIG = {
  center: { lat: -11.0625, lng: -77.6254 },
  zoom: 13,
  minZoom: 11,
  maxZoom: 18,
  tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
} as const

export const COLORS = {
  primary: '#DC2626',    // Rojo Santa Rosa
  secondary: '#1E3A5F',  // Azul oscuro
  accent: '#F59E0B',     // Amarillo/dorado
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  dark: '#111827',
  light: '#F9FAFB',
} as const

export const NAV_ITEMS = [
  { label: 'Inicio', href: '/' },
  { label: 'Rutas', href: '/rutas' },
  { label: 'Horarios', href: '/horarios' },
  { label: 'Boletos', href: '/boletos' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
] as const

export const DASHBOARD_NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Socios', href: '/dashboard/socios', icon: 'Handshake' },
  { label: 'Flota', href: '/dashboard/flota', icon: 'Bus' },
  { label: 'Conductores', href: '/dashboard/conductores', icon: 'Users' },
  { label: 'GPS en Vivo', href: '/dashboard/gps', icon: 'MapPin' },
  { label: 'Viajes', href: '/dashboard/viajes', icon: 'Route' },
  { label: 'Boletos', href: '/dashboard/boletos', icon: 'Ticket' },
  { label: 'Mantenimiento', href: '/dashboard/mantenimiento', icon: 'Wrench' },
  { label: 'Finanzas', href: '/dashboard/finanzas', icon: 'DollarSign' },
  { label: 'Analytics IA', href: '/dashboard/analytics', icon: 'Brain' },
  { label: 'Configuración', href: '/dashboard/configuracion', icon: 'Settings' },
] as const
