using backend.Domain;

namespace backend.DataAccess.Contracts.Teams
{
    public class TeamUserDto
    {
        public int UserId { get; set; }

        public int TeamId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string TeamRole { get; set; }

        public string UserName { get; set; }

        public double? Allocation { get; set; }

        public double? Capacity { get; set; }

        public static TeamUserDto MapDto(TeamUser teamUser)
        {
            return new TeamUserDto
            {
                UserId = teamUser.UserId,
                TeamId = teamUser.TeamId,
                FirstName = teamUser.User is null ? "" : teamUser.User.FirstName,
                LastName = teamUser.User is null ? "" : teamUser.User.LastName,
                TeamRole = teamUser.User is null ? "" : teamUser.User.TeamRole,
                UserName = teamUser.User is null ? "" : teamUser.User.UserName,
                Allocation = teamUser.Allocation,
                Capacity = teamUser.Capacity
            };
        }
    }
}