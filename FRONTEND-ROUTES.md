# 🗺️ JobMatch - Mapa de Rutas Completo

## 📍 Rutas Públicas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `src/app/page.tsx` | Home principal con info del proyecto |
| `/login` | `src/app/login/page.tsx` | Página de login con selector de rol |
| `/register` | `src/app/register/page.tsx` | Página de registro con roles |

---

## 👨‍💼 Rutas de Candidato (Protegidas)

### Dashboard
| Ruta | Componente | Descripción | Componentes Usados |
|------|-----------|-------------|-------------------|
| `/candidate/dashboard` | `src/app/candidate/dashboard/page.tsx` | Panel principal del candidato | CandidateGamificationPanel, ApplicationStatusBoard |

### Onboarding
| Ruta | Componente | Descripción | Componentes Usados |
|------|-----------|-------------|-------------------|
| `/candidate/onboarding` | `src/app/candidate/onboarding/page.tsx` | Proceso guiado de completitud | Progress, Card |

### Perfil
| Ruta | Componente | Descripción | Componentes Usados |
|------|-----------|-------------|-------------------|
| `/candidate/profile` | `src/app/candidate/profile/page.tsx` | Ver/editar perfil y preferencias | CandidatePreferenceForm, WorkModeBadge, SalaryRange |

### Recomendaciones
| Ruta | Componente | Descripción | Componentes Usados |
|------|-----------|-------------|-------------------|
| `/candidate/recommendations` | `src/app/candidate/recommendations/page.tsx` | Vacantes recomendadas | JobRecommendationCard, ScoreBreakdown, MatchScore |

### Postulaciones
| Ruta | Componente | Descripción | Componentes Usados |
|------|-----------|-------------|-------------------|
| `/candidate/applications` | `src/app/candidate/applications/page.tsx` | Seguimiento de postulaciones | ApplicationStatusBoard, Tabs |

### Agentes
| Ruta | Componente | Descripción | Componentes Usados |
|------|-----------|-------------|-------------------|
| `/candidate/agent` | `src/app/candidate/agent/page.tsx` | Agentes personales | AgentPanel, ProfileAgentCard, FollowUpAgentCard, AgentActionLog |

---

## 👔 Rutas de Reclutador (Protegidas)

### Dashboard
| Ruta | Componente | Descripción | Componentes Usados |
|------|-----------|-------------|-------------------|
| `/recruiter/dashboard` | `src/app/recruiter/dashboard/page.tsx` | Panel con estadísticas | RecruiterStatsCards, RecruiterJobCard |

### Perfil Empresa
| Ruta | Componente | Descripción | Componentes Usados |
|------|-----------|-------------|-------------------|
| `/recruiter/company-profile` | `src/app/recruiter/company-profile/page.tsx` | Administrar info de empresa | Form inputs |

### Vacantes - Pipeline
| Ruta | Componente | Descripción | Componentes Usados |
|------|-----------|-------------|-------------------|
| `/recruiter/jobs` | `src/app/recruiter/jobs/page.tsx` | Pipeline visual de candidatos | ApplicantPipeline, ApplicationStatusBoard |

### Vacantes - Nueva
| Ruta | Componente | Descripción | Componentes Usados |
|------|-----------|-------------|-------------------|
| `/recruiter/jobs/new` | `src/app/recruiter/jobs/new/page.tsx` | Crear nueva vacante | Form inputs |

### Candidatos
| Ruta | Componente | Descripción | Componentes Usados |
|------|-----------|-------------|-------------------|
| `/recruiter/candidates` | `src/app/recruiter/candidates/page.tsx` | Base de candidatos | CandidateMatchCard, MatchScore |

### Agentes
| Ruta | Componente | Descripción | Componentes Usados |
|------|-----------|-------------|-------------------|
| `/recruiter/agent` | `src/app/recruiter/agent/page.tsx` | Agentes de mejora | JobImprovementAgentCard, AgentActionLog |

---

## 🔐 Protección de Rutas

### RoleGuard
Todas las rutas de candidato/reclutador están protegidas con:

```typescript
<RoleGuard allowedRoles={['CANDIDATE']}>
  <AppShell>
    {/* Contenido protegido */}
  </AppShell>
</RoleGuard>
```

### Redirecciones
- Usuario no autenticado → `/login`
- Rol no permitido → Mostrar error de acceso

---

## 📊 Flujos de Usuario

### Flujo de Candidato
```
/ (Home)
  ↓
/login (Inicia sesión)
  ↓
/candidate/dashboard (Panel principal)
  ↓
Opciones:
  - /candidate/profile (Completar perfil)
  - /candidate/recommendations (Ver vacantes)
  - /candidate/applications (Postulaciones)
  - /candidate/agent (Agentes)
```

