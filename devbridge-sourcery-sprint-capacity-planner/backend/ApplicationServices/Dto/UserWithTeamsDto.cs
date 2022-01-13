using backend.Domain;
using System.Collections.Generic;

namespace backend.ApplicationServices.Dto
{
    public class UserWithTeamsDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string TeamRole { get; set; }
        public string UserName { get; set; }
        public List<TeamIdAndTitle> Teams { get; set; }
        public List<DayOffDto> DaysOff { get; set; }
    }
    public class TeamIdAndTitle
    {
        public int Id { get; set; }
        public string Title { get; set; }
    }
}
