
using System;
using System.Threading.Tasks;
using backend.ApplicationServices;
using backend.DataAccess.Contracts.Teams;
using backend.DataAccess.Repositories;
using backend.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Cookies")]
    [ApiController]
    public class TeamsController : Controller
    {
        private readonly TeamRepository _allTeams;
	    private readonly AvailabilityService _availabilityService;
        public TeamsController(TeamRepository allTeams, AvailabilityService availabilityService)
        {
            _allTeams = allTeams;
        	_availabilityService = availabilityService;
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = "Cookies", Roles = UserRoles.Admin + "," + UserRoles.TeamLead + "," + UserRoles.User)]
        public async Task<ActionResult> GetTeams()
        {
            var token = new JwtSecurityTokenHandler().ReadJwtToken(Request.Cookies["token"]);
            return Ok(await _allTeams.GetAll(token));
        }

        [HttpGet("{id}")]
        [Authorize(AuthenticationSchemes = "Cookies", Roles = UserRoles.Admin + "," + UserRoles.TeamLead)]
        public async Task<ActionResult> GetTeam([FromRoute] int id)
        {
            try
            {
                return Ok(await _allTeams.Get(id));
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = "Cookies", Roles = UserRoles.Admin + "," + UserRoles.TeamLead)]
        public async Task<ActionResult> Create([FromBody] CreateTeamRequest request)
        {
            try
            {
                return Created("", await _allTeams.Create(request));
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize(AuthenticationSchemes = "Cookies", Roles = UserRoles.Admin + "," + UserRoles.TeamLead)]
        public async Task<ActionResult> Update([FromRoute] int id, [FromBody] UpdateTeamRequest request)
        {
            try
            {
                return Ok(await _allTeams.Update(id, request));
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPut("{teamId}/{userId}")]
        [Authorize(AuthenticationSchemes = "Cookies", Roles = UserRoles.Admin + "," + UserRoles.TeamLead)]
        public async Task<ActionResult> UpdateMember([FromRoute] int teamId, [FromRoute] int userId, [FromBody] UpdateMemberRequest request)
        {
            try
            {
                return Ok(await _allTeams.UpdateMember(userId, teamId, request));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        
        [HttpPut("change-members/{id}")]
        [Authorize(AuthenticationSchemes = "Cookies", Roles = UserRoles.Admin + "," + UserRoles.TeamLead)]
        public async Task<ActionResult> ChangeMembers([FromRoute] int id, [FromBody] AddTeamMembersRequest request)
        {
            try
            {
                return Ok(await _allTeams.ChangeMembers(id, request));
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = "Cookies", Roles = UserRoles.Admin + "," + UserRoles.TeamLead)]
        public async Task<ActionResult> DeleteTeam([FromRoute] int id)
        {
            try
            {
                return Ok(await _allTeams.DeleteTeam(id));
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpGet("{id}/availability")]
        [Authorize(AuthenticationSchemes = "Cookies", Roles = UserRoles.Admin + "," + UserRoles.TeamLead)]
        public async Task<ActionResult> GetAvailability([FromRoute] int id)
        {
            try
            {
                return Ok(await _availabilityService.GetFromTeam(id));
            }
            catch (Exception e)
            {
                return NotFound(e.Message);
            }
        }
    }
}
