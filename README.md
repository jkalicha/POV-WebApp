# POV-WebApp

**POV-WebApp** es una aplicación web personal tipo "POV" para cargar fotos de eventos. Permite a los usuarios registrarse, crear eventos, invitar personas y subir fotos.  
Está desarrollada como proyecto fullstack utilizando tecnologías modernas y buenas prácticas de arquitectura de software.

## ⚙️ Tecnologías Utilizadas

- **Frontend**: Angular  
- **Backend**: Node.js + Express con TypeScript  
- **Base de datos**: PostgreSQL  
- **ORM**: TypeORM  
- **Autenticación**: JWT  
- **Almacenamiento**: AWS S3 (para fotos de eventos)
- **Testing**: Jest  
- **Control de versiones**: GitFlow

## 🧠 Arquitectura y buenas prácticas

- Arquitectura limpia (**Clean Architecture**): separación por capas (Controller, Service, Repository, Entity)
- Principios **SOLID**
- Uso de **interfaces** para repositorios y servicios
- Estructura basada en features (por ejemplo: `User`, `Event`)
- Middleware de autenticación (`authMiddleware.ts`)
- GitFlow: desarrollo por ramas `feature/`, integración en `develop`, despliegue desde `main`
- Proyecto en constante evolución para aprender y aplicar buenas prácticas reales

## API Endpoints
### **POST /user** - Crear Usuario
POST http://localhost:3000/user
Content-Type: application/json
{
  "name": "Juan Pérez",
  "email": "juan@example.com", 
  "password": "Password123"
}
**Responses:**
- `201`: User created successfully
- `400`: Validation errors o email duplicado
- `500`: Internal server error

### **POST /auth/login** - Login Usuario
POST http://localhost:3000/auth/login
Content-Type: application/json
{
  "email": "juan@example.com", 
  "password": "Password123"
}

**Responses:**
- `200`: Login exitoso + JWT token
- `401`: Credenciales inválidas
- `500`: Error interno del servidor

### **POST /event** - Crear Evento (Requiere autenticación)
POST http://localhost:3000/event
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Mi Cumpleaños",
  "date": "2025-12-25T20:00:00.000Z",
  "location": "Mi Casa"
}

**Responses:**
- `201`: Event created successfully
- `400`: Validation errors o título duplicado
- `401`: Token requerido, inválido o expirado
- `403`: Token válido pero sin permisos
- `500`: Internal server error

### **GET /events** - Obtener eventos donde participa el usuario autenticado
GET http://localhost:3000/events
Authorization: Bearer <JWT_TOKEN>

**Response format:**
{
  "owner": [ /* eventos donde el usuario es owner */ ],
  "invited": [ /* eventos donde el usuario está invitado */ ]
}

**Responses:**
- `200`: Lista de eventos (propios e invitado)
- `401`: Token requerido, inválido o expirado
- `500`: Internal server error

### **POST /event/:id/invite** - Invitar usuarios al evento (Requiere autenticación)
POST http://localhost:3000/event/<EVENT_ID>/invite
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "invitees": ["ana@example.com", "pepe@example.com"]
}

**Responses:**
- `200`: Invitations processed (devuelve `message`, `invited` con IDs de usuarios, y `skipped` con emails y motivo)
- `400`: Errores de validación (UUID inválido, emails inválidos, etc.)
- `401`: Token requerido, inválido o expirado
- `403`: Forbidden (el usuario autenticado no es el owner del evento)
- `500`: Internal server error

### **POST /event/:id/photos** - Subir foto al evento (Requiere autenticación)
POST http://localhost:3000/event/<EVENT_ID>/photos
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

Form data:
- photo: archivo de imagen (máx 5MB)
- caption: descripción opcional

**Responses:**
- `201`: Foto subida exitosamente
- `400`: No se proporcionó archivo, formato inválido, o límite de 5 fotos alcanzado
- `401`: Token requerido, inválido o expirado
- `500`: Internal server error

### **GET /event/:id/photos** - Ver fotos del evento (Requiere autenticación)
GET http://localhost:3000/event/<EVENT_ID>/photos
Authorization: Bearer <JWT_TOKEN>

**Responses:**
- `200`: Array de fotos con URLs de S3, metadatos y usuario que subió cada foto
- `401`: Token requerido, inválido o expirado
- `500`: Internal server error

