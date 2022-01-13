using backend.DataAccess.Repositories;
using backend.ApplicationServices;
using backend.DataAccess;
using Microsoft.Extensions.DependencyInjection;

namespace backend.Infrastructure
{
    public static class ConfigureServices
    {
        public static void ConfigureApplicationServices(this IServiceCollection services)
        {
            services
                .AddScoped<UserService>()
                .AddScoped<AvailabilityService>()
                .AddScoped<TeamRepository>()
                .AddScoped<UserRepository>()
                .AddScoped<SprintRepository>()
                .AddScoped<AvailabilityRepository>();
        }
    }
}
