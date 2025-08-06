using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Moq;
using Microsoft.Extensions.Logging;
using GPE.Application.Services;
using GPE.Application.DTOs;
using GPE.Domain.Entities;
using GPE.Domain.Interfaces;

namespace GPE.Test.Application.Services
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _mockRepository;
        private readonly Mock<IPasswordHasher> _mockPasswordHasher;
        private readonly Mock<ILogger<UserService>> _mockLogger;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            _mockRepository = new Mock<IUserRepository>();
            _mockPasswordHasher = new Mock<IPasswordHasher>();
            _mockLogger = new Mock<ILogger<UserService>>();

            _userService = new UserService(
                _mockRepository.Object,
                _mockPasswordHasher.Object,
                _mockLogger.Object);
        }

        [Fact]
        public async Task GetAllAsync_DeberiaRetornarListaUsuarios_CuandoExistenUsuarios()
        {
            // Arrange
            var usuarios = new List<User>
            {
                new User("admin", "password123", GPE.Domain.Enums.Role.Admin)
                {
                    Id = Guid.NewGuid(),
                    IsActive = true,
                    CreatedAt = DateTime.Now
                },
                new User("usuario1", "password123", GPE.Domain.Enums.Role.User)
                {
                    Id = Guid.NewGuid(),
                    IsActive = true,
                    CreatedAt = DateTime.Now
                }
            };

            _mockRepository.Setup(repo => repo.GetAllAsync())
                          .ReturnsAsync(usuarios);

            // Act
            var result = await _userService.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
            Assert.Contains(result, u => u.Username == "admin");
            Assert.Contains(result, u => u.Username == "usuario1");
        }

        [Fact]
        public async Task GetByIdAsync_DeberiaRetornarUsuario_CuandoExiste()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var usuario = new User(
                "testuser",
                "password123",
                GPE.Domain.Enums.Role.User)
            {
                Id = userId,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            // ✅ Agregar el Setup del mock que faltaba
            _mockRepository.Setup(repo => repo.GetByIdAsync(userId))
                          .ReturnsAsync(usuario);

            // Act
            var result = await _userService.GetByIdAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(userId, result.Id);
            Assert.Equal("testuser", result.Username);
        }
    }
}