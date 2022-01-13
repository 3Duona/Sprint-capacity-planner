using backend.ApplicationServices;
using backend.ApplicationServices.Dto;
using backend.DataAccess.Contracts;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : Controller
    {
        private readonly UserService _userService;
        private readonly AvailabilityService _availabilityService;

        public UsersController(UserService userService, AvailabilityService availabilityService)
        {
            _userService = userService;
            _availabilityService = availabilityService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> All()
        {
            List<UserWithTeamsDto> users;
            try
            {
                users = await _userService.GetAll();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok(users);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetOne([FromRoute] int userId)
        {
            UserWithTeamsDto user;
            try
            {
                user = await _userService.GetOne(userId);
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
            return Ok(user);
        }

        [HttpPatch("update/{userId}")]
        public async Task<IActionResult> Update([FromRoute] int userId, [FromBody] UpdateUserRequest updateUser)
        {
            var updated = new List<string>();
            try
            {
                updated.AddRange(await _userService.UpdateUserInfo(userId, updateUser));
                if (updateUser.Password != null)
                {
                    updated.Add(await _userService.UpdatePassword(userId,
                        updateUser.Password, updateUser.ConfirmPassword));
                }
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
            catch (ArgumentException e)
            {
                var result = "";
                if (updated.Count > 0)
                    result = $" // {await _userService.IntoActionResult(updated)}";
                return BadRequest(e.Message + result);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            if (updated.Count == 0)
            {
                return BadRequest("No changes have been received.");
            }
            return Ok(await _userService.IntoActionResult(updated));
        }

        [HttpDelete("delete/{userId}")]
        public async Task<IActionResult> Delete([FromRoute] int userId)
        {
            try
            {
                await _userService.Delete(userId);
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok($"User (id {userId}) has been deleted.");
        }

        [HttpGet("{userId}/availability")]
        public async Task<IActionResult> GetAvailability([FromRoute] int userId)
        {
            try
            {
                return Ok(await _availabilityService.GetFromUser(userId));
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPost("{userId}/availability")]
        public async Task<IActionResult> CreateDayOff([FromRoute] int userId, [FromBody] CreateDayOffRequest request)
        {
            try
            {
                return Created("", await _availabilityService.Create(userId, request));
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
