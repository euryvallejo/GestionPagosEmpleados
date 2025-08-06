using System.Security.Claims;
using GPE.Domain.Entities;

namespace GPE.Application.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user);
        ClaimsPrincipal? ValidateToken(string token);
    }
}