### Flujo de Reclutador
```
/ (Home)
  ↓
/login → /register (Se registra/inicia sesión)
  ↓
/recruiter/company-profile (Completa perfil)
  ↓
/recruiter/dashboard (Panel principal)
  ↓
Opciones:
  - /recruiter/jobs/new (Crear vacante)
  - /recruiter/jobs (Ver candidatos)
  - /recruiter/candidates (Base de datos)
  - /recruiter/agent (Agentes de mejora)
```

---

## 🧭 Navegación en Sidebar

### Para Candidato
```
📊 Dashboard
👤 Perfil
⭐ Recomendaciones
📋 Postulaciones
⚡ Agentes
⚙️ Configuración
🚪 Cerrar sesión
```

### Para Reclutador
```
📊 Dashboard
👤 Empresa
💼 Vacantes
👥 Candidatos
⚡ Agentes
⚙️ Configuración
🚪 Cerrar sesión
```

---

## 📱 URLs Completas de Desarrollo

```
http://localhost:3000/                          # Home
http://localhost:3000/login                     # Login
http://localhost:3000/register                  # Register

# Candidato
http://localhost:3000/candidate/dashboard       # Dashboard
http://localhost:3000/candidate/onboarding      # Onboarding
http://localhost:3000/candidate/profile         # Perfil
http://localhost:3000/candidate/recommendations # Recomendaciones
http://localhost:3000/candidate/applications    # Postulaciones
http://localhost:3000/candidate/agent           # Agentes

# Reclutador
http://localhost:3000/recruiter/dashboard       # Dashboard
http://localhost:3000/recruiter/company-profile # Empresa
http://localhost:3000/recruiter/jobs            # Pipeline
http://localhost:3000/recruiter/jobs/new        # Nueva Vacante
http://localhost:3000/recruiter/candidates      # Candidatos
http://localhost:3000/recruiter/agent           # Agentes
```

---

## 🔗 Links Internos en Componentes

### Desde Home
```
- "Inicia sesión" → /login
- "Regístrate" → /register
```

### Desde Dashboard Candidato
```
- "Completar Perfil" → /candidate/profile
- "Ver Vacantes" → /candidate/recommendations
- "Ver Postulaciones" → /candidate/applications
```

### Desde Dashboard Reclutador
```
- "Nueva Vacante" → /recruiter/jobs/new
- "Gestionar Candidatos" → /recruiter/candidates
- "Agentes" → /recruiter/agent
```

---

## 📋 Parámetros de Ruta (Futuro)

Rutas planeadas para fases posteriores:

```
/candidate/recommendations?job={jobId}          # Ver detalles de vacante
/recruiter/jobs/{jobId}                         # Ver detalles de vacante
/recruiter/candidates/{candidateId}             # Ver perfil de candidato
/recruiter/jobs/{jobId}/applicants              # Ver aplicantes de vacante
/candidate/applications/{applicationId}         # Ver detalles de postulación
```

---

## 🚀 Deploy URLs (Producción)

```
Production: https://jobmatch.com/
Staging: https://staging.jobmatch.com/
Development: http://localhost:3000/

# Todos los paths son los mismos, solo cambia el dominio
```

---

## 📊 Matriz de Permisos por Ruta

| Ruta | Público | Candidato | Reclutador | Anónimo |
|------|---------|-----------|-----------|---------|
| `/` | ✅ | ✅ | ✅ | ✅ |
| `/login` | ✅ | ✅ | ✅ | ✅ |
| `/register` | ✅ | ✅ | ✅ | ✅ |
| `/candidate/*` | ❌ | ✅ | ❌ | ❌ |
| `/recruiter/*` | ❌ | ❌ | ✅ | ❌ |

---

## 🎯 Estrategia de Routing

1. **Rutas Públicas**: Accesibles sin autenticación
2. **Rutas Protegidas**: Requieren RoleGuard
3. **Redirecciones**: Basadas en rol y estado auth
4. **Error Boundaries**: Para rutas no encontradas

---

## 🔔 Notificaciones de Navegación

Se pueden agregar breadcrumbs dinámicos:

```typescript
/candidate/dashboard → Home > Dashboard
/candidate/recommendations → Home > Candidato > Recomendaciones
/recruiter/jobs/new → Home > Reclutador > Vacantes > Nueva
```

---

## 📝 Path Conventions

- ✅ Rutas en minúsculas
- ✅ Separadas por `/`
- ✅ Significativas y descriptivas
- ✅ Agrupadas por role
- ✅ Profundidad máxima: 3 niveles

---

## 🚧 Rutas Futuras

Placeholders para expansión:

```
/admin/dashboard                 # Panel de administrador
/recruiter/analytics             # Analytics de reclutamiento
/candidate/messaging             # Mensajería
/integrations                    # Integraciones externas
/settings                        # Configuración general
```

---

**Mapa de Rutas**: JobMatch Frontend v1.0
**Última actualización**: Mayo 2026
**Estado**: ✅ Completado
