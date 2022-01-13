using backend.ApplicationServices.Dto;
using backend.ApplicationServices.Mappers;
using backend.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using backend.DataAccess.Contracts;
using backend.DataAccess.Repositories;

namespace backend.ApplicationServices
{
    public class UserService
    {
        private readonly UserRepository _userRepository;
        private readonly UserManager<User> _userManager;
        private readonly AvailabilityRepository _availabilityRepository;

        public UserService(UserRepository userRepository, UserManager<User> userManager, AvailabilityRepository availabilityRepository)
        {
            _userRepository = userRepository;
            _userManager = userManager;
            _availabilityRepository = availabilityRepository;
        }

        public async Task<List<UserWithTeamsDto>> GetAll()
        {
            var allUsers = await _userRepository.GetAll();

            var usersWithTeams = new List<UserWithTeamsDto>(allUsers.Count);
            foreach (var user in allUsers.Where(user => user.UserName != "admin"))
            {
                var teams = await _userRepository.GetTeams(user.Id);
                var daysOffs = await _availabilityRepository.GetMany(new List<int>() { user.Id });
                usersWithTeams.Add(UserMappers.MapDtoFrom(user, teams, daysOffs));
            }
            return usersWithTeams;
        }

        public async Task<UserWithTeamsDto> GetOne(int userId)
        {
            var user = await _userRepository.GetOne(userId);
            var teams = await _userRepository.GetTeams(userId);
            var daysOffs = await _availabilityRepository.GetMany(new List<int>() { userId });
            return UserMappers.MapDtoFrom(user, teams, daysOffs);
        }

        public async Task<List<string>> UpdateUserInfo(int userId, UpdateUserRequest updateUser)
        {
            var user = await _userRepository.GetOne(userId);
            var result = await UpdateUser(user, updateUser);
            return result;
        }

        public async Task<string> UpdatePassword(int userId, string password, string updatePassword)
        {
            if (password != updatePassword)
                throw new ArgumentException("Password and confirmation password do not match.");

            var user = await _userRepository.GetOne(userId);
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, password);

            if (result.Succeeded)
            {
                return "password";
            }
            else
            {
                var errors = new StringBuilder();
                foreach (var error in result.Errors)
                    errors.Append(error.Description.Replace("Passwords", "Password") + " ");
                throw new ArgumentException(errors.ToString()[0..^1]);
            }
        }

        public async Task Delete(int userId)
        {
            var user = await _userRepository.GetOne(userId);
            await _userRepository.Delete(user);
            await SaveChanges();
        }

        private async Task SaveChanges()
        {
            try
            {
                await _userRepository.SaveChanges();
            }
            catch
            {
                throw new DbUpdateException("An error occured! Failed to save changes.");
            }
        }

        private async Task<List<string>> UpdateUser(User user, UpdateUserRequest updateUser)
        {
            var result = new List<string>();

            var newFirstName = updateUser.FirstName;
            if (newFirstName != null && newFirstName != user.FirstName)
            {
                user.FirstName = newFirstName;
                result.Add("first name");
            }

            var newLastName = updateUser.LastName;
            if (newLastName != null && newLastName != user.LastName)
            {
                user.LastName = newLastName;
                result.Add("last name");
            }

            var newTeamRole = updateUser.TeamRole;
            if (newTeamRole != null && newTeamRole != user.TeamRole)
            {
                user.TeamRole = newTeamRole;
                result.Add("team role");
            }

            if (result.Count > 0)
            {
                await SaveChanges();
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
