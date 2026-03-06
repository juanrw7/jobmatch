# JobMatch - Proyecto con Frontend y Backend separados

## 📁 Estructura del proyecto

```
JobMatch/
├── frontend/  (Next.js en puerto 3000)
│   └── src/
│       ├── app/
│       │   ├── page.tsx (login)
│       │   └── dashboard/page.tsx
│       └── imports/
│           └── auth-form.tsx
├── backend/   (Express en puerto 4000)
│   ├── src/
│   │   ├── index.ts
│   │   ├── prisma.ts
│   │   └── routes/
│   │       ├── auth.ts
│   │       └── jobs.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
```

---

## 🚀 Instrucciones de inicio

### 1. **Configurar Base de Datos PostgreSQL**

#### Opción A: PostgreSQL local
```bash
# Crear base de datos
createdb jobmatch

# Configurar .env en backend/
cd backend
echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/jobmatch\"" > .env.local
echo "JWT_SECRET=\"tu_secret_muy_seguro\"" >> .env.local
echo "PORT=4000" >> .env.local
```

#### Opción B: PostgreSQL en línea (Recomendado para desarrollo)
1. Ve a [Railway.app](https://railway.app/) o [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
2. Crea una nueva base de datos PostgreSQL
3. Copia la `DATABASE_URL`
4. Crea `backend/.env.local`:
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="tu_secret_muy_seguro"
PORT=4000
```

### 2. **Backend - Instalar y ejecutar**

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

El backend estará en: **http://localhost:4000**

Endpoints disponibles:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/jobs/recommend?userId={id}`
- `GET /health` (verificar estado)

### 3. **Frontend - Instalar y ejecutar**

```bash
cd ..
npm install
npm run dev
```

El frontend estará en: **http://localhost:3000**

---

## 🔌 Flujo de comunicación

```
Frontend (Next.js:3000)
         ↓
    [HTTP Requests]
         ↓
Backend (Express:4000)
         ↓
    [Prisma ORM]
         ↓
PostgreSQL Database
```

---

## 📝 Variables de entorno

### Backend (`backend/.env.local`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/jobmatch"
JWT_SECRET="tu_secret_muy_seguro_aqui"
PORT=4000
NODE_ENV="development"
```

---

## ✨ Características implementadas

✅ **Autenticación**
- Registro de usuarios con bcryptjs
- Login con JWT tokens
- Validación de contraseñas

✅ **Recomendaciones inteligentes**
- Scoring por pesos (70% must-have, 20% nice-to-have, 10% ubicación)
- Filtrado automático de vacantes
- Ordenamiento por relevancia

✅ **Base de datos**
- User (usuarios registrados)
- Profile (información del perfil)
- Preferences (preferencias laborales)
- Job (vacantes disponibles)
- Application (historial de aplicaciones)

✅ **Dashboard**
- Barra de completitud del perfil
- Listado de recomendaciones con scores
- Vista de vacantes con requisitos

---

## 🛠️ Troubleshooting

### Error: "Cannot connect to database"
- Verifica que PostgreSQL esté corriendo
- Valida la `DATABASE_URL`
- Intenta: `psql -l` para listar bases de datos

### Error: "CORS error"
- El backend tiene CORS habilitado en `src/index.ts`
- Verifica que el backend esté corriendo en puerto 4000

### Error: "Cannot find module"
- Ejecuta `npm install` en la carpeta afectada
- Borra `node_modules` y `package-lock.json`, luego reinstala

---

## 📚 Comandos útiles

### Backend
```bash
npm run dev           # Iniciar servidor en desarrollo
npm run build         # Compilar a JavaScript
npm start             # Ejecutar versión compilada
npm run prisma:studio # Abrir Prisma Studio (http://localhost:5555)
npm run prisma:migrate # Crear nueva migración
```

### Frontend
```bash
npm run dev           # Iniciar servidor de desarrollo
npm run build         # Compilar para producción
```

---

## 🎯 Próximos pasos

1. ✅ Arquitectura separada (Frontend + Backend)
2. ⏳ Implementar página de onboarding
3. ⏳ Crear admin panel para agregar vacantes
4. ⏳ Agregar historial detallado de aplicaciones
5. ⏳ Implementar notificaciones en tiempo real
6. ⏳ Tests automatizados

---

**¡El proyecto está listo para desarrollo!** 🚀