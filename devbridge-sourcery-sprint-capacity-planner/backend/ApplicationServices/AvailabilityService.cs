using backend.ApplicationServices.Dto;
using backend.ApplicationServices.Mappers;
using backend.DataAccess;
using backend.DataAccess.Contracts;
using backend.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using backend.DataAccess.Repositories;

namespace backend.ApplicationServices
{
    public class AvailabilityService
    {
        private readonly AvailabilityRepository _availabilityRepository;
        private readonly UserRepository _userRepository;
        private readonly TeamRepository _teamRepository;

        public AvailabilityService(AvailabilityRepository availabilityRepository, UserRepository userRepository, TeamRepository teamRepository)
        {
            _availabilityRepository = availabilityRepository;
            _userRepository = userRepository;
            _teamRepository = teamRepository;
        }

        public async Task<List<DayOffDto>> GetMany(List<int> userIds)
        {
            if (userIds == null || userIds.Count == 0) throw new ArgumentException("Request is empty.");
            var daysOff = await _availabilityRepository.GetMany(userIds);
            return daysOff.Select(dayOff => AvailabilityMappers.MapDtoFrom(dayOff)).ToList();
        }

        public async Task<List<DayOffDto>> GetFromTeam(int teamId)
        {
            var userIds = (await _teamRepository.Get(teamId)).Members.Select(tu => tu.UserId).ToList();
            var daysOff = await GetMany(userIds);
            return daysOff;
        }

        public async Task<List<DayOffDto>> GetFromUser(int userId)
        {
            var daysOff = (await _userRepository.GetOne(userId)).DaysOff;
            return daysOff.Select(dayOff => AvailabilityMappers.MapDtoFrom(dayOff)).ToList();
        }

        public async Task<DayOffDto> GetOne(int dayOffId)
        {
            var dayOff = await _availabilityRepository.GetOne(dayOffId);
            return AvailabilityMappers.MapDtoFrom(dayOff);
        }

        public async Task<DayOffDto> Create(int userId, CreateDayOffRequest request)
        {
            var user = await _userRepository.GetOne(userId);
            var newDayOff = new DayOff();
            var result = await UpdateDayOff(newDayOff, request);
            if (result.Errors.Count == 0)
            {
                user.DaysOff.Add(newDayOff);
                await SaveChanges();
            }
            else
            {
                throw new ArgumentException(string.Join(" ", result.Errors));
            }
            return AvailabilityMappers.MapDtoFrom(newDayOff);
        }

        public async Task<(List<string> Updates, List<string> Errors)> Update(int dayOffId, UpdateDayOffRequest request)
        {
            var dayOff = await _availabilityRepository.GetOne(dayOffId);
            var result = await UpdateDayOff(dayOff, request);
            if (result.Updates.Count > 0)
            {
                await SaveChanges();
            }
            return result;
        }

        public async Task Delete(int dayOffId)
        {
            var dayOff = await _availabilityRepository.GetOne(dayOffId);
            await _availabilityRepository.Delete(dayOff);
            await SaveChanges();
        }

        private async Task SaveChanges()
        {
            try
            {
                await _availabilityRepository.SaveChanges();
            }
            catch
            {
                throw new DbUpdateException("An error occured! Failed to save changes.");
            }
        }

        private async Task<(List<string> Updates, List<string> Errors)> UpdateDayOff(DayOff dayOff, IDayOffRequest request)
        {
            (List<string> Updates, List<string> Errors) result = (new List<string>(), new List<string>());

            DateTime newDate;
            if (request.StartDate == null)
            {
                result.Errors.Add("Date has not been specified.");
            }
            else if (!DateTime.TryParseExact(request.StartDate, "yyyy-MM-dd", null, DateTimeStyles.None, out newDate))
            {
                result.Errors.Add("Date is not in correct format.");
            }
            else
            {
                if (dayOff.StartDate != newDate)
                {
                    dayOff.StartDate = newDate;
                    result.Updates.Add("date");
                }
            }

            if (request.EndDate == null)
            {
                result.Errors.Add("Date has not been specified.");
            }
            else if (!DateTime.TryParseExact(request.EndDate, "yyyy-MM-dd", null, DateTimeStyles.None, out newDate))
            {
                result.Errors.Add("Date is not in correct format.");
            }
            else
            {
                if (dayOff.EndDate != newDate)
                {
                    dayOff.EndDate = newDate;
                    result.Updates.Add("date");
                }
            }

            int newDaysCount = request.DaysCount;
            if (newDaysCount == 0)
            {
                result.Errors.Add("Days count cannot be 0.");
            }
            else
            {
                if (dayOff.DaysCount != newDaysCount)
                {
                    dayOff.DaysCount = newDaysCount;
                    result.Updates.Add("days count");
                }
            }

            string newReason = request.Reason;
            if (newReason == null)
            {
                result.Errors.Add("Reason has not been specified.");
            }
            else
            {
                if (dayOff.Reason != newReason)
                {
                    dayOff.Reason = newReason;
                    result.Updates.Add("reason");
                }
            }

            return result;
        }

        public async Task<string> IntoActionResult(List<string> updated)
        {
            if (updated.Count == 0) return "No changes have been received.";

            var resultBuilder = new StringBuilder();
            foreach (var update in updated) resultBuilder.Append($"{update}, ");
            var result = resultBuilder.ToString();

            return string.Format("{0}{1} {2} been updated.",
                char.ToUpper(result[0]), result[1..^2],
                updated.Count == 1 ? "has" : "have");
        }
    }
}
