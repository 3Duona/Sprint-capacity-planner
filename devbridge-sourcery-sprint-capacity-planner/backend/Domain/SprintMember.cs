using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace backend.Domain
{
    public class SprintMember
    {
        [Key]
        public int Id { get; set; }

        public Sprint Sprint { get; set; }

        public int SprintId { get; set; }
        
        public User User { get; set; }

        public int UserId { get; set; }

        public double Velocity { get; set; }
    }
}
