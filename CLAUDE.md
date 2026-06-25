# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Contexto del Proyecto

**VenezuelaSOSApp** es una aplicación web de emergencia creada en respuesta a los terremotos del 24 de junio de 2026 que afectaron Venezuela (magnitudes 7.2 y 7.5 — los más potentes en más de un siglo). El evento dejó más de 164 fallecidos, 971 heridos, edificios colapsados en Caracas y el aeropuerto de Maiquetía clausurado.

El objetivo es desplegar la app en menos de 72 horas. La prioridad absoluta es velocidad de entrega y accesibilidad bajo condiciones de conectividad limitada.

### Módulos prioritarios

1. **Localización y reporte de personas** — reportar que alguien está a salvo o necesita ayuda
2. **Reporte de personas desaparecidas** — publicar y buscar personas desaparecidas
3. **Registro de voluntarios** — inscripción de voluntarios para tareas de rescate
4. **Mapa de refugios y centros de acopio** — ubicaciones de refugios y puntos de distribución de ayuda

## Principios del MVP

- **Velocidad ante perfección** — lanzar rápido con funcionalidad básica funcional.
- **Sin registro obligatorio** — cualquier persona puede reportar sin crear cuenta.
- **Mobile-first** — la mayoría de usuarios accederán desde teléfonos con datos limitados.
- **Offline-tolerante** — los formularios deben poder llenarse sin conexión y enviarse cuando haya señal.
- **Multilingüe mínimo** — español como idioma principal, inglés como secundario.
- **Sin API Routes de Next.js** — toda la comunicación con la base de datos se hace desde el cliente usando el SDK de Supabase JS directamente. Las API Routes agregan complejidad innecesaria para este caso.
- **Criterios de aceptación mínimos** — se prefiere algo funcional a algo perfecto.

## Commands

```bash
npm run dev      # start dev server on http://localhost:3000
npm run build    # production build
npm run start    # serve production build
npm run lint     # run ESLint
```

## Stack

- **Next.js 16** with the App Router (`src/app/`)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** via `@tailwindcss/postcss` — no `tailwind.config.js`; configure in `src/app/globals.css` using `@theme`
- **ESLint 9** flat config (`eslint.config.mjs`)
- **TanStack Query v5** (`@tanstack/react-query`) — toda solicitud de datos usa `useQuery` / `useMutation`; nunca `fetch` o `useEffect` directos para datos remotos

## Architecture

Ver diagrama completo de capas en [`docs/architecture.md`](docs/architecture.md).

### Resumen de capas

| Capa | Tecnología | Notas |
|------|-----------|-------|
| Cliente | Next.js 16 (App Router) | Server Components para SSR, Client Components para formularios y mapa |
| Auth | Supabase Auth | Sesión anónima automática; cuentas opcionales para voluntarios; rol `admin` para moderación |
| Datos | Supabase JS SDK (cliente directo) | Sin API Routes — RLS es el único control de acceso |
| Tiempo real | Supabase Realtime | Websocket push de cambios a clientes suscritos |
| Offline | IndexedDB + Service Worker | Cola de envíos pendientes; sync al recuperar señal |
| Storage | Supabase Storage | Imágenes adjuntas a reportes de desaparecidos |

### Next.js App Router

### Next.js App Router

All routes live under `src/app/`. New routes: create `src/app/<route>/page.tsx`.

CSS custom properties go in `globals.css` under `@theme {}` — no `tailwind.config.js` needed.

Server Components are the default. Add `"use client"` only for components that need interactivity, browser APIs, or Supabase Realtime subscriptions.

### TanStack Query

`QueryProvider` (`src/providers/query-provider.tsx`) envuelve toda la app en `layout.tsx`. Configuración global: `staleTime: 30s`, `retry: 1`.

Convenciones:
- Funciones que llaman al SDK de Supabase viven en `src/lib/queries/<módulo>.ts` (ej: `shelters.ts`, `missing-persons.ts`)
- Query keys: `['tabla', { filtros }]` — ej: `['shelters', { city: 'Caracas' }]`
- `useQuery` para SELECT, `useMutation` para INSERT / UPDATE / DELETE
