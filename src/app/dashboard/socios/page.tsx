'use client'

import { useState, useMemo } from 'react'
import {
  Handshake,
  Users,
  Bus,
  DollarSign,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Star,
  TrendingUp,
  CreditCard,
  Shield,
  Calendar,
  MoreHorizontal,
  ChevronDown,
  Banknote,
  PieChart,
  ArrowUpRight,
  Clock,
} from 'lucide-react'
import { formatCurrency, getStatusColor, cn } from '@/lib/utils'

// ============================================================
// Mock Data: 50 Peruvian Partners
// ============================================================

const firstNames = [
  'Carlos', 'José', 'Luis', 'Miguel', 'Pedro', 'Juan', 'Ricardo', 'Fernando',
  'Raúl', 'Alberto', 'Sergio', 'Daniel', 'Marco', 'Hugo', 'Roberto',
  'Andrés', 'César', 'Víctor', 'Jorge', 'Eduardo', 'Gustavo', 'Héctor',
  'Óscar', 'Enrique', 'Manuel', 'Arturo', 'Ernesto', 'Alfredo', 'Gonzalo',
  'Iván', 'Walter', 'Frank', 'Jhon', 'David', 'Julio', 'Ángel',
  'Percy', 'Wilfredo', 'Elías', 'Néstor', 'Segundo', 'Santos', 'Emilio',
  'Rubén', 'Gregorio', 'Alejandro', 'Félix', 'Renato', 'Martín', 'Claudio',
]

const lastNames = [
  'García Flores', 'Rodríguez López', 'López Martínez', 'Martínez Sánchez',
  'Sánchez Rivera', 'Flores Mendoza', 'Rivera Torres', 'Torres Ramírez',
  'Ramírez Cruz', 'Cruz Morales', 'Morales Reyes', 'Reyes Gutiérrez',
  'Gutiérrez Díaz', 'Díaz Hernández', 'Hernández Vargas', 'Vargas Rojas',
  'Rojas Castillo', 'Castillo Jiménez', 'Jiménez Espinoza', 'Espinoza Chávez',
  'Chávez Medina', 'Medina Huamán', 'Huamán Quispe', 'Quispe Condori',
  'Condori Mamani', 'Mamani Paredes', 'Paredes Córdova', 'Córdova Vega',
  'Vega Salazar', 'Salazar Poma', 'Poma Ramos', 'Ramos Acosta',
  'Acosta Delgado', 'Delgado Cabrera', 'Cabrera Romero', 'Romero Ochoa',
  'Ochoa Peña', 'Peña Aguilar', 'Aguilar Villanueva', 'Villanueva Campos',
  'Campos Navarro', 'Navarro Ríos', 'Ríos Tapia', 'Tapia Pacheco',
  'Pacheco Lara', 'Lara Coronel', 'Coronel Bravo', 'Bravo Silva',
  'Silva Carrasco', 'Carrasco Vera',
]

type PartnerStatus = 'active' | 'suspended' | 'inactive'
type CommissionPayStatus = 'paid' | 'pending' | 'overdue' | 'partial'

interface MockPartner {
  id: string
  partner_number: number
  first_name: string
  last_name: string
  dni: string
  ruc: string | null
  phone: string
  email: string
  status: PartnerStatus
  join_date: string
  is_driver: boolean
  vehicles: { plate: string; internal: number }[]
  commission_status: CommissionPayStatus
  commission_amount: number
  commission_paid: number
  compliance_ok: boolean
  compliance_issues: number
  total_paid_ytd: number
}

