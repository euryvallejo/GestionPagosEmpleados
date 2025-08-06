using GPE.Application.Interfaces;
using GPE.Application.DTOs;
using GPE.Domain.Entities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using GPE.Domain.Interfaces;
using BCrypt.Net;
namespace GPE.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtTokenGenerator _tokenGenerator;
        private readonly ILogger<AuthService> _logger;
        private readonly IConfiguration _configuration;

        public AuthService(
            IUserRepository userRepository,
            IJwtTokenGenerator tokenGenerator,
            ILogger<AuthService> logger,
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _tokenGenerator = tokenGenerator;
            _logger = logger;
            _configuration = configuration;
        }


        public async Task<(bool Success, string Token, int Role, string Message)> LoginAsync(LoginDto loginDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(loginDto.Username) || string.IsNullOrWhiteSpace(loginDto.Password))
                {
                    return (false, string.Empty, 0, "Username and password are required");
                }

                var user = await _userRepository.GetByUsernameAsync(loginDto.Username);

                if (user == null)
                {
                    _logger.LogWarning("Login attempt with non-existent username: {Username}", loginDto.Username);
                    return (false, string.Empty, 0, "Invalid credentials");
                }

                if (!user.IsActive)
                {
                    _logger.LogWarning("Login attempt with inactive user: {Username}", loginDto.Username);
                    return (false, string.Empty, 0, "Account is inactive");
                }

                if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                {
                    _logger.LogWarning("Invalid password attempt for user: {Username}", loginDto.Username);
                    return (false, string.Empty, 0, "Invalid credentials");
                }

                var token = _tokenGenerator.GenerateToken(user);
                var expiresAt = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["JwtSettings:ExpireMinutes"] ?? "1440"));
                await _userRepository.UpdateAsync(user);

                _logger.LogInformation("Successful login for user: {Username}", loginDto.Username);
                return (true, token, (int)user.Role, "Login successful");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for user: {Username}", loginDto.Username);
                return (false, string.Empty, 0, "An error occurred during login");
            }
        }

        public async Task<(bool Success, string Message)> RegisterAsync(RegisterDto registerDto)
        {
            try
            {
                // Validaciones
                if (string.IsNullOrWhiteSpace(registerDto.Username))
                    return (false, "Username is required");

                if (string.IsNullOrWhiteSpace(registerDto.Password))
                    return (false, "Password is required");

                if (registerDto.Password.Length < 6)
                    return (false, "Password must be at least 6 characters long");

                // Verificar si el usuario ya existe
                var exists = await _userRepository.ExistsAsync(registerDto.Username);
                if (exists)
                {
                    _logger.LogWarning("Registration attempt with existing username: {Username}", registerDto.Username);
                    return (false, "Username already exists");
                }

                // Crear nuevo usuario
                var user = new User(
                    registerDto.Username,
                    BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                    registerDto.Role
                );

                await _userRepository.CreateAsync(user);

                _logger.LogInformation("New user registered: {Username}", registerDto.Username);
                return (true, "User registered successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for user: {Username}", registerDto.Username);
                return (false, "An error occurred during registration");
            }
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            try
            {
                return await _userRepository.GetByUsernameAsync(username);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by username: {Username}", username);
                return null;
            }
        }

        public async Task<bool> UserExistsAsync(string username)
        {
            try
            {
                return await _userRepository.ExistsAsync(username);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking if user exists: {Username}", username);
                return false;
            }
        }
    }
}