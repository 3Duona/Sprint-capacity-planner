using backend.ApplicationServices.Dto;
using backend.Domain;

namespace backend.ApplicationServices.Mappers
{
    public static class AvailabilityMappers
    {
        public static DayOffDto MapDtoFrom(DayOff dayOff)
        {
            return new DayOffDto
            {
                UserId = dayOff.UserId,
                Id = dayOff.Id,
                StartDate = dayOff.StartDate.ToString("yyyy-MM-dd"),
                EndDate = dayOff.EndDate.ToString("yyyy-MM-dd"),
                DaysCount = dayOff.DaysCount,
                Reason = dayOff.Reason
            };
        }
    }
}
