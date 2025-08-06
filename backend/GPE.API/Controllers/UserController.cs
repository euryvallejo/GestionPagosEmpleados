using GPE.Application.DTOs;
using GPE.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GPE.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _service;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService service, ILogger<UserController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Create(UserDto dto)
        {
            _logger.LogInformation("Creating user with username: {Username}", dto);
            var user = await _service.CreateAsync(dto);
            return Ok(user);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UserDto dto)
        {
            var user = await _service.UpdateAsync(id, dto);
            return Ok(user);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await _service.GetByIdAsync(id);
            return Ok(user);
        }
    }
}