using GPE.Application.DTOs;
using GPE.Application.Interfaces;
using GPE.Domain.Entities;
using GPE.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace GPE.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;
        private readonly IPasswordHasher _passwordHasher;
        private readonly ILogger<UserService> _logger;

        public UserService(
            IUserRepository repo,
            IPasswordHasher passwordHasher,
            ILogger<UserService> logger)
        {
            _repo = repo;
            _passwordHasher = passwordHasher;
            _logger = logger;
        }

        public async Task<List<User>> GetAllAsync() => await _repo.GetAllAsync();

        public async Task<User> CreateAsync(UserDto dto)
        {
            var hashedPassword = _passwordHasher.HashPassword(dto.PasswordHash);
            var user = new User(
                dto.Username,
                hashedPassword,
                dto.Role)
            {
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            await _repo.Add(user);
            return user;
        }

        public async Task<User> AuthenticateAsync(string username, string password)
        {
            var user = await _repo.GetByUsernameAsync(username);

            if (user == null || !user.IsActive)
                return null;

            var isPasswordValid = _passwordHasher.VerifyPassword(password, user.PasswordHash);

            if (!isPasswordValid)
                return null;

            return user;
        }

        public async Task<User> GetByIdAsync(Guid id)
        {
            return await _repo.GetByIdAsync(id);
        }
        public async Task<User> GetByUsernameAsync(string username)
        {
            return await _repo.GetByUsernameAsync(username);
        }
    }
}