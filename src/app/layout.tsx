import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'TransRosa | Plataforma Inteligente de Transporte',
    template: '%s | TransRosa',
  },
  description:
    'Sistema de gestión de transporte inteligente para la Empresa de Transportes Santa Rosa de Vegueta S.A. Ruta Huacho - Vegueta con tracking GPS en tiempo real, boletos digitales e IA.',
  keywords: [
    'transporte', 'Huacho', 'Vegueta', 'minivan', 'Santa Rosa',
    'GPS', 'boletos', 'tracking', 'transporte público', 'Lima',
  ],
  authors: [{ name: 'TransRosa Tech' }],
  openGraph: {
    title: 'TransRosa - Transporte Inteligente Huacho ↔ Vegueta',
    description: 'Viaja seguro con tecnología de última generación. GPS en vivo, boletos digitales y más.',
    type: 'website',
    locale: 'es_PE',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#DC2626',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
