# Desarrollo de Prueba Técnica para la Posición de Desarrollador FullStack para la SB

## Para levantar el proyecto de Gestión de pagos Empleados para SB

### Construir y levantar todos los servicios

```bash
docker-compose up --build
```

### Ver logs

```bash
docker-compose logs -f
```

### Detener todo

```bash
docker-compose down
```

## URLs de acceso:

- **API**: http://localhost:5001
- **Swagger**: http://localhost:5001/swagger
- **Frontend**: http://localhost:3000
- **SQL Server**: localhost:1433

## Configurar la DB

Las migraciones se ejecutan automáticamente. Si necesitas ejecutarlas manualmente:

```bash
docker-compose run --rm api dotnet ef database update
```
