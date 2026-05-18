# JobMatch Frontend - Guía de Inicio Rápido

## 🚀 Primeros Pasos

### 1. Estructura Creada

Se ha reorganizado completamente el frontend de JobMatch en una estructura modular y escalable:

```
✅ Carpetas creadas:
- src/app/candidate/ (6 rutas)
- src/app/recruiter/ (6 rutas)
- src/components/layout/
- src/components/candidate/
- src/components/recruiter/
- src/components/jobs/
- src/components/agents/
- src/features/auth/
- src/features/profile/
- src/features/jobs/
- src/features/recommendations/
- src/features/applications/
- src/features/agents/
- src/lib/
- src/types/
```

### 2. Componentes Implementados

#### Layout (4 componentes)
- `AppShell` - Container principal
- `Sidebar` - Navegación contextual
- `Topbar` - Barra superior
- `RoleGuard` - Protección de rutas

#### Candidato (4 componentes)
- `CandidateGamificationPanel` - Gamificación
- `JobRecommendationCard` - Tarjetas de vacantes
- `ApplicationStatusBoard` - Estado de postulaciones
- `CandidatePreferenceForm` - Preferencias laborales

#### Reclutador (4 componentes)
- `RecruiterStatsCards` - KPIs principales
- `RecruiterJobCard` - Tarjetas de vacantes
- `CandidateMatchCard` - Tarjetas de candidatos
- `ApplicantPipeline` - Pipeline visual

#### Jobs (4 componentes)
- `WorkModeBadge` - Modalidad laboral
- `SalaryRange` - Rango salarial
- `MatchScore` - Score circular
- `ScoreBreakdown` - Desglose de scoring

#### Agentes (5 componentes)
- `AgentPanel` - Panel de agentes
- `AgentActionLog` - Registro de acciones
- `ProfileAgentCard` - Agente de perfil
- `JobImprovementAgentCard` - Mejora de vacantes
- `FollowUpAgentCard` - Seguimiento

### 3. Páginas Creadas (12 páginas)

**Autenticación:**
- `/login` - Iniciar sesión
- `/register` - Registro

**Candidato:**
- `/candidate/dashboard` - Panel principal
- `/candidate/onboarding` - Onboarding guiado
- `/candidate/profile` - Perfil y preferencias
- `/candidate/recommendations` - Recomendaciones
- `/candidate/applications` - Postulaciones
- `/candidate/agent` - Agentes

**Reclutador:**
- `/recruiter/dashboard` - Panel principal
- `/recruiter/company-profile` - Perfil empresa
- `/recruiter/jobs` - Pipeline candidatos
- `/recruiter/jobs/new` - Crear vacante
- `/recruiter/candidates` - Base candidatos
- `/recruiter/agent` - Agentes

### 4. Tipos TypeScript

Definidos en `src/types/index.ts`:
- User, Candidate, Recruiter
- Job, JobRecommendation, Application
- WorkLocation, SalaryInfo
- Agent, AgentAction
- ScoreBreakdown, GamificationProfile
- Y más...

### 5. Servicios Base

- `src/features/auth/services.ts` - Autenticación
- `src/features/auth/hooks/useAuth.ts` - Hook de auth
- `src/lib/mock-data.ts` - Datos para desarrollo
- `src/lib/scoring.ts` - Cálculos de scoring
- `src/lib/config.ts` - Configuración

## 🎯 Características Implementadas

### ✅ Separación Modalidad/Ubicación
```typescript
workLocation: {
  workMode: 'HYBRID',
  remoteScope: 'LATAM',
  hybridDaysPerWeek: 2,
  requiresRelocation: false,
  relocationSupport: true,
  city: 'Medellín',
  country: 'Colombia',
  timezone: 'America/Bogota'
}
```

### ✅ Salario Mejorado
```typescript
salary: {
  salaryMin: 4000000,
  salaryMax: 7000000,
  currency: 'COP',
  period: 'MONTHLY',
  visibleToCandidate: true
}
```

### ✅ Scoring Explicable
- Para Candidato: Skills (40%) + Exp (15%) + Modalidad (15%) + Salario (15%) + Ubicación (10%) + Disponibilidad (5%)
- Para Reclutador: Skills (45%) + Exp (15%) + Salario (15%) + Modalidad (15%) + Disponibilidad (10%)

### ✅ Gamificación
- Barra de completitud 0-100%
- Misiones del perfil
- Sistema de badges
- Puntos totales

### ✅ Agentes Simulados
- Agente de Perfil: Detecta datos faltantes
- Agente de Recomendaciones: Explica matches
- Agente de Postulación: Asistencia
- Agente de Seguimiento: Próximos pasos
- Agente de Vacantes: Mejora publicaciones

## 📱 Rutas Disponibles

