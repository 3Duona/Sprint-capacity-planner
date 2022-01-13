using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using backend.DataAccess.Contracts.Teams;
using backend.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.DataAccess.Repositories
{
    public class TeamRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;

        public TeamRepository(ApplicationDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<List<TeamDto>> GetAll(JwtSecurityToken token)
        {
            bool adminRequest = token.Claims.Any(x => x.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" && x.Value == UserRoles.Admin);
            if (adminRequest)
            {
                var teams = await _context.Teams.ToListAsync();
                await _context.Sprints.ToListAsync();
                await _context.Users.ToListAsync();
                await _context.TeamUsers.ToListAsync();
                return teams.Select(TeamDto.MapDto).ToList();
            }
            else
            {
                var username = token.Claims.First(claim => claim.Type == "username").Value;
                var user = await _userManager.FindByNameAsync(username);
                var teams = await _context.Teams
                    .Where(team => team.TeamUsers.Where(teamUser => teamUser.User == user).ToList().Count > 0).ToListAsync();
                await _context.Sprints.ToListAsync();
                await _context.Users.ToListAsync();
                await _context.TeamUsers.ToListAsync();
                return teams.Select(TeamDto.MapDto).ToList();
            }
        }

        public async Task<TeamDto> Get(int id)
        {
            var team = await _context.Teams.FirstOrDefaultAsync(x => x.Id == id);
            var teamUsers = await _context.TeamUsers.Where(x => x.TeamId == id).ToListAsync();
            teamUsers.Select(x => _context.Users.FirstOrDefault(y => y.Id == x.UserId)).ToList();
            await _context.Sprints.Where(x => x.TeamId == id).ToListAsync();

            return TeamDto.MapDto(team);
        }

        public async Task<TeamDto> Create(CreateTeamRequest request)
        {
            var team = new Team
            {
                Title = request.Title,
            };

            await _context.Teams.AddAsync(team);
            await _context.SaveChangesAsync();

            return TeamDto.MapDto(team);
        }

        public async Task<TeamDto> Update(int id, UpdateTeamRequest request)
        {
            var team = await _context.Teams.FirstOrDefaultAsync(x => x.Id == id);
            team.Title = request.Title;

            await _context.SaveChangesAsync();

            return TeamDto.MapDto(team);
        }

        public async Task<TeamUserDto> UpdateMember(int userId, int teamId, UpdateMemberRequest request)
        {
            var member = await _context.TeamUsers.FirstOrDefaultAsync(x => x.UserId == userId && x.TeamId == teamId);
            member.Allocation = request.Allocation;
            member.Capacity = request.Capacity;
            await _context.SaveChangesAsync();

            return UpdateMemberRequest.MapDto(userId, teamId, request);
        }

        public async Task<TeamDto> ChangeMembers(int id, AddTeamMembersRequest request)
        {
            var users = await _context.Users.ToListAsync();
            var team = await _context.Teams.FirstOrDefaultAsync(x => x.Id == id);
            var currentMembers = await _context.TeamUsers.Where(x => x.TeamId == id).ToListAsync();
            var currentMembersIds = currentMembers.Select(x => x.UserId).ToList();

            var membersToRemove = currentMembers
                .Where(member => request.MemberIds.All(memberId => memberId != member.UserId)).ToList();

            var membersToAdd = (
                from memberId in request.MemberIds
                where !currentMembersIds.Contains(memberId)
                select new TeamUser { TeamId = id, UserId = memberId, Allocation = 1, Capacity = 1}).ToList();

            _context.TeamUsers.RemoveRange(membersToRemove);
            await _context.TeamUsers.AddRangeAsync(membersToAdd);
            await _context.SaveChangesAsync();

            return TeamDto.MapDto(team);
        }

        public async Task<int> DeleteTeam(int id)
        {
            var team = await _context.Teams.FirstOrDefaultAsync(x => x.Id == id);

            _context.Teams.Remove(team);
            await _context.SaveChangesAsync();

            return team.Id;
        }
    }
}
