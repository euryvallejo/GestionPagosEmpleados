using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GPE.Domain.Enums;

namespace GPE.Domain.Entities
{
    public class User
    {
        public User(string username, string passwordHash, Role role)
        {
            Id = Guid.NewGuid();
            IsActive = true;
            Username = username;
            PasswordHash = passwordHash;
            Role = role;
            CreatedAt = DateTime.UtcNow;
            LastLogin = DateTime.UtcNow;
        }

        public Guid Id { get; set; } = Guid.NewGuid();
        public string Username { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public Role Role { get; set; } = Role.User;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime LastLogin { get; set; } = DateTime.UtcNow;

    }
}