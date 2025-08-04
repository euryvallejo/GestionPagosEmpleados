using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GPE.API.Models
{
    public class LoginDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;

    }
}