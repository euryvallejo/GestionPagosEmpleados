using GPE.Application.DTOs;
using GPE.Domain.Entities;

namespace GPE.Application.Interfaces
{
    public interface IUserService
    {
        Task<List<User>> GetAllAsync();
        Task<User> CreateAsync(UserDto dto);
        Task<User> GetByUsernameAsync(string username);
        Task<User> UpdateAsync(Guid id, UserDto dto);
        Task<User> DeleteAsync(Guid id);
        Task<User> ToggleStatusAsync(Guid id);
        Task<User> GetByIdAsync(Guid id);
    }
}