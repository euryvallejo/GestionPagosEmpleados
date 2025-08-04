using GPE.Application.DTOs;
using GPE.Application.Interfaces;
using GPE.Domain.Entities;
using GPE.Domain.Interfaces;

namespace GPE.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo) => _repo = repo;

        public async Task<List<User>> GetAllAsync() => await _repo.GetAll();

        public async Task<User> CreateAsync(UserDto dto)
        {
            var user = new User(dto.Username, dto.PasswordHash, dto.Role);
            await _repo.Add(user);
            return user;
        }
    }
}