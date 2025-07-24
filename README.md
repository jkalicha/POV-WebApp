# POV-WebApp

**POV-WebApp** es una aplicación web personal tipo "POV" para cargar fotos de eventos. Permite a los usuarios registrarse, crear eventos, invitar personas y subir fotos.  
Está desarrollada como proyecto fullstack utilizando tecnologías modernas y buenas prácticas de arquitectura de software.

## ⚙️ Tecnologías Utilizadas

- **Frontend**: Angular  
- **Backend**: Node.js + Express con TypeScript  
- **Base de datos**: PostgreSQL  
- **ORM**: TypeORM  
- **Autenticación**: JWT  
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
- `400`: Error de validación de datos
- `500`: Error interno del servidor

🚧 En Desarrollo actualmente