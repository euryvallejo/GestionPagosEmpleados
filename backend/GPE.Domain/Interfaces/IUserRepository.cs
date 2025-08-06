using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GPE.Domain.Entities;

namespace GPE.Domain.Interfaces
{
    public interface IUserRepository
    {
        User? GetByUsername(string username);
        Task Add(User user);
        Task<List<User>> GetAllAsync();

        Task<User?> GetByUsernameAsync(string username);

        Task<User?> AuthenticateAsync(string username, string password);

        Task<User> GetByIdAsync(Guid id);

        Task<bool> ExistsAsync(string username);
        Task<User> CreateAsync(User user);
        Task<User> UpdateAsync(User user);
        Task DeleteAsync(Guid id);

    }
}