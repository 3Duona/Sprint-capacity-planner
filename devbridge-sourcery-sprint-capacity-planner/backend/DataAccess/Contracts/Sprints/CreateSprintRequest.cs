using System;
using backend.Domain;

namespace backend.DataAccess.Contracts.Sprints
{
    public class CreateSprintRequest
    {
        public int TeamId { get; set; }

        public string Title { get; set; }

        public int DefaultLength { get; set; }

        public int ActualLength { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public double? PlannedAverageVelocity { get; set; }

        public double? ActualAverageVelocity { get; set; }

        public static Sprint GetSprint(CreateSprintRequest request)
        {
            return new Sprint
            {
                TeamId = request.TeamId,
                Title = request.Title,
                DefaultLength = request.DefaultLength,
                ActualLength = request.ActualLength,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                PlannedAverageVelocity = request.PlannedAverageVelocity,
                ActualAverageVelocity = request.ActualAverageVelocity
            };
        }
    }
}