# JobMatch Frontend - Documentación de Estructura

## Descripción General

JobMatch es una plataforma inteligente de matching entre candidatos y vacantes con automatización mediante agentes IA. Este proyecto implementa una estructura frontend modular siguiendo las mejores prácticas de Next.js 14, React 18 y TypeScript.

## Estructura del Proyecto

```
src/
├── app/                           # App router de Next.js
│   ├── page.tsx                   # Home principal
│   ├── login/page.tsx             # Página de login
│   ├── register/page.tsx          # Página de registro
│   ├── candidate/                 # Rutas de candidato
│   │   ├── dashboard/page.tsx     # Dashboard del candidato
│   │   ├── onboarding/page.tsx    # Onboarding guiado
│   │   ├── profile/page.tsx       # Perfil y preferencias
│   │   ├── recommendations/page.tsx  # Recomendaciones
│   │   ├── applications/page.tsx  # Postulaciones
│   │   └── agent/page.tsx         # Agentes para candidato
│   └── recruiter/                 # Rutas de reclutador
│       ├── dashboard/page.tsx     # Dashboard del reclutador
│       ├── company-profile/page.tsx  # Perfil empresa
│       ├── jobs/page.tsx          # Pipeline candidatos
│       ├── jobs/new/page.tsx      # Crear vacante
│       ├── candidates/page.tsx    # Base de candidatos
│       └── agent/page.tsx         # Agentes para reclutador
│
├── components/                    # Componentes reutilizables
│   ├── layout/                    # Layout components
│   │   ├── AppShell.tsx           # Shell principal
│   │   ├── Sidebar.tsx            # Barra lateral
│   │   ├── Topbar.tsx             # Barra superior
│   │   └── RoleGuard.tsx          # Protección de rutas
│   ├── candidate/                 # Componentes de candidato
│   ├── recruiter/                 # Componentes de reclutador
│   ├── jobs/                      # Componentes de vacantes
│   ├── agents/                    # Componentes de agentes
│   ├── ui/                        # Componentes base (shadcn/ui)
│   └── index.ts                   # Exports centralizados
│
├── features/                      # Lógica de negocio
│   ├── auth/                      # Autenticación
│   │   ├── services.ts            # Servicios de auth
│   │   └── hooks/useAuth.ts       # Hook de auth
│   ├── profile/                   # Perfil del usuario
│   ├── jobs/                      # Gestión de vacantes
│   ├── recommendations/           # Motor de recomendaciones
│   ├── applications/              # Postulaciones
│   └── agents/                    # Lógica de agentes
│
├── lib/                           # Utilidades
│   ├── scoring.ts                 # Cálculo de scores
│   └── mock-data.ts               # Datos mock
│
├── types/                         # TypeScript types
│   └── index.ts                   # Tipos principales
│
└── styles/                        # Estilos globales
```

## Componentes Principales

### Layout
- **AppShell**: Contenedor principal con sidebar y topbar
- **Sidebar**: Navegación contextual según rol
- **Topbar**: Barra superior con búsqueda y notificaciones
- **RoleGuard**: Protección de rutas por rol

### Candidato
- **CandidateDashboard**: Dashboard principal
- **CandidateGamificationPanel**: Gamificación (progreso, misiones, badges)
- **JobRecommendationCard**: Tarjeta de vacante recomendada
- **ApplicationStatusBoard**: Estado de postulaciones
- **CandidatePreferenceForm**: Formulario de preferencias

### Reclutador
- **RecruiterDashboard**: Dashboard con estadísticas
- **RecruiterStatsCards**: Tarjetas de KPIs
- **RecruiterJobCard**: Tarjeta de vacante (gestión)
- **CandidateMatchCard**: Tarjeta de candidato
- **ApplicantPipeline**: Pipeline visual de candidatos

### Jobs
- **WorkModeBadge**: Badge de modalidad (remoto, híbrido, etc)
- **SalaryRange**: Rango salarial formateado
- **MatchScore**: Puntuación de match (circular)
- **ScoreBreakdown**: Desglose detallado del score

### Agentes
- **AgentPanel**: Panel de agentes disponibles
- **AgentActionLog**: Registro de acciones ejecutadas
- **ProfileAgentCard**: Agente de perfil
- **JobImprovementAgentCard**: Agente de mejora de vacantes
- **FollowUpAgentCard**: Agente de seguimiento

## Tipos de Datos

