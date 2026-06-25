# Arquitectura de Capas — VenezuelaSOSApp

## Diagrama

```mermaid
graph TD
    subgraph Usuarios["Tipos de Usuario"]
        U1["👤 Ciudadano\n(anónimo)"]
        U2["🙋 Voluntario\n(cuenta opcional)"]
        U3["🔑 Administrador\n(cuenta requerida)"]
    end

    subgraph CapaAuth["Capa de Autenticación · Supabase Auth"]
        A1["Sesión Anónima\nauto-generada al primer acceso"]
        A2["Email / OAuth\nacceso voluntario"]
        A3["Email + rol admin\nacceso restringido"]
    end

    subgraph CapaCliente["Capa Cliente · Next.js (Browser / PWA)"]
        SC["Server Components\nSSR — carga inicial y SEO"]
        CC["Client Components\nformularios · mapa · tiempo real"]
        TQ["TanStack Query\ncaché · estado de servidor · mutaciones"]
        OF["Capa Offline\nIndexedDB + cola de envíos pendientes"]
    end

    subgraph CapaDatos["Capa de Datos · Supabase JS SDK (directo desde cliente)"]
        SDK["supabase-js\n⚠ sin API Routes de Next.js"]
        RLS["Row Level Security\núnico control de acceso a datos"]
    end

    subgraph CapaServicios["Servicios · Supabase"]
        DB[("PostgreSQL\nfuente de verdad")]
        RT["Realtime\nwebsocket — difusión de cambios"]
        STG["Storage\nimágenes de reportes"]
    end

    subgraph Tablas["Tablas Principales"]
        T1["person_reports\nreportes de personas a salvo / en peligro"]
        T2["missing_persons\ndesaparecidos con foto y ubicación"]
        T3["volunteers\ndatos y disponibilidad de voluntarios"]
        T4["shelters\nrefugios y centros de acopio con coordenadas"]
    end

    U1 --> A1
    U2 --> A2
    U3 --> A3

    A1 & A2 & A3 --> CC
    SC -- "datos públicos / SSR" --> DB

    CC --> TQ
    TQ -- "useQuery / useMutation" --> SDK
    OF -- "sync al recuperar señal" --> SDK

    SDK --> RLS
    RLS -- "INSERT / SELECT / UPDATE\nsegún rol y propiedad del registro" --> DB

    DB --> RT
    RT -- "push de cambios en tiempo real" --> CC

    DB --> STG
    DB --- T1 & T2 & T3 & T4
```

## Descripción de Capas

### Usuarios y Autenticación

| Tipo | Auth | Permisos |
|------|------|----------|
| Ciudadano | Sesión anónima automática (Supabase anonymous auth) | Crear y ver reportes; buscar desaparecidos; ver refugios |
| Voluntario | Email / OAuth (opcional) | Todo lo anterior + gestionar su perfil de voluntario |
| Administrador | Email con rol `admin` | Verificar/moderar reportes; crear y actualizar refugios |

La sesión anónima se crea automáticamente al primer acceso — el usuario nunca ve una pantalla de login salvo que quiera crear una cuenta de voluntario.

### Capa Cliente (Next.js)

- **Server Components**: cargan datos públicos en SSR (lista de refugios, conteos). Sin JS enviado al cliente; buenos para SEO y primera carga rápida.
- **Client Components**: formularios de reporte, mapa interactivo, suscripciones Realtime. Nunca hacen `fetch` directo — siempre a través de TanStack Query.
- **TanStack Query**: capa de estado de servidor entre los Client Components y el SDK de Supabase. Gestiona caché, revalidación, estados de carga/error y mutaciones optimistas. `QueryProvider` está en `src/providers/query-provider.tsx` y envuelve toda la app desde `layout.tsx`.
- **Capa Offline**: los formularios guardan el payload en IndexedDB. Un Service Worker detecta reconexión y dispara los envíos pendientes.

### TanStack Query — Convenciones

| Concepto | Patrón |
|----------|--------|
| Funciones de acceso a datos | `src/lib/queries/<módulo>.ts` (ej: `shelters.ts`) |
| Query keys | `['tabla', { filtros }]` — ej: `['shelters', { city: 'Caracas' }]` |
| Lecturas (SELECT) | `useQuery` |
| Escrituras (INSERT / UPDATE / DELETE) | `useMutation` |
| `staleTime` global | 30 segundos |
| `retry` global | 1 (conservar datos móviles) |

### Seguridad (RLS)

Como no hay API Routes, las políticas de Row Level Security en PostgreSQL son la **única barrera de seguridad**. Reglas clave:

- Cualquier sesión (anónima o autenticada) puede leer datos públicos.
- Solo el creador del registro (por `user_id`) puede editarlo.
- Solo el rol `admin` puede modificar la tabla `shelters` y verificar reportes.
- Nunca exponer datos de contacto privados a sesiones anónimas.

### Distribución en Tiempo Real

Supabase Realtime transmite cambios de la base de datos vía websocket a todos los clientes suscritos. Casos de uso:

- Nuevo refugio disponible → el mapa se actualiza en todos los dispositivos conectados.
- Persona reportada como a salvo → el reporte de desaparecido se marca automáticamente.
