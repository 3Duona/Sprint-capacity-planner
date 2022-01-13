namespace backend.Domain
{
    public class TeamUser
    {
        public int TeamId { get; set; }

        public Team Team { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }

        public double? Allocation { get; set; }

        public double? Capacity { get; set; }
    }
}
