using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Domain;
using Microsoft.EntityFrameworkCore;

namespace backend.DataAccess.Repositories
{
    public class UserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetAll()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> GetOne(int userId)
        {
            var user = await _context.Users.Include(u => u.DaysOff).FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new KeyNotFoundException($"User (id {userId}) not found.");
            }
            return user;
        }

        public async Task<List<Team>> GetTeams(int userId)
        {
            var teams = await _context.Teams
                .Where(t => t.TeamUsers.Any(tu => tu.UserId == userId)).ToListAsync();
            return teams;
        }

        public async Task Delete(User user)
        {
            _context.Users.Remove(user);
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
    }
}
