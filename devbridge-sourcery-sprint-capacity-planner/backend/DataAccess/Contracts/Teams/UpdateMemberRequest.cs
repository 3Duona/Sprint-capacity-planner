namespace backend.DataAccess.Contracts.Teams
{
    public class UpdateMemberRequest
    {
        public double? Allocation { get; set; }

        public double? Capacity { get; set; }

        public static TeamUserDto MapDto(int userId, int teamId, UpdateMemberRequest request)
        {
            return new TeamUserDto
            {
                UserId = userId,
                TeamId = teamId,
                Allocation = request.Allocation,
                Capacity = request.Capacity,
            };
        }
    }
}
