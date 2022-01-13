using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Domain;
using Microsoft.EntityFrameworkCore;

namespace backend.DataAccess.Repositories
{
    public class AvailabilityRepository
    {
        private readonly ApplicationDbContext _context;

        public AvailabilityRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DayOff>> GetMany(List<int> userIds)
        {
            return await _context.DaysOff.Where(d => userIds.Contains(d.UserId)).ToListAsync();
        }

        public async Task<DayOff> GetOne(int dayOffId)
        {
            var dayOff = await _context.DaysOff.FirstOrDefaultAsync(d => d.Id == dayOffId);
            if (dayOff == null)
            {
                throw new KeyNotFoundException($"Day off (id {dayOffId}) not found.");
            }
            return dayOff;
        }

        public async Task Delete(DayOff dayOff)
        {
            _context.DaysOff.Remove(dayOff);
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
    }
}
