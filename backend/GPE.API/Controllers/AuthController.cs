using GPE.Application.Interfaces;
using GPE.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using GPE.API.Models;
using Microsoft.EntityFrameworkCore;
using GPE.Domain.Entities;

namespace GPE.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ContextApp _context;
        private readonly IJwtTokenGenerator _tokenGenerator;

        public AuthController(ContextApp context, IJwtTokenGenerator tokenGenerator)
        {
            _context = context;
            _tokenGenerator = tokenGenerator;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto login)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == login.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials");

            var token = _tokenGenerator.GenerateToken(user);
            return Ok(new { token, user.Role });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var exists = await _context.Users.AnyAsync(u => u.Username == dto.Username);
            if (exists)
                return BadRequest("Username already exists");

            var user = new User(dto.Username, BCrypt.Net.BCrypt.HashPassword(dto.Password), dto.Role);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}