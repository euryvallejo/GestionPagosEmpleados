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

        public UserController(IUserService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> Get() => Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<IActionResult> Create(CreateUserDto dto)
        {
            var user = await _service.CreateAsync(dto);
            return Ok(user);
        }
    }
}