INSERT INTO [dbo].[Users] (Username, PasswordHash, Role, IsActive, CreatedAt) VALUES
-- 1. Administrador Principal
(
    'admin', 
    '$2b$10$rOJ3BvCCBhA8R8K9PzKq0.Xw9J5FjYqK7hF2NdE4GvP8T6R1mL9Xe', -- Contraseña: Admin123!
    1, -- Rol Administrador
    1, -- Activo
    GETDATE()
),