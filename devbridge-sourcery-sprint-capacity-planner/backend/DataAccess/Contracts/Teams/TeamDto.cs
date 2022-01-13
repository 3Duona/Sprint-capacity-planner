using System.Collections.Generic;
using System.Linq;
using backend.DataAccess.Contracts.Sprints;
using backend.Domain;

namespace backend.DataAccess.Contracts.Teams
{
    public class TeamDto
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public List<TeamUserDto> Members { get; set; }

        public List<SprintDto> Sprints { get; set; }

        public static TeamDto MapDto(Team team)
        {
            return new TeamDto
            {
                Id = team.Id,
                Title = team.Title,
                Members = team.TeamUsers is null ? new List<TeamUserDto>() : team.TeamUsers.Select(TeamUserDto.MapDto).ToList(),
                Sprints = team.Sprints is null ? new List<SprintDto>() : team.Sprints.Select(SprintDto.MapDto).ToList() 
            };
        }
    }
}
