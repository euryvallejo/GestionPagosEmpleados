using GPE.Infrastructure.Interfaces;
using GPE.Infrastructure.Persistence;
using GPE.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;

namespace GPE.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<ContextApp>(options =>
                options.UseSqlServer(config.GetConnectionString("Default")));
            services.AddScoped<IUserRepository, UserRepository>();
            return services;
        }
    }
}