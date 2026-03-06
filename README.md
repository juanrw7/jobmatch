
# JobMatch - Portal de Empleo Inteligente

## 📋 Descripción del Proyecto

JobMatch es una plataforma web completa para la búsqueda y recomendación inteligente de empleos. Utiliza algoritmos de machine learning para hacer match entre candidatos y vacantes basándose en preferencias laborales, habilidades y ubicación.

### ✨ Características Principales

- **Autenticación completa**: Registro y login con JWT
- **Sistema de recomendaciones inteligente**: Scoring por pesos (must-have vs nice-to-have)
- **Dashboard personalizable**: Barra de completitud y recomendaciones personalizadas
- **Arquitectura escalable**: Frontend + Backend separados
- **Base de datos robusta**: PostgreSQL con Prisma ORM

---

## 🏗️ Arquitectura del Sistema

```
JobMatch/
├── frontend/          (Next.js :3000)
│   ├── src/app/
│   │   ├── page.tsx           # Página de login/registro
│   │   ├── dashboard/page.tsx # Dashboard con recomendaciones
│   │   └── layout.tsx         # Layout principal
│   └── src/imports/
│       └── auth-form.tsx      # Componente de autenticación
├── backend/           (Express :4000)
│   ├── src/
│   │   ├── index.ts           # Servidor principal
│   │   ├── prisma.ts          # Cliente de base de datos
│   │   └── routes/
│   │       ├── auth.ts        # Rutas de autenticación
│   │       └── jobs.ts        # Rutas de vacantes
│   └── prisma/
│       └── schema.prisma      # Esquema de base de datos
```

### 🛠️ Tecnologías Utilizadas

#### Frontend
- **Next.js 14.2** - Framework React con App Router
- **React 18** - Biblioteca de componentes
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Framework de estilos
- **Radix UI** - Componentes accesibles

#### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipado estático
- **Prisma ORM** - ORM para base de datos
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación
- **bcryptjs** - Hashing de contraseñas

#### Base de Datos
- **PostgreSQL** - Sistema de gestión de base de datos
- **Prisma** - ORM y migraciones
- **Modelos**: User, Profile, Preferences, Job, Application

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** 18+ y npm
- **PostgreSQL** 12+ (local o en la nube)

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd jobmatch
```

### 2. Configurar Base de Datos

#### Opción A: PostgreSQL Local
```bash
# Crear base de datos
createdb jobmatch

# Configurar variables de entorno
cd backend
echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/jobmatch\"" > .env.local
echo "JWT_SECRET=\"tu_secret_muy_seguro_aqui\"" >> .env.local
echo "PORT=4000" >> .env.local
```

#### Opción B: PostgreSQL en la Nube (Recomendado)
1. Crear cuenta en [Railway.app](https://railway.app/) o [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
2. Crear nueva base de datos PostgreSQL
3. Copiar la `DATABASE_URL`
4. Crear archivo `backend/.env.local`:
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="tu_secret_muy_seguro_aqui"
PORT=4000
NODE_ENV="development"
```

### 3. Instalar Dependencias

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ..
npm install
```

### 4. Ejecutar Migraciones de Base de Datos

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Ejecutar el Proyecto

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
El backend estará disponible en: **http://localhost:4000**

#### Terminal 2 - Frontend
```bash
npm run dev
```
El frontend estará disponible en: **http://localhost:3001**

---

## 📡 API Endpoints

### Autenticación
```
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "García",
  "email": "juan@correo.com",
  "password": "12345678"
}
```

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@correo.com",
  "password": "12345678"
}
```

### Vacantes y Recomendaciones
```
GET /api/jobs/recommend?userId=1
# Retorna recomendaciones con scoring inteligente
```

```
GET /api/jobs
# Lista todas las vacantes disponibles
```

```
GET /api/jobs/:id
# Detalle de una vacante específica
```

---

## 🎯 Algoritmo de Recomendaciones

El sistema utiliza un **sistema de puntuación por pesos** para hacer match entre candidatos y vacantes:

### Cálculo de Score
- **70%**: Coincidencia con requisitos obligatorios (must-have)
- **20%**: Coincidencia con preferencias adicionales (nice-to-have)
- **10%**: Ubicación geográfica

### Ejemplo de Cálculo
```javascript
// Para una vacante con requisitos: ["JavaScript", "React", "Node.js"]
// Usuario con must-have: ["JavaScript", "React"]
// Usuario con nice-to-have: ["TypeScript", "Python"]

score = (2/2) * 70 + (0/2) * 20 + (ubicacion_match ? 10 : 0)
// score = 70 + 0 + 10 = 80%
```

---

## 📊 Modelo de Datos

### User (Usuario)
```sql
- id: Int (PK)
- firstName: String
- lastName: String
- email: String (unique)
- password: String (hashed)
- createdAt: DateTime
- updatedAt: DateTime
```

### Profile (Perfil)
```sql
- id: Int (PK)
- userId: Int (FK)
- bio: String?
- skills: String[]
- experience: String?
- location: String?
```

### Preferences (Preferencias)
```sql
- id: Int (PK)
- userId: Int (FK)
- mustHave: String[]
- niceToHave: String[]
- salaryMin: Int?
- location: String?
```

### Job (Vacante)
```sql
- id: Int (PK)
- title: String
- description: String
- requirements: String[]
- salary: Int?
- location: String?
- company: String?
- createdAt: DateTime
```

### Application (Aplicación)
```sql
- id: Int (PK)
- userId: Int (FK)
- jobId: Int (FK)
- status: String (applied/interviewed/rejected/accepted)
- appliedAt: DateTime
```

---

## 🧪 Testing

### Ejecutar Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd ..
npm test
```

### Health Check
```bash
curl http://localhost:4000/health
# Respuesta: {"status": "OK", "timestamp": "..."}
```

---

## 📦 Scripts Disponibles

### Backend
```bash
npm run dev           # Servidor de desarrollo
npm run build         # Compilar TypeScript
npm start             # Ejecutar versión compilada
npm run prisma:studio # Abrir Prisma Studio
npm run prisma:migrate # Crear nueva migración
```

### Frontend
```bash
npm run dev           # Servidor de desarrollo
npm run build         # Build para producción
npm start             # Servidor de producción
```

---

## 🔧 Configuración de Desarrollo

### Variables de Entorno

#### Backend (.env.local)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/jobmatch"
JWT_SECRET="tu_secret_muy_seguro_aqui"
PORT=4000
NODE_ENV="development"
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

### Estructura de Carpetas Recomendada

```
jobmatch/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── prisma/
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── public/
└── docs/
    ├── api/
    └── deployment/
```

---

## 🚀 Deployment

### Backend (Railway, Render, etc.)
```bash
cd backend
npm run build
# Subir a plataforma de hosting
```

### Frontend (Vercel, Netlify, etc.)
```bash
npm run build
# Subir build a plataforma de hosting
```

### Base de Datos
- Usar servicios en la nube como Railway, PlanetScale o Supabase
- Configurar variables de entorno en producción

---

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👥 Equipo de Desarrollo

- **Desarrollador Principal**: [Tu Nombre]
- **Arquitectura**: Next.js + Express + PostgreSQL
- **Fecha de Desarrollo**: Marzo 2026

---

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: soporte@jobmatch.com
- Issues: [GitHub Issues](https://github.com/username/jobmatch/issues)

---

**¡JobMatch - Conectando talento con oportunidades!** 🚀
  