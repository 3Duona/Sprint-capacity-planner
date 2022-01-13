using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using backend.DataAccess;

namespace backend.Infrastructure
{
    public static class ConfigureDatabase
    {
        public static void AddDatabase(this IServiceCollection services, string connectionString)
        {
            services.AddDbContext<ApplicationDbContext>(builder => builder.UseSqlServer(connectionString));
        }
    }
}
