-- Insertar los 3 usuarios en la tabla [dbo].[Users] con GUIDs generados
INSERT INTO [dbo].[Users] (Id, Username, PasswordHash, Role, IsActive, CreatedAt) VALUES
-- 1. Administrador Principal
(
    NEWID(), -- Genera un GUID único para el Id
    'admin', 
    '$2a$11$gi4A8w7T0.XKdTBSn8ODHeAnr3CRNxUyf7I/WrVQZMU4dW6rQwYtW', -- Contraseña: Admin123!
    1, -- Rol Administrador
    1, -- Activo
    GETDATE()
),

-- 2. Usuario Regular 1
(
    NEWID(), -- Genera un GUID único para el Id
    'usuario1', 
    '$2a$11$VNuujoLILpIlUdb0gkQURO6aDECjPxQdOeH4AgK8fn2jWZ/u6PnHm', -- Contraseña: User123!
    2, -- Rol Usuario
    1, -- Activo
    GETDATE()
),

-- 3. Usuario Regular 2
(
    NEWID(), -- Genera un GUID único para el Id
    'usuario2', 
    '$2a$11$vCHNj94VB87loSg.pVv/uuOelx.Dc8yb6c950WUjKkl67m/PmqRvu', -- Contraseña: User456!
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