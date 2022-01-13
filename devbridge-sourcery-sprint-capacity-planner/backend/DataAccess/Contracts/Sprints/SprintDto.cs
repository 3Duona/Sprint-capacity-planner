using System;
using backend.Domain;

namespace backend.DataAccess.Contracts.Sprints
{
    public class SprintDto
    {
        public int Id { get; set; }

        public int TeamId { get; set; }

        public string Title { get; set; }

        public int DefaultLength { get; set; }

        public int ActualLength { get; set; }

        public string StartDate { get; set; }

        public string EndDate { get; set; }

        public double? PlannedAverageVelocity { get; set; }

        public double? ActualAverageVelocity { get; set; }

        public static SprintDto MapDto(Sprint sprint)
        {
            return new SprintDto
            {
                Id = sprint.Id,
                TeamId = sprint.TeamId,
                Title = sprint.Title,
                DefaultLength = sprint.DefaultLength,
                ActualLength = sprint.ActualLength,
                StartDate = sprint.StartDate.ToString("yyyy-MM-dd"),
                EndDate = sprint.EndDate.ToString("yyyy-MM-dd"),
                PlannedAverageVelocity = sprint.PlannedAverageVelocity,
                ActualAverageVelocity = sprint.ActualAverageVelocity
            };
        }
    }
}
