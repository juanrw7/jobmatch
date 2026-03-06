# JobMatch - Instrucciones de Migración a Next.js

## 📋 Cambios realizados

### 1. **Migración de Vite a Next.js**
- ✅ Cambiado de Vite a Next.js 14.2
- ✅ Actualizado `package.json` con scripts de Next.js
- ✅ Creado `next.config.mjs`
- ✅ Removidos archivos Vite innecesarios

### 2. **Frontend preservado**
- ✅ Todos los componentes de UI se mantienen
- ✅ Los estilos Tailwind CSS se mantienen igual
- ✅ El formulario de autenticación se mantiene funcional
- ✅ Cambio mínimo: ahora usa `useRouter` de Next.js en lugar de console.log

### 3. **Base de datos con PostgreSQL**
- ✅ Prisma ORM configurado
- ✅ Esquema con modelos:
  - `User`: usuarios registrados
  - `Profile`: información de perfil
  - `Preferences`: preferencias laborales (must-have, nice-to-have)
  - `Job`: vacantes disponibles
  - `Application`: historial de aplicaciones

### 4. **API Routes (Backend integrado)**
- ✅ `POST /api/auth/register` - Registro de usuarios
- ✅ `POST /api/auth/login` - Login con JWT
- ✅ `GET /api/jobs/recommend` - Sistema de recomendaciones con scoring

### 5. **Sistema de recomendaciones**
- ✅ Puntuación por pesos:
  - **70%**: Must-have (requisitos obligatorios)
  - **20%**: Nice-to-have (extras)
  - **10%**: Ubicación
- ✅ Filtrado automático
- ✅ Ordenamiento por relevancia

### 6. **Dashboard**
- ✅ Barra de completitud del perfil
- ✅ Listado de recomendaciones con scores
- ✅ Vista de vacantes con requisitos

---

## 🚀 Cómo configurar

### 1. **Instalar dependencias** (ya hecho)
```bash
npm install
```

### 2. **Configurar base de datos PostgreSQL**

#### Opción A: PostgreSQL local
```bash
# Instalar PostgreSQL en tu máquina
# Crear base de datos
createdb jobmatch

# Configurar URL en .env
echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/jobmatch\"" > .env.local
```

#### Opción B: PostgreSQL en línea (recomendado para desarrollo)
1. Ve a [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) o [Railway](https://railway.app/)
2. Crea una nueva base de datos
3. Copia la `DATABASE_URL`
4. Crea `.env.local`:
```bash
echo "DATABASE_URL=\"tu_conexion_aqui\"" > .env.local
echo "JWT_SECRET=\"tu_secret_aqui\"" >> .env.local
```

### 3. **Ejecutar migraciones**
```bash
npx prisma migrate dev --name init
```

### 4. **Generar cliente Prisma**
```bash
npx prisma generate
```

### 5. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

El proyecto estará en: **http://localhost:3000**

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Página de login/registro
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard con recomendaciones
│   ├── api/
│   │   └── auth/
│   │       ├── register/route.ts
│   │       └── login/route.ts
│   │   └── jobs/
│   │       └── recommend/route.ts
│   └── components/
│       └── ui/                 # Componentes UI (sin cambios)
├── lib/
│   └── prisma.ts               # Cliente Prisma
└── styles/
    └── *.css                   # Estilos (sin cambios)

prisma/
└── schema.prisma               # Esquema de base de datos
```

---

## 🔑 Variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/jobmatch"

# JWT
JWT_SECRET="tu_secret_muy_seguro_aqui"
```

---

## ✨ Características implementadas

- ✅ Autenticación con JWT
- ✅ Registro e inicio de sesión
- ✅ Sistema de recomendaciones inteligente
- ✅ Barra de completitud de perfil
- ✅ Historial de aplicaciones
- ✅ Filtros por ubicación y requisitos
- ✅ Scoring por must-have vs nice-to-have

---

## 📝 Próximos pasos

1. Configurar PostgreSQL
2. Ejecutar migraciones
3. Crear seed de datos (trabajos de prueba)
4. Implementar página de onboarding
5. Agregar funcionalidad de editar perfil
6. Agregar historial de recomendaciones

---

## 🎨 Notas importantes

- El frontend no cambió significativamente
- Los componentes UI se mantienen igual
- Solo cambió el API endpoint (de `/api` local)
- El sistema de autenticación ahora usa JWT + cookies
- Todo el backend está integrado en Next.js (no necesitas servidor externo)

¡El proyecto está listo para desarrollo! 🚀