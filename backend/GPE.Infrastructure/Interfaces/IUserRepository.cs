using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GPE.Domain.Entities;

namespace GPE.Infrastructure.Interfaces
{
    public interface IUserRepository
    {
        Task<List<User>> GetAll();
        Task Add(User user);
    }
}