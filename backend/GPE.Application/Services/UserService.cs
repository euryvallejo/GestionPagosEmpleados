using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GPE.Application.DTOs;
using GPE.Application.Interfaces;
using GPE.Domain.Entities;
using GPE.Infrastructure.Interfaces;

namespace GPE.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo) => _repo = repo;

        public async Task<List<User>> GetAllAsync() => await _repo.GetAll();

        public async Task<User> CreateAsync(CreateUserDto dto)
        {
            var user = new User(dto.Name, dto.Email);
            await _repo.Add(user);
            return user;
        }
    }
}