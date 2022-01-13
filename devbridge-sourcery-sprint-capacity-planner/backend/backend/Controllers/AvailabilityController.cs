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
    public class AvailabilityController : Controller
    {
        private readonly AvailabilityService _availabilityService;

        public AvailabilityController(AvailabilityService availabilityService)
        {
            _availabilityService = availabilityService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMany([FromBody] AvailabilityRequest request)
        {
            List<DayOffDto> daysOff;
            try
            {
                daysOff = await _availabilityService.GetMany(request.UserIds);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok(daysOff);
        }

        [HttpGet("{dayOffId}")]
        public async Task<IActionResult> GetOne([FromRoute] int dayOffId)
        {
            DayOffDto dayOff;
            try
            {
                dayOff = await _availabilityService.GetOne(dayOffId);
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
            return Ok(dayOff);
        }

        [HttpPatch("{dayOffId}")]
        public async Task<IActionResult> Update([FromRoute] int dayOffId, [FromBody] UpdateDayOffRequest updateDayOff)
        {
            (List<string> Updates, List<string> Errors) result;
            try
            {
                result = await _availabilityService.Update(dayOffId, updateDayOff);
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            string updates = await _availabilityService.IntoActionResult(result.Updates);
            int updatesCount = result.Updates.Count;
            int errorsCount = result.Errors.Count;
            
            if (updatesCount == 0 && errorsCount > 0)
            {
                return BadRequest(string.Join(" ", result.Errors));
            }
            else if (updatesCount > 0 && errorsCount > 0)
            {
                return BadRequest($"{string.Join(" ", result.Errors)} // {updates}");
            }
            else if (updatesCount == 0 && errorsCount == 0)
            {
                return BadRequest(updates);
            }
            return Ok(updates);
        }

        [HttpDelete("{dayOffId}")]
        public async Task<IActionResult> Delete([FromRoute] int dayOffId)
        {
            try
            {
                await _availabilityService.Delete(dayOffId);
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok($"Day off (id {dayOffId}) has been deleted.");
        }
    }
}
