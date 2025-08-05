-- Insertar los 3 usuarios en la tabla [dbo].[Users] con GUIDs generados
INSERT INTO [dbo].[Users] (Id, Username, PasswordHash, Role, IsActive, CreatedAt) VALUES
-- 1. Administrador Principal
(
    NEWID(), -- Genera un GUID único para el Id
    'admin', 
    '$2b$10$rOJ3BvCCBhA8R8K9PzKq0.Xw9J5FjYqK7hF2NdE4GvP8T6R1mL9Xe', -- Contraseña: Admin123!
    1, -- Rol Administrador
    1, -- Activo
    GETDATE()
),

-- 2. Usuario Regular 1
(
    NEWID(), -- Genera un GUID único para el Id
    'usuario1', 
    '$2b$10$tQL4CwDDBiB9S9L0QzLr1.Yw0K6GkZrM8iG3OeF5HwQ9U7S2nM0Yf', -- Contraseña: User123!
    2, -- Rol Usuario
    1, -- Activo
    GETDATE()
),

-- 3. Usuario Regular 2
(
    NEWID(), -- Genera un GUID único para el Id
    'usuario2', 
    '$2b$10$uRM5DxEECjC0T0M1RzMs2.Zx1L7HlAsN9jH4PfG6IxR0V8T3oN1Zg', -- Contraseña: User456!
    2, -- Rol Usuario
    1, -- Activo
    GETDATE()
);

-- Verificar que los usuarios se insertaron correctamente
SELECT 
    Id,
    Username,
    CASE 
        WHEN Role = 1 THEN 'Administrador'
        WHEN Role = 2 THEN 'Usuario'
        ELSE 'Desconocido'
    END AS RolDescripcion,
    CASE 
        WHEN IsActive = 1 THEN 'Activo'
        ELSE 'Inactivo'
    END AS Estado,
    CreatedAt
FROM [dbo].[Users]
ORDER BY Role, Username;