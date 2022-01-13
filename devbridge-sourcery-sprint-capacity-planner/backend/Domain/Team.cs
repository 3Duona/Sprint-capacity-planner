using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend.Domain
{
    public class Team
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(100), Required]
        public string Title { get; set; }

        public List<TeamUser> TeamUsers { get; set; }

        public List<Sprint> Sprints { get; set; }
    }
}