### **DELETE /photo/:id** - Eliminar foto propia (Requiere autenticación)
DELETE http://localhost:3000/photo/<PHOTO_ID>
Authorization: Bearer <JWT_TOKEN>

**Responses:**
- `200`: Foto eliminada exitosamente
- `400`: UUID inválido
- `401`: Token requerido, inválido o expirado
- `403`: No tienes permisos para eliminar esta foto
- `404`: Foto no encontrada
- `500`: Internal server error

## 🚀 Configuración e Instalación

### Prerrequisitos
- Node.js 16+
- PostgreSQL
- Cuenta AWS con S3 configurado (en produccion, no necesario para development)

### Variables de entorno
1. Copia el archivo de ejemplo: `cp backend/.env.example backend/.env`
2. Configura las variables en `backend/.env`:
   - **JWT**: Clave secreta para tokens
   - **Database**: Credenciales de PostgreSQL
   - **AWS S3**: Access keys y nombre del bucket para almacenar fotos

## 📸 Sistema de Fotos - Desarrollo Local vs Producción

### Desarrollo Local (Mock S3)

Para facilitar el desarrollo, el sistema incluye un **MockS3Service** que simula AWS S3 localmente:

#### ¿Cómo funciona?
- **Almacenamiento**: Las fotos se guardan en `backend/uploads/` (sistema de archivos local)
- **URLs**: Se generan como `http://localhost:3000/uploads/filename.jpg`
- **Activación**: Automática cuando `NODE_ENV=development`

#### Ventajas del Mock:
-  **Más rápido**: Sin latencia de red
-  **Gratis**: No requiere cuenta AWS
-  **Simple**: No necesitas configurar credenciales AWS
-  **Visible**: Puedes ver los archivos guardados localmente

#### Para usar el Mock:
1. Asegúrate que `NODE_ENV=development` en tu `.env`
2. **No necesitas configurar** las variables AWS:
   ```env
   # Estas NO son necesarias en desarrollo:
   # AWS_ACCESS_KEY_ID=
   # AWS_SECRET_ACCESS_KEY=
   # AWS_REGION=
   # AWS_S3_BUCKET_NAME=
   ```
3. El sistema automáticamente usará el MockS3Service
4. Las fotos se guardarán en `backend/uploads/`

### Producción (AWS S3 Real)

En producción (`NODE_ENV=production`), el sistema usa AWS S3 real:

#### Configuración requerida:
```env
NODE_ENV=production
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=tu-bucket-name
```

#### ¿Cómo cambiar entre Mock y S3 real?
El cambio es **automático** basado en `NODE_ENV`:
```typescript
// En EventPhotoService.ts
if (process.env.NODE_ENV === 'development') {
  this.s3Service = new MockS3Service(); // Mock local
} else {
  this.s3Service = new S3Service(); // AWS S3 real
}
```

#### Estructura de archivos:
```
backend/
├── src/
│   └── EventPhoto/
│       ├── S3Service.ts        # AWS S3 real
│       ├── MockS3Service.ts    # Mock para desarrollo
│       └── EventPhotoService.ts # Lógica que elige cuál usar
└── uploads/                    # Fotos en desarrollo (creado automáticamente)
```

### Recomendación:
- **Desarrollo**: Usa el Mock (configuración por defecto)
- **Producción**: Configura AWS S3 real

El sistema funciona idénticamente en ambos casos.

---

## 🎯 MVP - Proyecto de Aprendizaje

Este proyecto representa mi **MVP (Minimum Viable Product)** desarrollado como parte de mi crecimiento profesional como desarrollador. A través de esta aplicación he aplicado y consolidado conocimientos sobre:

- **Arquitectura de software**: Clean Architecture, principios SOLID
- **Backend moderno**: Node.js, TypeScript, Express, PostgreSQL
- **Frontend**: Angular con componentes standalone
- **Testing**: Jest con mocks y buenas prácticas de testing
- **DevOps básico**: Variables de entorno, configuración por ambientes
- **Buenas prácticas**: GitFlow, documentación, separación de responsabilidades

El proyecto refleja mi evolución técnica y mi enfoque en escribir código limpio, mantenible y bien documentado. Cada feature implementada ha sido una oportunidad para profundizar en las mejores prácticas de desarrollo fullstack moderno.
