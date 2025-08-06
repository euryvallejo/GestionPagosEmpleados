# Sistema de Gestión de Pagos de Empleados

> Desarrollo de Prueba Técnica para la Posición de Desarrollador FullStack para SB

## Descripción del Proyecto

Sistema completo de gestión de pagos de empleados desarrollado con arquitectura moderna y tecnologías de vanguardia. Permite la administración de diferentes tipos de empleados (Asalariados, Por Horas, Por Comisión y Asalariados por Comisión) con cálculo automático de salarios y gestión de usuarios.

## Arquitectura del Sistema

### Backend (.NET 8)

- **API REST** con ASP.NET Core
- **Clean Architecture** (Domain, Application, Infrastructure, API)
- **Entity Framework Core** con SQL Server
- **JWT Authentication** para seguridad
- **Swagger/OpenAPI** para documentación
- **Unit Testing** con xUnit y Moq

### Frontend (React + TypeScript)

- **React 18** con TypeScript
- **React Hook Form** para formularios
- **Bootstrap 5** para UI/UX
- **React Router** para navegación
- **Axios** para peticiones HTTP

### Base de Datos

- **SQL Server 2022** en contenedor Docker
- **Entity Framework Migrations** para versionado
- **Seeding automático** de datos iniciales

## Inicio Rápido

### Prerrequisitos

- Docker y Docker Compose
- Node.js 18+ (opcional, para desarrollo local)
- .NET 8 SDK (opcional, para desarrollo local)

### 1. Clonar el repositorio

```bash
git clone https://github.com/euryvallejo/GestionPagosEmpleados.git
cd GestionPagosEmpleados
```

### 2. Levantar el proyecto completo

```bash
# Construir y levantar todos los servicios
docker-compose up --build

# En modo detached (segundo plano)
docker-compose up --build -d
```

### 3. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **API**: http://localhost:5001
- **Swagger**: http://localhost:5001/swagger
- **SQL Server**: localhost:1433

## Comandos de Docker

### Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f sqlserver
```

### Detener servicios

```bash
# Detener sin eliminar contenedores
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Eliminar también volúmenes (CUIDADO: borra la DB)
docker-compose down -v
```

### Reconstruir servicios

```bash
# Reconstruir un servicio específico
docker-compose build api
docker-compose build frontend

# Forzar reconstrucción sin cache
docker-compose build --no-cache
```

## Gestión de Base de Datos

### Migraciones automáticas

Las migraciones se ejecutan automáticamente al iniciar el contenedor de la API.

### Migraciones manuales

````bash
# Ejecutar migraciones
docker-compose run --rm api dotnet ef database update


### Datos de prueba

El sistema incluye datos iniciales:

**Usuarios del sistema:**
| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | Admin123! | Administrador |
| usuario1 | User123! | Usuario |
| usuario2 | User456! | Usuario |

## 🧪 Testing

### Ejecutar tests

```bash
# Tests unitarios
docker-compose run --rm api dotnet test

# Tests con cobertura
docker-compose run --rm api dotnet test --collect:"XPlat Code Coverage"

# Tests específicos
docker-compose run --rm api dotnet test --filter "EmpleadoServiceTests"
````

### Estructura de tests

```
GPE.Test/
├── Application/Services/     # Tests de servicios
├── Domain/Entities/         # Tests de entidades
├── Infrastructure/         # Tests de infraestructura
└── Helpers/               # Utilidades para tests
```

## 📁 Estructura del Proyecto

```
GestionPagosEmpleados/
├── backend/
│   ├── GPE.API/           # Controladores y configuración
│   ├── GPE.Application/   # Casos de uso y DTOs
│   ├── GPE.Domain/        # Entidades y interfaces
│   ├── GPE.Infrastructure/# Repositorios y datos
│   └── GPE.Test/          # Tests unitarios
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas principales
│   │   ├── services/      # Servicios HTTP
│   │   └── types/         # Tipos TypeScript
│   └── public/
├── docker-compose.yml
└── README.md
```

## 🔐 Funcionalidades del Sistema

### Gestión de Empleados

- ✅ Crear empleados de diferentes tipos
- ✅ Editar información de empleados
- ✅ Eliminar empleados
- ✅ Cálculo automático de salarios
- ✅ Búsqueda y filtros

### Tipos de Empleados Soportados

1. **Asalariado**: Salario fijo semanal
2. **Por Horas**: Pago por hora con tiempo extra (>40h = 1.5x)
3. **Por Comisión**: Porcentaje sobre ventas brutas
4. **Asalariado por Comisión**: Salario base + comisión

### Gestión de Usuarios

- ✅ Administración de usuarios del sistema
- ✅ Roles (Administrador/Usuario)
- ✅ Activar/desactivar usuarios
- ✅ Autenticación JWT

### Reportes y Análisis

- ✅ Dashboard con estadísticas
- ✅ Reportes por tipo de empleado
- ✅ Gráficos y métricas
- ✅ Exportación de datos

## 🔒 Seguridad

- **Autenticación JWT** con expiración
- **Autorización basada en roles**
- **Validación de datos** en frontend y backend
- **Hash de contraseñas** con BCrypt
- **Validación de entrada** para prevenir inyecciones

## 🌐 URLs de Acceso

| Servicio   | URL Local                     | Descripción         |
| ---------- | ----------------------------- | ------------------- |
| Frontend   | http://localhost:3000         | Interfaz de usuario |
| API        | http://localhost:5001         | API REST            |
| Swagger UI | http://localhost:5001/swagger | Documentación API   |
| SQL Server | localhost:1433                | Base de datos       |

## 📝 Endpoints Principales

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Empleados

- `GET /api/empleado` - Listar empleados
- `POST /api/empleado` - Crear empleado
- `GET /api/empleado/{id}` - Obtener empleado
- `PUT /api/empleado/{id}` - Actualizar empleado
- `DELETE /api/empleado/{id}` - Eliminar empleado

### Usuarios

- `GET /api/user` - Listar usuarios
- `POST /api/user` - Crear usuario
- `PATCH /api/user/{id}/status` - Cambiar estado

### Puerto ocupado

```bash
# Cambiar puertos en docker-compose.yml
# Frontend: 3000 -> 3001
# API: 5001 -> 5002
# SQL Server: 1433 -> 1434
```

### Limpiar datos de desarrollo

```bash
# Eliminar volúmenes (borra la DB)
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all

# Rebuild completo
docker-compose up --build --force-recreate
```

# Ejecutar todos los tests

dotnet test

# Ejecutar tests específicos con filtro

dotnet test --filter "DisplayName~EmpleadoService"

# Ejecutar tests con verbose output

dotnet test --verbosity normal

# Ejecutar tests con cobertura de código

dotnet test --collect:"XPlat Code Coverage"

# Ejecutar tests en modo watch (desarrollo)

dotnet watch test

## 👨‍💻 Desarrollado por

**Eury Vallejo**

- GitHub: [@euryvallejo](https://github.com/euryvallejo)
- Email: eurisvallejo@gmail.com
