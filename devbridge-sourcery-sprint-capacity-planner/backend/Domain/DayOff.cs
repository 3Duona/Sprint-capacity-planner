using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Domain
{
    public class DayOff
    {
        [Key]
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public int DaysCount { get; set; }

        [MaxLength(50)]
        public string Reason { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }
    }
}
