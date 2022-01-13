using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Domain
{
    public class User : IdentityUser<int>
    {
        [MaxLength(50)]
        public string FirstName { get; set; }

        [MaxLength(50)]
        public string LastName { get; set; }

        [MaxLength(50)]
        public string TeamRole { get; set; }

        public string Team { get; set; }

        public List<TeamUser> TeamUsers { get; set; }

        public List<DayOff> DaysOff { get; set; }
    }
}
