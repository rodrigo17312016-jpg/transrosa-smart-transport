# 🚐 TransRosa — Smart Transport Platform

<div align="center">

**Plataforma Inteligente de Gestión de Transporte Público**

*Empresa de Transportes Santa Rosa de Vegueta S.A.*

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)

[Demo en Vivo](#) · [Documentación](#arquitectura) · [Reportar Bug](../../issues) · [Solicitar Feature](../../issues)

</div>

---

## Acerca del Proyecto

**TransRosa** es una plataforma integral de gestión de transporte público interurbano, diseñada para modernizar las operaciones de la Empresa de Transportes Santa Rosa de Vegueta S.A. en la ruta **Huacho ↔ Vegueta (RI-06)**.

Implementa las mismas tecnologías que utilizan las empresas de transporte europeas, adaptadas a la realidad del transporte público peruano:

- **GPS en Tiempo Real** — Tracking de 50+ unidades con WebSockets
- **Boletos Digitales QR** — Compra online con Yape, Plin y tarjeta
- **IA Predictiva** — Predicción de demanda y optimización de rutas
- **Dashboard Enterprise** — Gestión 360° de flota, conductores y finanzas
- **PWA Mobile** — App instalable sin App Store

### Datos de la Empresa

| Dato | Valor |
|------|-------|
| **Razón Social** | Empresa de Transportes Santa Rosa de Vegueta S.A. |
| **RUC** | 20361745281 |
| **Ruta** | Interurbana N° 06 (RI-06) — Vegueta ↔ Huacho |
| **Distancia** | 43.15 km (ida y vuelta) |
| **Flota** | 50+ minivans (11 pasajeros c/u) |
| **Autorización** | Resolución Sub Gerencial N°073-2025-SGTYSV/MPH |
| **Gerente General** | Francisco Edwer Granados Rivera |

---

## Arquitectura

```
transrosa/
├── public/                      # Assets estáticos y PWA
│   ├── manifest.json            # PWA manifest
│   └── icons/                   # Iconos de la app
├── src/
│   ├── app/                     # App Router (Next.js 15)
│   │   ├── page.tsx             # Landing page principal
│   │   ├── layout.tsx           # Root layout
│   │   ├── globals.css          # Design system + Tailwind
│   │   ├── rutas/               # Página de rutas
│   │   ├── horarios/            # Horarios de servicio
│   │   ├── boletos/             # Compra de boletos
│   │   ├── nosotros/            # Sobre nosotros
│   │   ├── contacto/            # Contacto
│   │   └── dashboard/           # Panel administrativo
│   │       ├── layout.tsx       # Dashboard layout (sidebar)
│   │       ├── page.tsx         # Dashboard overview
│   │       ├── flota/           # Gestión de flota
│   │       ├── conductores/     # Gestión de conductores
│   │       ├── gps/             # GPS en tiempo real
│   │       ├── viajes/          # Gestión de viajes
│   │       ├── boletos/         # Gestión de boletos
│   │       ├── mantenimiento/   # Mantenimiento vehicular
│   │       ├── finanzas/        # Reportes financieros
│   │       ├── analytics/       # Analytics & IA
│   │       └── configuracion/   # Configuración del sistema
│   ├── components/
│   │   └── shared/              # Componentes compartidos
│   │       ├── Navbar.tsx       # Navegación pública
│   │       └── Footer.tsx       # Footer
│   ├── lib/
│   │   ├── constants.ts         # Configuración y constantes
│   │   ├── utils.ts             # Utilidades (cn, formatters)
│   │   ├── mock-data.ts         # Datos de demostración
│   │   └── supabase/            # Cliente Supabase
│   │       ├── client.ts        # Browser client
│   │       └── server.ts        # Server client
│   └── types/
│       └── index.ts             # TypeScript type definitions
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Schema completo de BD
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── postcss.config.mjs
```

---

## Tech Stack

### Frontend
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Next.js** | 15.1 | Framework React con App Router |
| **React** | 19.0 | UI Library |
| **TypeScript** | 5.7 | Type Safety |
| **Tailwind CSS** | 4.0 | Utility-first CSS |
| **Framer Motion** | 12.0 | Animaciones fluidas |
| **Recharts** | 2.15 | Gráficos y analytics |
| **Leaflet** | 1.9 | Mapas interactivos |
| **Lucide React** | 0.469 | Sistema de iconos |

### Backend
| Tecnología | Uso |
|-----------|-----|
| **Supabase** | BaaS (Auth, Database, Realtime, Storage) |
| **PostgreSQL** | Base de datos relacional |
| **PostGIS** | Extensión geoespacial para GPS |
| **Edge Functions** | Serverless functions |
| **Realtime** | WebSockets para GPS y alertas |

### Herramientas
| Herramienta | Uso |
|-----------|-----|
| **Zustand** | State management |
| **date-fns** | Manipulación de fechas |
| **QRCode** | Generación de códigos QR |
| **next-themes** | Dark mode |

---

## Módulos del Sistema

### 1. Página Web Pública
- Landing page premium con animaciones
- Información de rutas e itinerarios
- Horarios en tiempo real
- Sistema de compra de boletos online
- Página institucional (Nosotros)
- Formulario de contacto

### 2. Dashboard Administrativo
- **Overview** — KPIs en tiempo real, gráficos de revenue, alertas
- **Flota** — Gestión de 50+ vehículos, status, documentos
- **Conductores** — 60+ conductores, licencias, ratings
- **GPS en Vivo** — Tracking en mapa con posiciones en tiempo real
- **Viajes** — Programación y seguimiento de viajes
- **Boletos** — Venta digital con QR, métodos de pago
- **Mantenimiento** — Programación preventiva y correctiva
- **Finanzas** — Ingresos, gastos, márgenes, reportes
- **Analytics IA** — Predicción de demanda, optimización de rutas
- **Configuración** — Parámetros del sistema

### 3. Sistema de Boletos Digitales
- Compra online con múltiples métodos de pago
- Generación de QR codes únicos
- Validación en tiempo real al abordar
- Soporte para Yape, Plin, tarjeta y efectivo

### 4. GPS y Tracking
- Posiciones en tiempo real via WebSockets
- Historial de recorridos
- Alertas de desvío de ruta
- Velocidad y dirección de cada unidad

### 5. Analytics con IA
- Predicción de demanda por hora/día
- Optimización de frecuencia de salidas
- Alertas predictivas de mantenimiento
- Análisis de patrones de pasajeros

---

## Base de Datos

### Esquema Principal

```
profiles          — Usuarios del sistema (auth)
routes            — Rutas de transporte (RI-06)
route_stops       — Paraderos de cada ruta
vehicles          — Flota vehicular (50+ unidades)
drivers           — Conductores (60+)
trips             — Viajes programados y en curso
tickets           — Boletos digitales con QR
gps_positions     — Posiciones GPS (time-series)
maintenance_records — Mantenimiento vehicular
daily_revenue     — Ingresos diarios agregados
alerts            — Alertas del sistema
fuel_records      — Registros de combustible
```

### Features de BD
- **PostGIS** para datos geoespaciales
- **Row Level Security (RLS)** para control de acceso
- **Realtime subscriptions** para GPS y alertas
- **Triggers** automáticos para cálculos
- **Generated columns** para revenue neto

---

## Instalación

### Prerrequisitos
- Node.js 18+
- npm o pnpm
- Cuenta en [Supabase](https://supabase.com) (gratuita)

### Setup

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/transrosa-smart-transport.git
cd transrosa-smart-transport

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# 4. Ejecutar en desarrollo
npm run dev

# 5. Abrir en el navegador
# http://localhost:3000          → Página web pública
# http://localhost:3000/dashboard → Panel administrativo
```

### Configurar Supabase

1. Crear un proyecto en [supabase.com](https://supabase.com)
2. Ejecutar el migration en SQL Editor:
   ```sql
   -- Copiar contenido de supabase/migrations/001_initial_schema.sql
   ```
3. Copiar las API keys a `.env.local`

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Linting con ESLint |
| `npm run db:types` | Generar tipos desde Supabase |

---

## Despliegue

### GitHub Pages (Configurado)

El proyecto ya está configurado para despliegue automático en GitHub Pages.

**¿Cómo funciona?**
1. Haces `git push` a la rama `main`
2. GitHub Actions ejecuta el workflow `.github/workflows/deploy.yml`
3. Se hace `npm run build` (genera HTML estático en `/out`)
4. Se despliega automáticamente a GitHub Pages

**URL de producción:**
```
https://rodrigo17312016-jpg.github.io/transrosa-smart-transport/
```

**Configuración clave en `next.config.ts`:**
```ts
output: 'export'           // HTML estático (sin servidor Node)
basePath: '/transrosa-smart-transport'  // Ruta base en GitHub Pages
trailingSlash: true         // Requerido para GitHub Pages
images: { unoptimized: true }  // GH Pages no soporta optimización
```

**Variables de entorno (opcionales):**
Configurar en GitHub → Settings → Secrets → Actions:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Roadmap

- [x] Landing page premium
- [x] Dashboard administrativo completo
- [x] Sistema de gestión de flota
- [x] Gestión de conductores
- [x] GPS tracking (UI)
- [x] Sistema de boletos digitales
- [x] Módulo de mantenimiento
- [x] Reportes financieros
- [x] Analytics con IA
- [x] Base de datos PostgreSQL/PostGIS
- [x] PWA manifest
- [ ] Integración real con dispositivos GPS
- [ ] Pasarela de pagos (Yape/Plin API)
- [ ] App móvil nativa (React Native)
- [ ] Sistema de notificaciones push
- [ ] Integración con SUNAT para facturación
- [ ] Panel del conductor (móvil)
- [ ] Machine Learning para predicciones

---

## Información Legal

**Empresa de Transportes Santa Rosa de Vegueta S.A.**
- RUC: 20361745281
- Autorización: Resolución Sub Gerencial N°073-2025-SGTYSV/MPH
- Ruta: Interurbana N° 06 (RI-06)
- Provincia de Huaura, Departamento de Lima, Perú

---

## Licencia

Este proyecto es privado y de uso exclusivo de la Empresa de Transportes Santa Rosa de Vegueta S.A.

---

<div align="center">

**Desarrollado con tecnología de punta para el transporte público peruano**

Powered by **TransRosa** Smart Platform

</div>
