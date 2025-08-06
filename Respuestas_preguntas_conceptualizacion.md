1. ¿Cómo aplicarías Clean Architecture en un proyecto .NET?
   Separando el código por capas: entidades, casos de uso, interfaces y frameworks. Así, lo más importante (la lógica) no depende de la base de datos ni del framework.

2. ¿Cómo garantizarías la seguridad en una API REST que maneja datos sensibles?
   Usando HTTPS, autenticación (como JWT o OAuth2), validando entradas, protegiendo contra ataques comunes (como inyección) y controlando los permisos de acceso.

3. ¿Cuándo usarías microservicios y cuándo monolito?
   Usaría monolito si el proyecto es pequeño o necesita ir rápido. Microservicios, si es grande, con equipos distintos, y necesita escalar por partes.

4. ¿Qué diferencia hay entre Entity Framework y Dapper y cuándo usarías cada uno?
   Entity Framework es más fácil y automático; Dapper es más rápido y manual. Uso EF cuando quiero rapidez al desarrollar. Dapper si necesito mejor rendimiento.

5. ¿Cómo has trabajado en proyectos con equipos ágiles y qué herramientas has usado?
   Con reuniones diarias, entregas frecuentes y trabajo colaborativo. Usamos herramientas como Jira, Azure DevOps, Git y Teams o Slack.

6. ¿Cómo garantizas que el código de la aplicación puede ser probado?
   Separando bien la lógica, usando interfaces, inyección de dependencias y escribiendo pruebas automáticas (unitarias o de integración).

7. ¿Cómo evitarías la saturación de un API?
   Poniendo límites de uso (rate limiting), caché, colas de procesamiento y optimizando consultas.

8. ¿Cómo deben de comunicarse los componentes en una arquitectura basada en componentes?
   Con contratos bien definidos, como APIs, eventos o mensajes, evitando dependencias directas entre ellos.
