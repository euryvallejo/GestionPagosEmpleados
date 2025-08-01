using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GPE.Application.Interfaces;
using GPE.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace GPE.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
            return services;
        }
    }
}