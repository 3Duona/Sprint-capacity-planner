using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace backend.Domain
{
    public class Sprint
    {
        [Key]
        public int Id { get; set; }

        public int TeamId { get; set; }

        [Required]
        public Team Team { get; set; }

        [MaxLength(100), Required]
        public string Title { get; set; }

        public int DefaultLength { get; set; }

        public int ActualLength { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public double? PlannedAverageVelocity { get; set; }
        
        public double? ActualAverageVelocity { get; set; }

        public List<SprintMember> SprintMemberVelocities { get; set; }
    }
}