### User & Roles
- `UserRole`: 'CANDIDATE' | 'RECRUITER' | 'ADMIN'

### Work & Location
- `WorkMode`: 'ONSITE' | 'REMOTE' | 'HYBRID' | 'FLEXIBLE'
- `RemoteScope`: 'COLOMBIA' | 'LATAM' | 'WORLDWIDE'
- `Currency`: 'COP' | 'USD' | 'EUR'
- `SalaryPeriod`: 'MONTHLY' | 'YEARLY' | 'HOURLY'

### Scoring
- `ScoreBreakdown`: Desglose por categoría
- `ScoreType`: 'CANDIDATE' | 'RECRUITER'
- Pesos de scoring personalizados por tipo

### Applications
- `ApplicationStatus`: RECOMMENDED, APPLIED, REVIEWING, INTERVIEW, REJECTED, OFFER, HIRED

### Agents
- `AgentType`: PROFILE, RECOMMENDATIONS, APPLICATION, FOLLOW_UP, JOB_IMPROVEMENT

## Features Implementadas

### 1. Separación de Modalidad y Ubicación ✅
- workMode: Campo separado de remoteScope
- hybridDaysPerWeek: Para modalidad híbrida
- requiresRelocation: Disponibilidad de traslado
- timezone: Zona horaria

### 2. Mejora de Salario ✅
- salaryMin/salaryMax: Rango salarial
- currency: Moneda
- period: MONTHLY, YEARLY, HOURLY
- visibleToCandidate: Privacidad

### 3. Scoring Explicable ✅
- ScoreBreakdown por tipo (CANDIDATE, RECRUITER)
- Pesos personalizados
- Categorías: Skills, Experiencia, Salario, Modalidad, Ubicación, Disponibilidad

### 4. Gamificación ✅
- CandidateGamificationPanel con:
  - Barra de completitud (0-100%)
  - Misiones del perfil
  - Badges (desbloqueables)
  - Puntos totales

### 5. Agentes Simulados ✅
- Agente de Perfil: Detecta datos faltantes
- Agente de Recomendaciones: Explica matches
- Agente de Postulación: Simula postulación asistida
- Agente de Seguimiento: Próximos pasos
- Agente de Vacantes: Mejora publicaciones

## Cómo Usar

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Importar Componentes
```typescript
// Opción 1: Importar directo
import { AppShell } from '@/components/layout/AppShell';

// Opción 2: Desde index centralizado
import { AppShell, Sidebar } from '@/components';
```

### Usar Tipos
```typescript
import type { 
  Candidate, 
  Job, 
  Application,
  WorkLocation,
  SalaryInfo 
} from '@/types';
```

## Integración con Backend

### Endpoints Esperados
Reemplazar los siguientes servicios con llamadas reales:

- `features/auth/services.ts`: Login/Register
- `features/profile/services.ts`: CRUD perfil
- `features/jobs/services.ts`: CRUD vacantes
- `features/recommendations/services.ts`: Motor de recomendaciones
- `features/applications/services.ts`: CRUD postulaciones
- `features/agents/services.ts`: Lógica de agentes

### Mock Data
Mientras se integra el backend, usar:
```typescript
import { MOCK_JOBS, MOCK_CANDIDATE, MOCK_AGENTS } from '@/lib/mock-data';
```

## Estilo y Design

### Framework CSS
- Tailwind CSS
- shadcn/ui para componentes base

### Colores y Temas
Definidos en `tailwind.config.ts` y `src/styles/`

### Responsive
- Mobile-first approach
- Breakpoints: sm, md, lg, xl, 2xl

## Próximos Pasos

1. **Integración con Backend**:
   - Conectar endpoints API
   - Reemplazar mock data
   - Implementar autenticación real

2. **Validación de Formularios**:
   - Agregar React Hook Form
   - Validación con Zod/Yup

3. **Estado Global**:
   - Implementar Zustand o Context
   - Gestión de sesión

4. **Testing**:
   - Tests unitarios (Jest)
   - Tests E2E (Playwright)

5. **Performance**:
   - Optimización de imágenes
   - Lazy loading
   - Code splitting

6. **Analytics**:
   - Tracking de eventos
   - Métricas de uso

## Contribuciones

Para agregar nuevos componentes:
1. Crear en carpeta apropiada
2. Exportar desde `components/index.ts`
3. Documentar props
4. Usar TypeScript
5. Seguir convención de nombres

---

**Versión**: 1.0.0  
**Última actualización**: Mayo 2026