const mockPartners: MockPartner[] = Array.from({ length: 50 }, (_, i) => {
  const status: PartnerStatus =
    i < 47 ? 'active' : i < 49 ? 'suspended' : 'inactive'
  const commStatuses: CommissionPayStatus[] = ['paid', 'pending', 'overdue', 'partial']
  const commStatus = status === 'active'
    ? commStatuses[i % 4]
    : 'overdue'
  const monthlyAmount = 1200 // S/600 per vehicle x 2 vehicles
  const paidAmount =
    commStatus === 'paid' ? monthlyAmount
    : commStatus === 'partial' ? monthlyAmount * 0.5
    : commStatus === 'pending' ? 0
    : 0

  return {
    id: `p-${i + 1}`,
    partner_number: i + 1,
    first_name: firstNames[i],
    last_name: lastNames[i],
    dni: `${10000000 + i * 178943}`,
    ruc: i % 3 === 0 ? `20${300000000 + i * 123456}` : null,
    phone: `+51 9${String(41000000 + i * 1737373).slice(-8)}`,
    email: `${firstNames[i].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}${i + 1}@transrosa.pe`,
    status,
    join_date: `${2018 + (i % 7)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    is_driver: i % 4 === 0,
    vehicles: [
      { plate: `${['A', 'B', 'C', 'D', 'F'][i % 5]}${String(i * 3 + 10).slice(-2)}${i % 2 === 0 ? 'A' : 'B'}-${String(100 + i * 7).slice(-3)}`, internal: i * 2 + 1 },
      { plate: `${['A', 'B', 'C', 'D', 'F'][i % 5]}${String(i * 3 + 11).slice(-2)}${i % 2 === 0 ? 'C' : 'D'}-${String(200 + i * 7).slice(-3)}`, internal: i * 2 + 2 },
    ],
    commission_status: commStatus,
    commission_amount: monthlyAmount,
    commission_paid: paidAmount,
    compliance_ok: i % 7 !== 0,
    compliance_issues: i % 7 === 0 ? 1 + (i % 3) : 0,
    total_paid_ytd: (3 + (i % 4)) * monthlyAmount,
  }
})

// Recent commission payments
interface RecentPayment {
  id: string
  partner_number: number
  partner_name: string
  amount: number
  period: 'daily' | 'monthly' | 'annual'
  status: CommissionPayStatus
  date: string
  method: string
}

const recentPayments: RecentPayment[] = [
  { id: 'cp-1', partner_number: 3, partner_name: 'Luis López Martínez', amount: 1200, period: 'monthly', status: 'paid', date: '2026-04-15', method: 'Yape' },
  { id: 'cp-2', partner_number: 7, partner_name: 'Ricardo Rivera Torres', amount: 600, period: 'monthly', status: 'partial', date: '2026-04-15', method: 'Efectivo' },
  { id: 'cp-3', partner_number: 12, partner_name: 'Daniel Reyes Gutiérrez', amount: 1200, period: 'monthly', status: 'paid', date: '2026-04-14', method: 'Transferencia' },
  { id: 'cp-4', partner_number: 1, partner_name: 'Carlos García Flores', amount: 50, period: 'daily', status: 'paid', date: '2026-04-14', method: 'Efectivo' },
  { id: 'cp-5', partner_number: 22, partner_name: 'César Chávez Medina', amount: 1200, period: 'monthly', status: 'paid', date: '2026-04-14', method: 'Plin' },
  { id: 'cp-6', partner_number: 45, partner_name: 'Gregorio Pacheco Lara', amount: 0, period: 'monthly', status: 'overdue', date: '2026-04-10', method: '-' },
  { id: 'cp-7', partner_number: 9, partner_name: 'Raúl Ramírez Cruz', amount: 6500, period: 'annual', status: 'paid', date: '2026-04-08', method: 'Transferencia' },
  { id: 'cp-8', partner_number: 31, partner_name: 'Frank Poma Ramos', amount: 1200, period: 'monthly', status: 'paid', date: '2026-04-07', method: 'Yape' },
]

// ============================================================
// Status Labels
// ============================================================

const partnerStatusLabels: Record<PartnerStatus, string> = {
  active: 'Activo',
  suspended: 'Suspendido',
  inactive: 'Inactivo',
}

const commissionStatusLabels: Record<CommissionPayStatus, string> = {
  paid: 'Pagado',
  pending: 'Pendiente',
  overdue: 'Vencido',
  partial: 'Parcial',
}

const commissionStatusColors: Record<CommissionPayStatus, string> = {
  paid: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-amber-100 text-amber-800',
  overdue: 'bg-red-100 text-red-800',
  partial: 'bg-orange-100 text-orange-800',
}

const periodLabels: Record<string, string> = {
  daily: 'Diaria',
  monthly: 'Mensual',
  annual: 'Anual',
}

// ============================================================
// Component
// ============================================================

export default function SociosPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [complianceFilter, setComplianceFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [commissionPeriodFilter, setCommissionPeriodFilter] = useState<string>('all')

  // KPI calculations
  const stats = useMemo(() => {
    const total = mockPartners.length
    const activos = mockPartners.filter((p) => p.status === 'active').length
    const totalVehiculos = mockPartners.length * 2
    const comisionesCobradas = mockPartners
      .filter((p) => p.commission_status === 'paid' || p.commission_status === 'partial')
      .reduce((sum, p) => sum + p.commission_paid, 0)
    const comisionesPendientes = mockPartners.reduce(
      (sum, p) => sum + (p.commission_amount - p.commission_paid),
      0
    )
    const cumplimiento = mockPartners.filter((p) => p.compliance_ok).length
    const tasaCumplimiento = Math.round((cumplimiento / total) * 100)

    return {
      total,
      activos,
      totalVehiculos,
      comisionesCobradas,
      comisionesPendientes,
      tasaCumplimiento,
    }
  }, [])

  // Filtered partners
  const filteredPartners = useMemo(() => {
    return mockPartners.filter((p) => {
      const fullName = `${p.first_name} ${p.last_name}`.toLowerCase()
      const matchesSearch =
        search === '' ||
        fullName.includes(search.toLowerCase()) ||
        p.dni.includes(search) ||
        p.phone.includes(search) ||
        String(p.partner_number).padStart(2, '0').includes(search)

      const matchesStatus = statusFilter === 'all' || p.status === statusFilter

      const matchesCompliance =
        complianceFilter === 'all' ||
        (complianceFilter === 'ok' && p.compliance_ok) ||
        (complianceFilter === 'issues' && !p.compliance_ok)

      return matchesSearch && matchesStatus && matchesCompliance
    })
  }, [search, statusFilter, complianceFilter])

  // Filtered commission payments
  const filteredPayments = useMemo(() => {
    if (commissionPeriodFilter === 'all') return recentPayments
    return recentPayments.filter((p) => p.period === commissionPeriodFilter)
  }, [commissionPeriodFilter])

  // KPI stat cards config
  const kpiCards = [
    {
      label: 'Total Socios',
      value: stats.total,
      format: 'number' as const,
      icon: <Handshake className="w-5 h-5" />,
      gradient: 'from-secondary-500 to-secondary-700',
      iconBg: 'bg-secondary-50 text-secondary-700',
    },
    {
      label: 'Socios Activos',
      value: stats.activos,
      format: 'number' as const,
      icon: <Users className="w-5 h-5" />,
      gradient: 'from-emerald-500 to-emerald-700',
      iconBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Total Vehículos',
      value: stats.totalVehiculos,
      format: 'number' as const,
      icon: <Bus className="w-5 h-5" />,
      gradient: 'from-blue-500 to-blue-700',
      iconBg: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Comisiones Cobradas',
      value: stats.comisionesCobradas,
      format: 'currency' as const,
      icon: <DollarSign className="w-5 h-5" />,
      gradient: 'from-emerald-500 to-teal-700',
      iconBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Comisiones Pendientes',
      value: stats.comisionesPendientes,
      format: 'currency' as const,
      icon: <Clock className="w-5 h-5" />,
      gradient: 'from-amber-500 to-orange-700',
      iconBg: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Tasa de Cumplimiento',
      value: stats.tasaCumplimiento,
      format: 'percent' as const,
      icon: <Shield className="w-5 h-5" />,
      gradient: 'from-primary-500 to-primary-700',
      iconBg: 'bg-primary-50 text-primary-700',
    },
  ]

  // Commission summary cards
  const commissionSummary = [
    {
      label: 'Comisión Diaria',
      rate: 'S/25 / vehículo',
      total: 'S/2,500 / día',
      icon: <Banknote className="w-5 h-5" />,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      label: 'Comisión Mensual',
      rate: 'S/600 / vehículo',
      total: 'S/60,000 / mes',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
    {
      label: 'Comisión Anual',
      rate: 'S/6,500 / vehículo',
      total: 'S/650,000 / año',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ============ Header ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gesti&oacute;n de Socios
          </h1>
          <p className="text-gray-500 mt-1">
            Administra los {stats.total} socios y sus {stats.totalVehiculos}{' '}
            veh&iacute;culos
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-5 h-5" />
          Registrar Socio
        </button>
      </div>

      {/* ============ KPI Stats Row ============ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.label}
            className="card !p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden"
          >
            {/* Subtle gradient accent on hover */}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300',
                kpi.gradient
              )}
            />
            <div className="relative flex items-center gap-3">
              <div className={cn('p-2 rounded-xl', kpi.iconBg)}>
                {kpi.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-gray-900 truncate">
                  {kpi.format === 'currency'
                    ? formatCurrency(kpi.value)
                    : kpi.format === 'percent'
                      ? `${kpi.value}%`
                      : kpi.value}
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  {kpi.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============ Commission Summary Cards ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {commissionSummary.map((comm) => (
          <div
            key={comm.label}
            className={cn(
              'card !p-4 border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300',
              comm.border
            )}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={cn('p-2 rounded-xl', comm.bg, comm.color)}>
                {comm.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{comm.label}</p>
                <p className="text-xs text-gray-500">{comm.rate}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className={cn('text-lg font-bold', comm.color)}>
                {comm.total}
              </p>
              <ArrowUpRight className={cn('w-4 h-4', comm.color)} />
            </div>
          </div>
        ))}
      </div>

      {/* ============ Search + Filters ============ */}
      <div className="card !p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, DNI, tel&eacute;fono o n&uacute;mero de socio..."
              className="input !pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                className="input !w-auto !py-2 !px-3 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="suspended">Suspendido</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <select
                className="input !w-auto !py-2 !px-3 text-sm"
                value={complianceFilter}
                onChange={(e) => setComplianceFilter(e.target.value)}
              >
                <option value="all">Cumplimiento</option>
                <option value="ok">Al d&iacute;a</option>
                <option value="issues">Con observaciones</option>
              </select>
            </div>
            {/* View toggle */}
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                className={cn(
                  'px-3 py-2 text-sm transition-colors',
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                )}
                onClick={() => setViewMode('grid')}
              >
                Cuadr&iacute;cula
              </button>
              <button
                className={cn(
                  'px-3 py-2 text-sm transition-colors',
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                )}
                onClick={() => setViewMode('list')}
              >
                Lista
              </button>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-3">
          Mostrando {filteredPartners.length} de {mockPartners.length} socios
        </p>
      </div>

      {/* ============ Partners Grid / List ============ */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPartners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      ) : (
        <div className="card !p-0 overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header">#</th>
                <th className="table-header">Socio</th>
                <th className="table-header">DNI</th>
                <th className="table-header">Tel&eacute;fono</th>
                <th className="table-header">Veh&iacute;culos</th>
                <th className="table-header">Estado</th>
                <th className="table-header">Comisi&oacute;n</th>
                <th className="table-header">Cumplimiento</th>
                <th className="table-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.map((partner) => (
                <tr
                  key={partner.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="table-cell">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-secondary-100 text-secondary-700 font-bold text-xs">
                      {String(partner.partner_number).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                        {partner.first_name[0]}
                        {partner.last_name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {partner.first_name} {partner.last_name}
                        </p>
                        {partner.is_driver && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                            Conductor
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell font-mono text-sm">
                    {partner.dni}
                  </td>
                  <td className="table-cell text-sm">{partner.phone}</td>
                  <td className="table-cell">
                    <div className="space-y-0.5">
                      {partner.vehicles.map((v) => (
                        <span
                          key={v.plate}
                          className="inline-block text-[10px] font-mono bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded mr-1"
                        >
                          #{String(v.internal).padStart(2, '0')} {v.plate}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span
                      className={cn(
                        'badge',
                        getStatusColor(partner.status)
                      )}
                    >
                      {partnerStatusLabels[partner.status]}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex flex-col gap-0.5">
                      <span
                        className={cn(
                          'badge text-[10px]',
                          commissionStatusColors[partner.commission_status]
                        )}
                      >
                        {commissionStatusLabels[partner.commission_status]}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatCurrency(partner.commission_paid)} /{' '}
                        {formatCurrency(partner.commission_amount)}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    {partner.compliance_ok ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-xs text-red-600 font-medium">
                          {partner.compliance_issues}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <a
                        href={`https://wa.me/51${partner.phone.replace(/\D/g, '').slice(-9)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-600 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredPartners.length === 0 && (
        <div className="card text-center py-12">
          <Handshake className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">
            No se encontraron socios
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Intenta ajustar los filtros de b&uacute;squeda
          </p>
        </div>
      )}

      {/* ============ Commission Tracker Panel ============ */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-50 text-primary-700">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">
                Seguimiento de Comisiones
              </h2>
              <p className="text-xs text-gray-500">
                Pagos recientes de socios
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              className="input !w-auto !py-2 !px-3 text-sm"
              value={commissionPeriodFilter}
              onChange={(e) => setCommissionPeriodFilter(e.target.value)}
            >
              <option value="all">Todos los per&iacute;odos</option>
              <option value="daily">Diaria</option>
              <option value="monthly">Mensual</option>
              <option value="annual">Anual</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="table-header">Socio</th>
                <th className="table-header">Per&iacute;odo</th>
                <th className="table-header">Monto</th>
                <th className="table-header">Estado</th>
                <th className="table-header">Fecha</th>
                <th className="table-header">M&eacute;todo</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-secondary-100 text-secondary-700 font-bold text-[10px]">
                        {String(payment.partner_number).padStart(2, '0')}
                      </span>
                      <span className="font-medium text-gray-900 text-sm">
                        {payment.partner_name}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm text-gray-700">
                      {periodLabels[payment.period]}
                    </span>
                  </td>
                  <td className="table-cell font-semibold text-sm">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="table-cell">
                    <span
                      className={cn(
                        'badge text-[10px]',
                        commissionStatusColors[payment.status]
                      )}
                    >
                      {commissionStatusLabels[payment.status]}
                    </span>
                  </td>
                  <td className="table-cell text-sm text-gray-600">
                    {payment.date}
                  </td>
                  <td className="table-cell text-sm text-gray-600">
                    {payment.method}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Partner Card Component
// ============================================================

function PartnerCard({ partner }: { partner: MockPartner }) {
  return (
    <div className="card !p-0 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
      {/* Card Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start gap-3">
          {/* Partner number badge */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
            #{String(partner.partner_number).padStart(2, '0')}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-gray-900 truncate">
              {partner.first_name} {partner.last_name}
            </p>
            <p className="text-xs text-gray-500 font-mono">
              DNI: {partner.dni}
            </p>
          </div>
          <span
            className={cn(
              'badge text-[10px] shrink-0',
              getStatusColor(partner.status)
            )}
          >
            {partnerStatusLabels[partner.status]}
          </span>
        </div>

        {/* Driver badge */}
        {partner.is_driver && (
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              <Star className="w-3 h-3" />
              Tambi&eacute;n es conductor
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="px-4 pb-3 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-gray-700 truncate">{partner.phone}</span>
        </div>
        {partner.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-gray-700 truncate">{partner.email}</span>
          </div>
        )}

        {/* Vehicles */}
        <div className="flex items-start gap-2 text-sm">
          <Bus className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <div className="flex flex-wrap gap-1">
            {partner.vehicles.map((v) => (
              <span
                key={v.plate}
                className="text-[10px] font-mono bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded"
              >
                #{String(v.internal).padStart(2, '0')} {v.plate}
              </span>
            ))}
          </div>
        </div>

        {/* Commission status */}
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-gray-400 shrink-0" />
          <span
            className={cn(
              'badge text-[10px]',
              commissionStatusColors[partner.commission_status]
            )}
          >
            {commissionStatusLabels[partner.commission_status]}
          </span>
          <span className="text-xs text-gray-500">
            {formatCurrency(partner.commission_paid)} /{' '}
            {formatCurrency(partner.commission_amount)}
          </span>
        </div>

        {/* Compliance */}
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-gray-400 shrink-0" />
          {partner.compliance_ok ? (
            <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              Documentos al d&iacute;a
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              {partner.compliance_issues} observaci&oacute;n
              {partner.compliance_issues > 1 ? 'es' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50/50 flex items-center justify-between">
        <span className="text-[10px] text-gray-400">
          YTD: {formatCurrency(partner.total_paid_ytd)}
        </span>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <a
            href={`https://wa.me/51${partner.phone.replace(/\D/g, '').slice(-9)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-600 transition-colors"
            title="Contactar por WhatsApp"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
