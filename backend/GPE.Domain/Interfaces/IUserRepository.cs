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
        Task<List<User>> GetAll();
    }
}