### Candidato
| Ruta | Descripción |
|------|-------------|
| `/candidate/dashboard` | Panel principal |
| `/candidate/onboarding` | Completar perfil |
| `/candidate/profile` | Ver/editar perfil |
| `/candidate/recommendations` | Vacantes recomendadas |
| `/candidate/applications` | Mis postulaciones |
| `/candidate/agent` | Agentes personales |

### Reclutador
| Ruta | Descripción |
|------|-------------|
| `/recruiter/dashboard` | Panel con estadísticas |
| `/recruiter/company-profile` | Perfil empresa |
| `/recruiter/jobs` | Pipeline de candidatos |
| `/recruiter/jobs/new` | Crear nueva vacante |
| `/recruiter/candidates` | Base de candidatos |
| `/recruiter/agent` | Agentes de mejora |

## 🔐 Autenticación

### Login de Demostración
```
Candidato:
- Email: candidate@example.com
- Rol: CANDIDATE

Reclutador:
- Email: recruiter@example.com
- Rol: RECRUITER
```

### Implementar Autenticación Real

1. Actualizar `src/features/auth/services.ts`:
```typescript
export async function loginUser(email: string, password: string): Promise<User> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  // ...
}
```

2. Usar `useAuth()` hook:
```typescript
const { user, isLoading, error } = useAuth();
```

## 🎨 Componentes Reutilizables

### Importar desde índice centralizado
```typescript
import { 
  AppShell, 
  Sidebar,
  CandidateGamificationPanel,
  RecruiterStatsCards,
  WorkModeBadge,
  MatchScore,
  AgentPanel
} from '@/components';
```

### Ejemplos de uso

**JobRecommendationCard:**
```typescript
<JobRecommendationCard
  job={job}
  matchScore={85}
  onViewDetails={() => {}}
  onApply={() => {}}
  saved={false}
/>
```

**ScoreBreakdown:**
```typescript
<ScoreBreakdown breakdown={scoreBreakdown} />
```

**CandidateGamificationPanel:**
```typescript
<CandidateGamificationPanel
  completionPercentage={65}
  badges={badges}
  missions={missions}
  points={105}
/>
```

## 📊 Scoring en Acción

```typescript
import { calculateCandidateScore } from '@/lib/scoring';

const score = calculateCandidateScore({
  skillsMatch: 85,
  experienceYears: 5,
  salaryCompatibility: 75,
  workModeMatch: 90,
  locationMatch: 95,
  availabilityMatch: 100
});

console.log(score.total); // 84
console.log(score.breakdown); // { skills: {...}, exp: {...}, ... }
```

## 🔧 Desarrollo

### Agregar nuevo componente

1. Crear en carpeta apropiada:
```
src/components/candidate/MyNewComponent.tsx
```

2. Exportar desde `src/components/index.ts`:
```typescript
export { MyNewComponent } from '@/components/candidate/MyNewComponent';
```

3. Usar en página:
```typescript
import { MyNewComponent } from '@/components';
```

### Agregar nueva página

1. Crear en `src/app/[role]/[feature]/page.tsx`
2. Envolverla en `<RoleGuard>`
3. Usar `<AppShell>` como contenedor

## 📦 Dependencias Principales

- `next` 14.x - Framework
- `react` 18.x - Library
- `typescript` 5.x - Type safety
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `shadcn/ui` - Components

## 🚢 Deploy

El proyecto está listo para Deploy en:
- Vercel (recomendado)
- Netlify
- AWS Amplify
- Cualquier host Node.js

## 📝 Próximos Pasos

1. **Backend Integration**
   - Conectar endpoints API
   - Reemplazar mock data
   - Implementar autenticación real

2. **Validación**
   - Agregar React Hook Form
   - Validación con Zod

3. **Estado Global**
   - Implementar Zustand/Context
   - Gestión de sesión

4. **Testing**
   - Unit tests (Jest)
   - E2E tests (Playwright)

5. **Performance**
   - Image optimization
   - Lazy loading
   - Code splitting

6. **SEO**
   - Meta tags
   - Open Graph
   - Sitemaps

## ❓ FAQ

**P: ¿Cómo cambio el rol en login?**
R: En el formulario de login hay un selector de rol (Candidato/Reclutador)

**P: ¿Dónde están los datos mock?**
R: En `src/lib/mock-data.ts`

**P: ¿Cómo agrego nuevas rutas?**
R: Crea carpetas en `src/app/` siguiendo la estructura de Next.js 14

**P: ¿Cómo cambio los colores?**
R: En `tailwind.config.ts` y `src/styles/`

## 📞 Soporte

Para cambios o integración con backend, consulta:
- `FRONTEND-README.md` - Documentación completa
- `src/types/index.ts` - Tipos disponibles
- `src/lib/config.ts` - Configuración

---

**Estado**: ✅ Proyecto Listo para Desarrollo  
**Versión**: 1.0.0  
**Actualizado**: Mayo 2026
