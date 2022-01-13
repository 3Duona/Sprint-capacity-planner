using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DataAccess.Contracts;
using backend.DataAccess.Contracts.Sprints;
using backend.Domain;
using Microsoft.EntityFrameworkCore;

namespace backend.DataAccess.Repositories
{
    public class SprintRepository
    {
        private readonly ApplicationDbContext _context;

        public SprintRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<SprintDto>> GetSprints()
        {
            var sprints = await _context.Sprints.ToListAsync();
            return sprints.Select(SprintDto.MapDto).ToList();
        }

        public async Task<SprintDto> GetSprint(int id)
        {
            var sprint = await _context.Sprints.FirstOrDefaultAsync(x => x.Id == id);
            return SprintDto.MapDto(sprint);
        }
        
        public async Task<SprintDto> AddSprint(CreateSprintRequest request)
        {
            var sprint = CreateSprintRequest.GetSprint(request);

            sprint.Title = $"Sprint {(_context.Sprints.Count(spr => spr.TeamId == request.TeamId) + 1).ToString()}";
            await _context.Sprints.AddAsync(sprint);

            //foreach (var user in sprint.Team.TeamUsers)
            //{
            //    var sprintMember = new SprintMember() {SprintId = sprint.Id, UserId = user.UserId, Velocity = 0};
            //    _context.SprintMembers.Add(sprintMember);
            //}
            
            await _context.SaveChangesAsync();

            return SprintDto.MapDto(sprint);
        }

        public async Task CalculateVelocities(Sprint sprint)
        {
            var prevSprint = _context.Sprints.OrderByDescending(spr => spr.StartDate)
                .FirstOrDefaultAsync(spr => spr.StartDate < sprint.StartDate).Result;
            
            if (prevSprint != null)
            {
                sprint.PlannedAverageVelocity = 0;
            }
            else
            {
                sprint.PlannedAverageVelocity = 0;
            }

        }

        public async Task<SprintDto> UpdateSprint(int id, UpdateSprintRequest request)
        {
            var sprint = await _context.Sprints.FirstOrDefaultAsync(x => x.Id == id);

            sprint.TeamId = request.TeamId;
            sprint.Title = request.Title;
            sprint.DefaultLength = request.DefaultLength;
            sprint.ActualLength = request.ActualLength;
            sprint.StartDate = request.StartDate;
            sprint.EndDate = request.EndDate;
            sprint.ActualAverageVelocity = request.ActualAverageVelocity;
            sprint.PlannedAverageVelocity = request.PlannedAverageVelocity;

            await _context.SaveChangesAsync();
            return SprintDto.MapDto(sprint);
        }

        public async Task<int> DeleteSprint(int id)
        {
            var sprint = await _context.Sprints.FirstOrDefaultAsync(x => x.Id == id);

            _context.Sprints.Remove(sprint);
            await _context.SaveChangesAsync();

            return sprint.Id;
        }
    }
}
