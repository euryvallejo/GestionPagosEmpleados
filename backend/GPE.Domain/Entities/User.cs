using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GPE.Domain.Entities
{
    public class User
    {
        public int Id { get; private set; }
        public string Name { get; private set; }
        public string Email { get; private set; }

        public User(string name, string email)
        {
            Name = name;
            Email = email;
        }
    }
}