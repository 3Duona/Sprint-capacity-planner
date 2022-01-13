using backend.ApplicationServices.Dto;
using backend.Domain;
using System.Collections.Generic;
using System.Linq;

namespace backend.ApplicationServices.Mappers
{
    public static class UserMappers
    {
        public static UserDto MapDtoFrom(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                TeamRole = user.TeamRole,
                UserName = user.UserName
            };
        }

        public static UserWithTeamsDto MapDtoFrom(User user, List<Team> teams, List<DayOff> dayOffs)
        {
            return new UserWithTeamsDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                TeamRole = user.TeamRole,
                UserName = user.UserName,
                Teams = teams.Select(team => new TeamIdAndTitle {
                    Id = team.Id,
                    Title = team.Title
                }).ToList(),
                DaysOff = dayOffs.Select(day => new DayOffDto { 
                    Id = day.Id,
                    StartDate = day.StartDate.ToString("yyyy-MM-dd"),
                    EndDate = day.EndDate.ToString("yyyy-MM-dd"),
                    DaysCount = day.DaysCount,
                    Reason = day.Reason,
                    UserId = day.UserId,
                }).ToList()
            };
        }
    }
}
