using GPE.Domain.Entities;
using GPE.Application.DTOs;

namespace GPE.Application.Interfaces
{
    public interface IAuthService
    {
        Task<(bool Success, string Token, int Role, string Message)> LoginAsync(LoginDto loginDto);
        Task<(bool Success, string Message)> RegisterAsync(RegisterDto registerDto);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<bool> UserExistsAsync(string username);
    }
}