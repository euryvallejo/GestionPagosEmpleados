using GPE.Application.DTOs;
using GPE.Domain.Entities;

namespace GPE.Application.Interfaces
{
    public interface IUserService
    {
        Task<List<User>> GetAllAsync();
        Task<User> CreateAsync(CreateUserDto dto);
    }
}