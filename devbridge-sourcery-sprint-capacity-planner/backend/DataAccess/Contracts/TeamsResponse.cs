using System.Collections.Generic;

namespace backend.Contracts
{
    public class TeamsResponse
    {
        public List<TeamDto> Teams { get; set; }
    }
    public class TeamDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public List<TeamMemberDto> Members { get; set; }
    }
    public class TeamMemberDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Name { get { return FirstName + " " + LastName; } }
        public string TeamRole { get; set; }
        public string UserName { get; set; }
    }
}
