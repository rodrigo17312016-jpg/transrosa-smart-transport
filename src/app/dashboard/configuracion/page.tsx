'use client'

import { useState } from 'react'
import {
  Settings, Save, Building, MapPin, Clock, CreditCard, Bell,
  Shield, Users, Palette, Globe, Server, Database, Key
} from 'lucide-react'
import { APP_CONFIG, ROUTE_INFO } from '@/lib/constants'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'general', label: 'General', icon: Building },
  { id: 'ruta', label: 'Ruta', icon: MapPin },
  { id: 'tarifas', label: 'Tarifas', icon: CreditCard },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
  { id: 'seguridad', label: 'Seguridad', icon: Shield },
  { id: 'sistema', label: 'Sistema', icon: Server },
]

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-poppins)]">
            Configuración
          </h1>
          <p className="text-sm text-gray-500 mt-1">Administra la configuración del sistema TransRosa</p>
        </div>
        <button className="btn-primary text-sm">
          <Save className="w-4 h-4" />
          Guardar Cambios
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 shrink-0">
          <div className="card p-2 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  activeTab === id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <>
              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary-600" />
                  Información de la Empresa
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Razón Social</label>
                    <input type="text" defaultValue={APP_CONFIG.fullName} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">RUC</label>
                    <input type="text" defaultValue={APP_CONFIG.ruc} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
                    <input type="text" defaultValue={APP_CONFIG.contact.phone} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input type="email" defaultValue={APP_CONFIG.contact.email} className="input" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Dirección</label>
                    <input type="text" defaultValue={APP_CONFIG.contact.address} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Gerente General</label>
                    <input type="text" defaultValue={APP_CONFIG.legal.gerente} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Resolución</label>
                    <input type="text" defaultValue={APP_CONFIG.legal.resolucion} className="input" readOnly />
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary-600" />
                  Redes Sociales
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Facebook</label>
                    <input type="url" defaultValue={APP_CONFIG.social.facebook} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram</label>
                    <input type="url" defaultValue={APP_CONFIG.social.instagram} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp</label>
                    <input type="url" defaultValue={APP_CONFIG.social.whatsapp} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">TikTok</label>
                    <input type="url" defaultValue={APP_CONFIG.social.tiktok} className="input" />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'ruta' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-600" />
                Configuración de Ruta RI-06
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Código de Ruta</label>
                  <input type="text" defaultValue={ROUTE_INFO.code} className="input" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                  <input type="text" defaultValue={ROUTE_INFO.name} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Distancia Ida (km)</label>
                  <input type="number" defaultValue={ROUTE_INFO.distances.ida} step="0.01" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Distancia Vuelta (km)</label>
                  <input type="number" defaultValue={ROUTE_INFO.distances.vuelta} step="0.01" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Duración Estimada (min)</label>
                  <input type="number" defaultValue={ROUTE_INFO.schedule.estimatedDuration} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Frecuencia (min)</label>
                  <input type="number" defaultValue={ROUTE_INFO.schedule.frequency} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Primera Salida</label>
                  <input type="time" defaultValue={ROUTE_INFO.schedule.firstDeparture} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Última Salida</label>
                  <input type="time" defaultValue={ROUTE_INFO.schedule.lastDeparture} className="input" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tarifas' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary-600" />
                Tarifas del Servicio
              </h2>
              <div className="space-y-4">
                {Object.entries(ROUTE_INFO.fare).map(([type, amount]) => (
                  <div key={type} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">{type === 'regular' ? 'Regular' : type === 'student' ? 'Estudiante' : type === 'senior' ? 'Adulto Mayor' : 'Niño'}</p>
                      <p className="text-xs text-gray-500">
                        {type === 'student' ? 'Con carnet vigente' : type === 'senior' ? '60+ años' : type === 'child' ? 'Menores de 12 años' : 'Tarifa estándar'}
                      </p>
                    </div>
                    <div className="w-32">
                      <input type="number" defaultValue={amount} step="0.50" className="input text-right font-semibold" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notificaciones' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary-600" />
                Preferencias de Notificaciones
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Alerta de SOAT por vencer', desc: 'Notificar cuando el SOAT vence en menos de 30 días', default: true },
                  { label: 'Revisión técnica próxima', desc: 'Alerta de revisión técnica próxima', default: true },
                  { label: 'Mantenimiento programado', desc: 'Recordatorio de mantenimientos programados', default: true },
                  { label: 'GPS sin señal', desc: 'Alerta cuando un vehículo pierde señal GPS', default: true },
                  { label: 'Meta de ingresos alcanzada', desc: 'Notificación cuando se alcanza la meta diaria', default: false },
                  { label: 'Nuevo conductor registrado', desc: 'Cuando se registra un nuevo conductor', default: false },
                  { label: 'Reporte diario automático', desc: 'Enviar resumen diario al email del admin', default: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'seguridad' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-600" />
                Seguridad y Acceso
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Roles de Usuario</h3>
                  <div className="space-y-2">
                    {[
                      { role: 'Admin', desc: 'Acceso completo al sistema', count: 2 },
                      { role: 'Gerente', desc: 'Gestión de flota, conductores y finanzas', count: 3 },
                      { role: 'Despachador', desc: 'Programación de viajes y boletos', count: 5 },
                      { role: 'Conductor', desc: 'Portal del conductor', count: 60 },
                    ].map((r) => (
                      <div key={r.role} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Users className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{r.role}</p>
                            <p className="text-xs text-gray-500">{r.desc}</p>
                          </div>
                        </div>
                        <span className="badge bg-gray-100 text-gray-600">{r.count} usuarios</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">API Keys</h3>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Key className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">Supabase Anon Key</span>
                    </div>
                    <code className="text-xs text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded">
                      eyJhbGciOiJIUzI1NiIs...****
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sistema' && (
            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Server className="w-5 h-5 text-primary-600" />
                Información del Sistema
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Plataforma', value: 'TransRosa Smart Transport v1.0.0' },
                  { label: 'Framework', value: 'Next.js 15 + React 19' },
                  { label: 'Base de Datos', value: 'Supabase (PostgreSQL + PostGIS)' },
                  { label: 'Hosting', value: 'Vercel Edge Network' },
                  { label: 'CDN', value: 'Vercel Edge (Global)' },
                  { label: 'Monitoreo GPS', value: 'WebSocket Realtime' },
                  { label: 'IA Engine', value: 'Claude AI (Anthropic)' },
                  { label: 'Estado', value: 'Operativo ✓' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
