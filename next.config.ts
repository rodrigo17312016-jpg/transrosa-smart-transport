import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  // ===== GITHUB PAGES CONFIG =====
  output: 'export',                    // Genera HTML estático (no necesita servidor Node)
  basePath: isProd ? '/transrosa-smart-transport' : '',  // Ruta base en GitHub Pages
  assetPrefix: isProd ? '/transrosa-smart-transport/' : '', // Prefijo para assets
  trailingSlash: true,                 // Agrega / al final de las URLs (requerido para GH Pages)

  images: {
    unoptimized: true,                 // GitHub Pages no soporta optimización de imágenes de Next.js
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },
}

export default nextConfig
