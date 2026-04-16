'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, MapPin, Phone, Bus } from 'lucide-react'
import { NAV_ITEMS, APP_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top Bar */}
      <div className="hidden lg:block bg-secondary-900 text-white/80 text-sm py-2">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Ruta: Vegueta ↔ Huacho (RI-06)
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              {APP_CONFIG.contact.phone}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-accent-400 font-medium">Horario: 5:00 AM - 9:00 PM</span>
            <Link
              href="/dashboard"
              className="px-3 py-1 bg-primary-600 text-white rounded-lg text-xs font-semibold hover:bg-primary-500 transition-colors"
            >
              Panel Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5'
            : 'bg-white/80 backdrop-blur-md'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-600/30 group-hover:shadow-xl group-hover:shadow-primary-600/40 transition-all duration-300">
                  <Bus className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">AI</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-secondary-900 font-[family-name:var(--font-poppins)]">
                  Trans<span className="text-primary-600">Rosa</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-medium -mt-0.5 tracking-wide">
                  SMART TRANSPORT
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-xl hover:bg-primary-50 transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/boletos" className="btn-primary text-sm py-2.5">
                Comprar Boleto
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 animate-slide-up">
            <div className="px-4 py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 px-4">
                <Link href="/boletos" className="btn-primary w-full text-center text-sm">
                  Comprar Boleto
                </Link>
              </div>
              <div className="pt-2 px-4">
                <Link href="/dashboard" className="btn-secondary w-full text-center text-sm">
                  Panel Admin
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
