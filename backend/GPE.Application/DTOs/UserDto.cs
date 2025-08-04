using GPE.Domain.Enums;

namespace GPE.Application.DTOs
{
    public class UserDto
    {
        public string Username { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public Role Role { get; set; } = Role.User;
    }
}