using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GPE.Domain.Interfaces;
using GPE.Infrastructure.Persistence;
using GPE.Domain.Entities;

namespace GPE.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ContextApp _context;
        public UserRepository(ContextApp context) => _context = context;

        public async Task<List<User>> GetAll() => await _context.Users.ToListAsync();
        public async Task Add(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        public User? GetByUsername(string username) => _context.Users.FirstOrDefault(u => u.Username == username);
    }
}