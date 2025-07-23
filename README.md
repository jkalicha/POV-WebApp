# POV-WebApp
Aplicación web personal tipo "POV" para cargar fotos de eventos. Permite a los usuarios registrarse, crear eventos, invitar personas y subir fotos. Proyecto fullstack con Angular, Node.js (Express) + Testing con Jest, PostgreSQL.

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

