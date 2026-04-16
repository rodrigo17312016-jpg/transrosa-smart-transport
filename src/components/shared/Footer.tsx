import Link from 'next/link'
import {
  Bus, MapPin, Phone, Mail, Clock,
  Facebook, Instagram, MessageCircle,
  Shield, Award, Zap
} from 'lucide-react'
import { APP_CONFIG, ROUTE_INFO } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="relative bg-secondary-900 text-white overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-accent-500 to-primary-600" />

      {/* CTA Banner */}
      <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-poppins)]">
                Viaja con la mejor tecnología
              </h3>
              <p className="text-white/60 mt-2">
                Descarga nuestra app y compra tus boletos desde tu celular
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/boletos" className="btn-primary">
                Comprar Boleto
              </Link>
              <Link href="/rutas" className="btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                Ver Rutas
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold font-[family-name:var(--font-poppins)]">
                  Trans<span className="text-primary-400">Rosa</span>
                </h4>
                <p className="text-[10px] text-white/40 tracking-wider">SMART TRANSPORT</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {APP_CONFIG.fullName}. Conectando Vegueta y Huacho con seguridad,
              puntualidad y tecnología de última generación.
            </p>
            <div className="flex items-center gap-3">
              <a href={APP_CONFIG.social.facebook} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={APP_CONFIG.social.instagram} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={APP_CONFIG.social.whatsapp} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-green-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-6">
              Enlaces Rápidos
            </h5>
            <ul className="space-y-3">
              {[
                { label: 'Inicio', href: '/' },
                { label: 'Nuestras Rutas', href: '/rutas' },
                { label: 'Horarios', href: '/horarios' },
                { label: 'Comprar Boletos', href: '/boletos' },
                { label: 'Sobre Nosotros', href: '/nosotros' },
                { label: 'Contacto', href: '/contacto' },
                { label: 'Términos y Condiciones', href: '/terminos' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Info */}
          <div>
            <h5 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-6">
              Nuestro Servicio
            </h5>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-white/80">Ruta {ROUTE_INFO.code}</p>
                  <p className="text-xs text-white/40">Vegueta ↔ Huacho ({ROUTE_INFO.distances.total} km)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-white/80">5:00 AM - 9:00 PM</p>
                  <p className="text-xs text-white/40">Salidas cada {ROUTE_INFO.schedule.frequency} minutos</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Bus className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-white/80">{ROUTE_INFO.fleet.totalVehicles} Unidades</p>
                  <p className="text-xs text-white/40">Minivans modernas y cómodas</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-6">
              Contacto
            </h5>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <p className="text-sm text-white/60">{APP_CONFIG.contact.address}</p>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <p className="text-sm text-white/60">{APP_CONFIG.contact.phone}</p>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <p className="text-sm text-white/60">{APP_CONFIG.contact.email}</p>
              </li>
            </ul>

            {/* Certifications */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-white/60">Autorizado MTC</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg">
                <Award className="w-3.5 h-3.5 text-accent-400" />
                <span className="text-xs text-white/60">SOAT Vigente</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} {APP_CONFIG.fullName}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-sm text-white/40">
            <Zap className="w-3.5 h-3.5 text-accent-400" />
            <span>Powered by <span className="text-white/60 font-medium">TransRosa</span> Smart Platform</span>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-32 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl pointer-events-none" />
    </footer>
  )
}
